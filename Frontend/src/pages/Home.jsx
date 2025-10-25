import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardText,
  Button,
  Input,
} from "reactstrap";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaLightbulb,
  FaTimes,
} from "react-icons/fa";
import "./Home.css";
import Stories from "../components/Stories.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]); // all posts from API
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "doubts"
  const [openCommentFor, setOpenCommentFor] = useState(null); // postId
  const [commentText, setCommentText] = useState("");
  const [openSolutionFor, setOpenSolutionFor] = useState(null); // postId for doubt solution popup
  const [solutionText, setSolutionText] = useState("");
  const token = localStorage.getItem("token");

  // fetch feed posts (friends + user)
  const fetchFeedPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // initialize client-side fields if absent (likes, comments, solutions)
        const enriched = res.data.posts.map((p) => ({
          ...p,
          liked: false,
          likesCount: p.likes?.length || 0,
          comments: p.comments || [],
          solutions: p.solutions || [], // for Doubts
        }));
        setPosts(enriched);
      }
    } catch (err) {
      console.error("Failed to load feed posts", err);
      // fallback: empty feed
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchFeedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers to update a post inside posts state immutably
  const updatePost = (postId, updater) => {
    setPosts((prev) => prev.map((p) => (p._id === postId ? updater(p) : p)));
  };

  // Like toggle (frontend-only)
  const toggleLike = (postId) => {
    updatePost(postId, (p) => {
      const liked = !p.liked;
      const likesCount = liked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
      return { ...p, liked, likesCount };
    });
  };

  // Open comment popup
  const openComment = (postId) => {
    setOpenCommentFor(postId);
    setCommentText("");
  };

  // Submit comment (frontend-only)
  const submitComment = (postId) => {
    if (!commentText.trim()) return alert("Enter a comment");
    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      author: "You (demo)",
      createdAt: new Date().toISOString(),
    };
    updatePost(postId, (p) => ({ ...p, comments: [newComment, ...p.comments] }));
    setOpenCommentFor(null);
    setCommentText("");
  };

  // Share (simple copy to clipboard)
  const sharePost = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Post link copied to clipboard!");
    } catch {
      alert(`Share link: ${url}`);
    }
  };

  // Open solution popup for doubts
  const openSolutionPopup = (postId) => {
    setOpenSolutionFor(postId);
    setSolutionText("");
  };

  // Submit solution (frontend-only)
  const submitSolution = (postId) => {
    if (!solutionText.trim()) return alert("Write a solution before submitting");
    const newSolution = {
      id: Date.now(),
      text: solutionText.trim(),
      author: "You (demo)",
      createdAt: new Date().toISOString(),
    };
    updatePost(postId, (p) => ({ ...p, solutions: [newSolution, ...p.solutions] }));
    setOpenSolutionFor(null);
    setSolutionText("");
    alert("Solution added (demo)");
  };

  // Filter posts/doubts
  const postsOnly = posts.filter((p) => p.type === "Post");
  const doubtsOnly = posts.filter((p) => p.type === "Doubt");

  // Card renderer
  const renderCard = (post) => (
    <Card className="post-card">
      {/* Media area with fixed height */}
      {post.image ? (
        <CardImg
          top
          src={`http://localhost:5000/uploads/${post.image}`}
          alt="post media"
          className="post-media"
        />
      ) : post.video ? (
        <video controls className="post-media">
          <source src={`http://localhost:5000/uploads/${post.video}`} />
        </video>
      ) : (
        <div className="post-media empty-media">No media</div>
      )}

      <CardBody className="card-content">
        <div className="meta-row">
          <strong className="author-name">{post.userId?.name || "User"}</strong>
          <span className="time-text">{new Date(post.createdAt).toLocaleString()}</span>
        </div>

        <CardText className="desc-text">{post.description}</CardText>

        <div className="action-row">
          {/* Like */}
          <button
            className={`icon-btn ${post.liked ? "liked" : ""}`}
            onClick={() => toggleLike(post._id)}
            title="Like"
            aria-label="Like"
          >
            {post.liked ? <FaHeart /> : <FaRegHeart />}
            <span className="icon-label">{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            className="icon-btn"
            onClick={() => openComment(post._id)}
            title="Comment"
            aria-label="Comment"
          >
            <FaComment />
            <span className="icon-label">{post.comments.length || 0}</span>
          </button>

          {/* Share */}
          <button className="icon-btn" onClick={() => sharePost(post._id)} title="Share">
            <FaShareAlt />
            <span className="icon-label">Share</span>
          </button>

          {/* If it's a doubt -> Provide Solution */}
          {post.type === "Doubt" && (
            <button
              className="icon-btn solution-btn"
              onClick={() => openSolutionPopup(post._id)}
              title="Provide Solution"
            >
              <FaLightbulb />
              <span className="icon-label">Solution</span>
            </button>
          )}
        </div>

        {/* Show some comments preview */}
        {post.comments.length > 0 && (
          <div className="comments-preview">
            <div className="small-label">Recent:</div>
            {post.comments.slice(0, 2).map((c) => (
              <div key={c.id} className="comment-item">
                <strong>{c.author}:</strong> <span>{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* If doubt and has solutions show preview */}
        {post.type === "Doubt" && post.solutions.length > 0 && (
          <div className="solutions-preview">
            <div className="small-label">Solutions:</div>
            {post.solutions.slice(0, 2).map((s) => (
              <div key={s.id} className="solution-item">
                <strong>{s.author}:</strong> <span>{s.text}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );

  return (
    <> 
    <Stories/>
    <Container className="home-container">
      <h3 className="feed-title">Home Feed</h3>

      {/* Tabs */}
      <Row className="tabs-row">
        <Col xs="6">
          <Button
            className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </Button>
        </Col>
        <Col xs="6">
          <Button
            className={`tab-btn ${activeTab === "doubts" ? "active" : ""}`}
            onClick={() => setActiveTab("doubts")}
          >
            Doubts
          </Button>
        </Col>
      </Row>

      {/* Grid */}
      <Row className="posts-grid">
        {(activeTab === "posts" ? postsOnly : doubtsOnly).length === 0 ? (
          <p className="empty-text">No items to show</p>
        ) : (
          (activeTab === "posts" ? postsOnly : doubtsOnly).map((post) => (
            <Col key={post._id} xs="12" sm="6" md="4" lg="3" className="mb-3">
              {renderCard(post)}
            </Col>
          ))
        )}
      </Row>

      {/* Comment Popup */}
      {openCommentFor && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h5>Write a comment</h5>
              <button className="close-icon" onClick={() => setOpenCommentFor(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <Input
                type="textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <Button color="secondary" onClick={() => setOpenCommentFor(null)}>
                Cancel
              </Button>
              <Button color="primary" onClick={() => submitComment(openCommentFor)}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Solution Popup */}
      {openSolutionFor && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h5>Provide a solution</h5>
              <button className="close-icon" onClick={() => setOpenSolutionFor(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <Input
                type="textarea"
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                placeholder="Write your solution..."
                rows="6"
              />
            </div>
            <div className="modal-footer">
              <Button color="secondary" onClick={() => setOpenSolutionFor(null)}>
                Cancel
              </Button>
              <Button color="success" onClick={() => submitSolution(openSolutionFor)}>
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
      </>
  );
};

export default Home;
