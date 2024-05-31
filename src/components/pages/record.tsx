import axios from "axios";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useParams } from "wouter";

const test: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>("captured_video");
  const params = useParams();
  const id = params.id;

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

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideo(url);
      setVideoName(file.name);
    }
  };

  const videoConstraints = {
    width: 390,
    height: 390,
    facingMode: "user",
  };

  const submitHandler = async() => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    console.log("test")

    const response = await fetch(video);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, videoName);
    formData.append("address", "0x1234567890");
    formData.append("name", videoName);

    const data = await axios.post("http://localhost:3000/upload", formData, config)
    console.log(data)
    console.log("submitted");
  };

  return (
    <div className="Container">
        <div className="title">{id=="p"?"Plant a Tree": "Do 20 Squats"}</div>
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
          <div>
            <input type="file" accept="video/*" onChange={handleUpload} />
          </div>
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

      <button className="submit" onClick={submitHandler} disabled={video==null}>Submit</button>
    </div>
  );
};

export default test;
