import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PauseIcon, PlayIcon } from "../../../../svg";

function VoiceMessage({ message }) {
  const [audioMessage, setAudioMessage] = useState(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(undefined);
  const [totalDuration, setTotalDuration] = useState(undefined);

  const waveFormRef = useRef(null);
  const waveform = useRef(null);

  const audioUrl = message?.file?.file?.secure_url;

  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });

      waveform.current.on("finish", () => {
        setIsPlaying(false);
      });

      if (audioUrl) {
        waveform.current.load(audioUrl);
        waveform.current.on("ready", () => {
          setTotalDuration(waveform.current.getDuration());
        });

        const audio = new Audio(audioUrl);
        setAudioMessage(audio);
      }
    }

    return () => {
      if (waveform.current) {
        waveform.current.destroy();
        waveform.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);

      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current.stop();
      waveform.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (audioMessage) {
      audioMessage.pause();
      waveform.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-x-6 w-fit">
      {!isPlaying ? (
        <button
          className="btn select-none"
          type="button"
          onClick={() => handlePlayAudio()}
        >
          <PlayIcon className="scale-[60%] fill-white " />
        </button>
      ) : (
        <button
          className="btn select-none bg-dark_bg_5"
          type="button"
          onClick={() => handlePauseAudio()}
        >
          <PauseIcon className="scale-50 dark:fill-dark_svg_1" />
        </button>
      )}
      <div className="relative">
        <div className="w-40" ref={waveFormRef}></div>
        <div className="text-xs text-dark_svg_2 pt-1 flex justify-start">
          {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
