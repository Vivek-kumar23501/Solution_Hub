import React, { useRef, useState } from "react";
import "./StoryUpload.css";

const StoryUpload = ({ onStoryAdd, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeFilter, setActiveFilter] = useState("none");
  const [isDragging, setIsDragging] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // 🎥 Open camera
  const handleOpenCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Camera access denied or not available.");
      setUseCamera(false);
    }
  };

  // 📸 Capture photo from camera
  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const imgUrl = canvas.toDataURL("image/png");
    setPreviewUrl(imgUrl);
    setUseCamera(false);

    // Stop camera
    const stream = videoRef.current.srcObject;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = () => {
    if (previewUrl && onStoryAdd) {
      const newStory = {
        id: Date.now(),
        name: "You",
        media: previewUrl,
        thumbnail: previewUrl,
        timestamp: new Date().toISOString(),
      };
      onStoryAdd(newStory);
      onClose();
    }
  };

  const isVideo = selectedFile?.type?.startsWith("video/");

  return (
    <div className="story-upload-overlay">
      <div className="story-upload-container">
        {/* Header */}
        <div className="upload-header">
          <h2>Add to Story</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Camera View */}
        {useCamera ? (
          <div className="camera-view">
            <video ref={videoRef} autoPlay playsInline className="camera-feed" />
            <button className="capture-btn" onClick={handleCapture}>
              📸 Capture
            </button>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    className={`upload-preview filter-${activeFilter}`}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={`upload-preview filter-${activeFilter}`}
                  />
                )
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <p>Drag photo or video here</p>
                  <p className="upload-subtext">or click to select</p>
                </div>
              )}
            </div>

            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={{ display: "none" }}
            />

            {/* Filter Options */}
            {previewUrl && !isVideo && (
              <div className="filter-options">
                <button
                  className={activeFilter === "none" ? "active" : ""}
                  onClick={() => setActiveFilter("none")}
                >
                  Normal
                </button>
                <button
                  className={activeFilter === "bw" ? "active" : ""}
                  onClick={() => setActiveFilter("bw")}
                >
                  B&W
                </button>
                <button
                  className={activeFilter === "bright" ? "active" : ""}
                  onClick={() => setActiveFilter("bright")}
                >
                  Bright
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="upload-actions">
              {!previewUrl && (
                <button className="camera-btn" onClick={handleOpenCamera}>
                  Open Camera
                </button>
              )}

              {previewUrl && (
                <button
                  className="change-btn"
                  onClick={() => {
                    setPreviewUrl("");
                    setSelectedFile(null);
                  }}
                >
                  Change Media
                </button>
              )}

              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={!previewUrl}
              >
                Share to Story
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryUpload;
