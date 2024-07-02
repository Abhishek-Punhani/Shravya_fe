import { useEffect } from "react";

export default function CallTimes({
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
}) {
  useEffect(() => {
    let timer;
    if (callAccepted) {
      timer = setInterval(() => {
        setTotalSecInCall((prev) => prev + 1);
      }, 1000);
    } else {
      setTotalSecInCall(0);
    }

    return () => {
      clearInterval(timer);
      setTotalSecInCall(0);
    };
  }, [callAccepted, setTotalSecInCall]);

  return (
    <div
      className={`text-dark_text_2 ${
        totalSecInCall !== 0 ? "block" : "hidden"
      }`}
    >
      {parseInt(totalSecInCall / 3600, 10) > 0 && (
        <>
          <span>
            {parseInt(totalSecInCall / 3600, 10)
              .toString()
              .padStart(2, "0")}
          </span>
          <span>:</span>
        </>
      )}
      <span>
        {parseInt(totalSecInCall / 60, 10)
          .toString()
          .padStart(2, "0")}
      </span>
      <span>:</span>
      <span>{(totalSecInCall % 60).toString().padStart(2, "0")}</span>
    </div>
  );
}
