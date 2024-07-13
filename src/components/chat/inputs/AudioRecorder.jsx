import { useEffect, useRef, useState } from "react";
import {
  MicIcon,
  PauseIcon,
  PlayIcon,
  SendIcon,
  TrashIcon,
} from "../../../svg";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../../../features/chatSlice";
import SocketContext from "../../../contexts/SocketContext";
import ClipLoader from "react-spinners/ClipLoader";

function AudioRecorder({ setShowAudioRec, socket }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(undefined);
  const [totalDuration, setTotalDuration] = useState(undefined);
  const [recordedAudioFile, setRecordedAudioFile] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef(null);
  const recordedMediaRef = useRef(null);
  const waveFormRef = useRef(null);
  const streamRef = useRef(null); // Add a ref to hold the media stream
  const cloud_name = process.env.REACT_APP_CLOUD_NAME;
  const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { activeConversation } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveform(wavesurfer);
    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) {
      handleStartRec();
    }
  }, [waveform]);

  const handleStartRec = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        streamRef.current = stream; // Save the stream to the ref
        const mediaRecorder = new MediaRecorder(stream);
        recordedMediaRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          waveform.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStopRec = () => {
    if (recordedMediaRef.current && isRecording) {
      recordedMediaRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks
        audioRef.current.srcObject = null; // Clear the audio source object
      }

      const audioChunks = [];

      recordedMediaRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      recordedMediaRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        const audio = new Audio(URL.createObjectURL(audioFile));
        setRecordedAudio(audio);
        setRecordedAudioFile(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);

      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRec = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRec = () => {
    if (recordedAudio) {
      recordedAudio.pause();
      waveform.pause();
      setIsPlaying(false);
    }
  };

  const sendRecording = async (e) => {
    e.preventDefault();
    if (isRecording) {
      return setError("Please stop current recording!");
    }
    let formData = new FormData();
    formData.append("upload_preset", cloud_secret);
    formData.append("file", recordedAudioFile);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
      formData
    );

    //  Send message
    let values = {
      token,
      convo_id: activeConversation._id,
      message: "",
      file: {
        file: data,
        type: "AUDIO",
      },
    };
    setLoading(true);
    let newMsg = await dispatch(sendMessages(values));
    socket.emit("new_message", newMsg.payload);
    setLoading(false);
    clearRecording();
    setShowAudioRec(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const clearRecording = () => {
    if (isRecording) {
      handleStopRec();
    }
    setCurrentPlaybackTime(undefined);
    setRecordedAudio(undefined);
    setWaveform(null);
    setTotalDuration(undefined);
    setRecordedAudioFile(undefined);
  };

  return (
    <form
      className="w-full dark:bg-dark_bg_2 min-h-[50px] flex flex-col items-center absolute bottom-0 py-2 px-4 select-none"
      onSubmit={(e) => sendRecording(e)}
    >
      {/* Container */}
      <div className="w-full flex items-center gap-x-2">
        {/* trash icon */}
        <button
          type="button"
          className="btn"
          onClick={() => {
            setShowAudioRec(false);
            clearRecording();
          }}
        >
          <TrashIcon className=" dark:fill-dark_svg_2" />
        </button>
        {/* main container */}
        <div className="w-full flex items-center justify-center">
          {isRecording ? (
            <div>
              <div className="text-red-400 animate-pulse text-center ">
                Recording <span>{formatTime(recordingDuration)}s</span>
              </div>
              {/* Error */}
              {error && <p className=" text-sm text-red-500">{error}</p>}
            </div>
          ) : (
            <div>
              {recordedAudio && (
                <>
                  {!isPlaying ? (
                    <button
                      className="btn select-none"
                      type="button"
                      onClick={() => handlePlayRec()}
                    >
                      <PlayIcon className="scale-50 dark:fill-dark_svg_2" />
                    </button>
                  ) : (
                    <button
                      className="btn select-none"
                      type="button"
                      onClick={() => handlePauseRec()}
                    >
                      <PauseIcon className="scale-50 dark:fill-dark_svg_2" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          <div
            className="w-60 dark:text-dark_text_1 "
            ref={waveFormRef}
            hidden={isRecording}
          >
            {recordedAudio && isPlaying && (
              <span>{formatTime(currentPlaybackTime)}</span>
            )}
            {recordedAudio && !isPlaying && (
              <span>{formatTime(totalDuration)}</span>
            )}
            <audio ref={audioRef} hidden></audio>
          </div>
        </div>
        <div className="mr-4">
          {!isRecording ? (
            <button
              className="btn"
              onClick={() => handleStartRec()}
              type="button"
            >
              <MicIcon className="scale-[70%] fill-red-500" />
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => handleStopRec()}
              type="button"
            >
              <PauseIcon className="scale-50 fill-red-500" />
            </button>
          )}
        </div>
        {/* send icon */}
        <button className="btn" type="submit">
          {loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1  hover:bg-dark_hover_1 cursor-pointer" />
          )}
        </button>
      </div>
    </form>
  );
}

const AudioRecorderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <AudioRecorder {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default AudioRecorderWithSocket;
