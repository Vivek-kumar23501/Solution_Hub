import { useState } from "react";
import { Container, Form, FormGroup, Input, Button, Row, Col } from "reactstrap";
import axios from "axios";
import { FaCamera, FaVideo, FaTimes, FaImage, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [activeTab, setActiveTab] = useState("post"); // post or doubt
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleFileSelect = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (type === "image") {
          setImage(file);
          setVideo(null); // Remove video if image is selected
        } else {
          setVideo(file);
          setImage(null); // Remove image if video is selected
        }
      }
    };
    input.click();
  };

  const removeFile = () => {
    setImage(null);
    setVideo(null);
  };

  const handleSubmit = async () => {
    if (!description.trim() && !image && !video) {
      alert("Please add some content!");
      return;
    }

    const formData = new FormData();
    formData.append("description", description.trim());
    formData.append("type", activeTab === "post" ? "Post" : "Doubt");
    
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert(`${activeTab === "post" ? "Post" : "Doubt"} created successfully!`);
        setDescription("");
        setImage(null);
        setVideo(null);
        navigate("/"); // Redirect to home after successful post
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <Container className="create-post-wrapper">
        {/* Header */}
        <div className="create-post-header">
          <h2>Create New {activeTab === "post" ? "Post" : "Doubt"}</h2>
          <p>Share your {activeTab === "post" ? "thoughts and experiences" : "questions and problems"}</p>
        </div>

        {/* Tab Selection */}
        <div className="tab-selector">
          <button
            className={`tab-btn ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            <FaFileAlt className="tab-icon" />
            Create Post
          </button>
          <button
            className={`tab-btn ${activeTab === "doubt" ? "active" : ""}`}
            onClick={() => setActiveTab("doubt")}
          >
            <FaImage className="tab-icon" />
            Ask Doubt
          </button>
        </div>

        {/* Content Form */}
        <div className="create-post-form">
          <FormGroup>
            <Input
              type="textarea"
              placeholder={
                activeTab === "post" 
                  ? "What's on your mind? Share your thoughts..." 
                  : "Describe your doubt or problem in detail..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="post-textarea"
              rows="6"
            />
            <div className="char-counter">
              {description.length}/500
            </div>
          </FormGroup>

          {/* Media Upload Section */}
          <div className="media-upload-section">
            <div className="upload-buttons">
              <button
                className="upload-btn"
                onClick={() => handleFileSelect("image")}
                disabled={!!video}
              >
                <FaCamera className="upload-icon" />
                Add Image
              </button>
              <button
                className="upload-btn"
                onClick={() => handleFileSelect("video")}
                disabled={!!image}
              >
                <FaVideo className="upload-icon" />
                Add Video
              </button>
            </div>

            {/* File Preview */}
            {(image || video) && (
              <div className="file-preview">
                <div className="preview-container">
                  {image && (
                    <div className="preview-item">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="preview-image"
                      />
                      <button className="remove-btn" onClick={removeFile}>
                        <FaTimes />
                      </button>
                      <div className="file-info">
                        <span>{image.name}</span>
                        <span>{(image.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  )}
                  {video && (
                    <div className="preview-item">
                      <video
                        src={URL.createObjectURL(video)}
                        controls
                        className="preview-video"
                      />
                      <button className="remove-btn" onClick={removeFile}>
                        <FaTimes />
                      </button>
                      <div className="file-info">
                        <span>{video.name}</span>
                        <span>{(video.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || (!description.trim() && !image && !video)}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Publishing...
              </>
            ) : (
              `Publish ${activeTab === "post" ? "Post" : "Doubt"}`
            )}
          </Button>
        </div>
      </Container>

      <style jsx>{`
        .create-post-container {
          min-height: 100vh;
          background: #000000;
          padding: 2rem 0;
        }

        .create-post-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .create-post-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .create-post-header h2 {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .create-post-header p {
          color: #888888;
          font-size: 1rem;
        }

        .tab-selector {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: #111111;
          padding: 0.5rem;
          border-radius: 12px;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #888888;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          background: #222222;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        .create-post-form {
          background: #111111;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid #222222;
        }

        .post-textarea {
          background: #000000 !important;
          border: 1px solid #333333 !important;
          border-radius: 12px !important;
          color: #ffffff !important;
          font-size: 1rem !important;
          resize: vertical !important;
          min-height: 150px !important;
          padding: 1rem !important;
        }

        .post-textarea::placeholder {
          color: #666666 !important;
        }

        .post-textarea:focus {
          border-color: #555555 !important;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1) !important;
        }

        .char-counter {
          text-align: right;
          color: #666666;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .media-upload-section {
          margin: 1.5rem 0;
        }

        .upload-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .upload-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #333333;
          border-radius: 8px;
          background: #000000;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-btn:hover:not(:disabled) {
          border-color: #555555;
          background: #1a1a1a;
        }

        .upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-icon {
          font-size: 1rem;
        }

        .file-preview {
          margin-top: 1rem;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #333333;
        }

        .preview-image,
        .preview-video {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          display: block;
        }

        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0, 0, 0, 0.8);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: rgba(255, 0, 0, 0.8);
        }

        .file-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          padding: 1rem;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: #ffffff !important;
          color: #000000 !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #e0e0e0 !important;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid #000000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .create-post-container {
            padding: 1rem;
          }

          .create-post-form {
            padding: 1.5rem;
          }

          .tab-selector {
            flex-direction: column;
          }

          .upload-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default CreatePost;