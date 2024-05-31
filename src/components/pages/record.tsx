import axios from "axios";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useParams, useLocation } from "wouter";

const Record: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [counter, setCounter] = useState(3);
  const [videoName, setVideoName] = useState<string>("captured_video");
  const params = useParams();
  const [, setLocation] = useLocation()
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
    formData.append("id", counter)
    formData.append("file", blob, videoName);
    formData.append("address", "0x1234567890");
    formData.append("name", videoName);

    await axios.post("http://localhost:3000/upload", formData, config)
    console.log("submitted");
    setCounter((counter) => {
      return counter + 1;
    })
    setLocation("/")
  };

  return (
    <div className="Container">
       <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <div className="network-info">
            <span className="network-name">Crystal Networks</span>
          </div>
        </div>
        <div className="crystal-count">
          <span>70 Crystals</span>
        </div>
      </header>
        <div className="title">{id=="p"?"Plant a Tree": "Do 20 Squats"}</div>
      {video === null ? (
        <>
          <Webcam
            audio={true}
            height={600}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={800}
            videoConstraints={videoConstraints}
          />
          {capturing ? (
           <button className="capture-button" onClick={handleStopCaptureClick}>Stop Capture</button>
          ) : (
            <button className="capture-button" onClick={handleStartCaptureClick}>Start Capture</button>
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
      <nav className="bottom-nav">
        <button className="nav-button home">Home</button>
        <button className="nav-button search">Search</button>
        <MainButton />
        <button className="nav-button causes">Causes</button>
        <button className="nav-button profile">Profile</button>
      </nav>
    </div>
  );
};

export default Record;
