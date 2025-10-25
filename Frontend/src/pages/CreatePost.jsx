import { useState } from "react";
import { Container, Form, FormGroup, Input, Button, Row, Col } from "reactstrap";
import axios from "axios";
import { FaCamera, FaVideo, FaTimes } from "react-icons/fa";

const CreatePost = () => {
  const [activeTab, setActiveTab] = useState("post"); // post or doubt
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const handleFileSelect = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.onchange = (e) => {
      if (type === "image") setImage(e.target.files[0]);
      else setVideo(e.target.files[0]);
    };
    input.click();
  };

  const removeFile = (type) => {
    if (type === "image") setImage(null);
    else setVideo(null);
  };

  const handleSubmit = async () => {
    if (!description && !image && !video) return alert("Add some content!");

    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/create-${activeTab}`,
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
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabButtonStyle = (tab) => ({
    background: activeTab === tab ? (tab === "post" ? "linear-gradient(90deg, #6c5ce7, #00b894)" : "linear-gradient(90deg, #fd79a8, #e84393)") : "#dfe6e9",
    color: activeTab === tab ? "#fff" : "#636e72",
    border: "none",
    borderRadius: "50px",
    padding: "0.6rem 1.5rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: activeTab === tab ? "0 8px 20px rgba(0,0,0,0.25)" : "none",
  });

  const inputStyle = {
    minHeight: "120px",
    borderRadius: "12px",
    padding: "1rem",
    fontSize: "1rem",
    border: "2px solid #a29bfe",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
    transition: "0.3s",
  };

  const iconStyle = {
    cursor: "pointer",
    transition: "0.3s",
  };

  const filePreviewStyle = {
    position: "relative",
    display: "inline-block",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.5s",
  };

  const removeIconStyle = {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#fff",
    background: "rgba(0,0,0,0.6)",
    borderRadius: "50%",
    padding: "3px",
    cursor: "pointer",
  };

  return (
    <Container
      style={{
        maxWidth: "720px",
        marginTop: "2rem",
        padding: "2rem",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
        animation: "fadeIn 0.6s ease-in-out",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Row className="mb-3 justify-content-center">
        <Col xs="auto">
          <Button style={tabButtonStyle("post")} onClick={() => setActiveTab("post")}>
            Post Your Post
          </Button>
        </Col>
        <Col xs="auto">
          <Button style={tabButtonStyle("doubt")} onClick={() => setActiveTab("doubt")}>
            Post Your Doubt
          </Button>
        </Col>
      </Row>

      <Form style={{ background: "#fff", padding: "1.5rem", borderRadius: "15px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
        <FormGroup>
          <Input
            type="textarea"
            placeholder={activeTab === "post" ? "What's on your mind?" : "Describe your doubt..."}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 10px rgba(108,92,231,0.5)")}
            onBlur={(e) => (e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.05)")}
          />
        </FormGroup>

        <Row className="mt-3">
          <Col xs="auto">
            <FaCamera
              size={28}
              style={{ ...iconStyle, color: "#6c5ce7" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              title="Upload Image"
              onClick={() => handleFileSelect("image")}
            />
          </Col>
          <Col xs="auto">
            <FaVideo
              size={28}
              style={{ ...iconStyle, color: "#fd79a8" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              title="Upload Video"
              onClick={() => handleFileSelect("video")}
            />
          </Col>
        </Row>

        <div className="mt-3 d-flex flex-wrap">
          {image && (
            <div style={filePreviewStyle}>
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <FaTimes style={removeIconStyle} onClick={() => removeFile("image")} />
            </div>
          )}
          {video && (
            <div style={filePreviewStyle}>
              <video
                src={URL.createObjectURL(video)}
                controls
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <FaTimes style={removeIconStyle} onClick={() => removeFile("video")} />
            </div>
          )}
        </div>

        <Button
          className="mt-3 w-100"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            borderRadius: "30px",
            padding: "0.8rem",
            fontWeight: "600",
            fontSize: "1.1rem",
            background: activeTab === "post" ? "linear-gradient(90deg, #6c5ce7, #00b894)" : "linear-gradient(90deg, #fd79a8, #e84393)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isSubmitting ? "Posting..." : activeTab === "post" ? "Post" : "Post Doubt"}
        </Button>
      </Form>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
};

export default CreatePost;
