import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamImage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [video, setVideo] = useState<string | null>(null);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    (event: BlobEvent) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVideo(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoConstraints = {
    width: 390,
    height: 390,
    facingMode: "user",
  };

  return (
    <div className="Container">
      {video === null ? (
        <>
          <Webcam
            audio={true}
            height={500}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
          />
          {capturing ? (
            <button onClick={handleStopCaptureClick}>Stop Capture</button>
          ) : (
            <button onClick={handleStartCaptureClick}>Start Capture</button>
          )}
        </>
      ) : (
        <>
          <video src={video} controls />
          <button
            onClick={() => {
              setVideo(null);
              setCapturing(false);
            }}
          >
            Record Again
          </button>
        </>
      )}
      {recordedChunks.length > 0 && !capturing && (
        <button onClick={handleDownload}>Download</button>
      )}
    </div>
  );
};

export default WebcamImage;
