import axios from 'axios'
import React, { ChangeEvent, useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { useLocation, useParams } from 'wouter'

import { useSession } from '../../hooks/session'
import { bigintToStringWithDecimals } from './HomeFeed'
import MainButton from './mainbutton'

const Record: React.FC = () => {
  const { session } = useSession()
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [capturing, setCapturing] = useState<boolean>(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [video, setVideo] = useState<string | null>(null)
  const [counter, setCounter] = useState(3)
  const [videoName, setVideoName] = useState<string>('captured_video')
  const params = useParams()
  const [, setLocation] = useLocation()
  const id = params.id

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true)
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      })
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable)
      mediaRecorderRef.current.start()
    }
  }, [webcamRef, setCapturing, mediaRecorderRef])

  const handleDataAvailable = useCallback(
    (event: BlobEvent) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    },
    [setRecordedChunks],
  )

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setCapturing(false)
    }
  }, [mediaRecorderRef, setCapturing])

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      })
      const url = URL.createObjectURL(blob)
      setVideo(url)

      setRecordedChunks([])
    }
  }, [recordedChunks])

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideo(url)
      setVideoName(file.name)
    }
  }

  const videoConstraints = {
    width: 390,
    height: 390,
    facingMode: 'user',
  }

  const submitHandler = async () => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
    console.log('test')

    const response = await fetch(video)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('file', blob, videoName)
    formData.append('address', session!.address)
    formData.append('name', videoName)

    const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, config)
    console.log('submitted', result)
    setLocation('/')
  }

  return (
    <div className="Container" style={{ paddingBottom: '12rem' }}>
      <header className="header">
        <div className="logo-container">
          <div className="network-info">
            <span className="network-name">Crystal Networks</span>
          </div>
        </div>
        <div className="crystal-count">
          <div>
            {session && (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    height: '1rem',
                    marginRight: '0.1rem',
                    position: 'relative',
                    top: '0.1rem',
                  }}
                >
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
                {session.address.slice(0, 6)}..{session.address.slice(-4)}
              </span>
            )}
          </div>

          {session && session.balance !== null && (
            <span style={{ color: 'white' }}>
              {bigintToStringWithDecimals(session.balance, 7, 1)} CRYSTAL
            </span>
          )}
        </div>
      </header>
      <div className="title">{id == 'p' ? 'Plant a Tree' : 'Do 20 Squats'}</div>
      {video === null ? (
        <>
          <Webcam
            audio={true}
            height={320}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            videoConstraints={videoConstraints}
          />
          <div>
            {capturing ? (
              <button className="capture-button" onClick={handleStopCaptureClick}>
                Stop Capture
              </button>
            ) : (
              <button className="capture-button" onClick={handleStartCaptureClick}>
                Start Capture
              </button>
            )}
          </div>
          <div>
            <input type="file" accept="video/*" onChange={handleUpload} />
          </div>
        </>
      ) : (
        <>
          <video src={video} controls />
          <button
            onClick={() => {
              setVideo(null)
              setCapturing(false)
            }}
          >
            Record Again
          </button>
        </>
      )}
      {recordedChunks.length > 0 && !capturing && (
        <button onClick={handleDownload}>Download</button>
      )}

      <button className="submit" onClick={submitHandler} disabled={video == null}>
        Submit
      </button>
      <nav className="bottom-nav">
        <button className="nav-button home">Home</button>
        <MainButton />
        <button className="nav-button profile">Profile</button>
      </nav>
    </div>
  )
}

export default Record
