import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Badge,
  Spinner
} from "reactstrap";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaLightbulb,
  FaTimes,
  FaUserCircle,
  FaEllipsisH,
  FaBookmark,
  FaRegBookmark,
  FaFire,
  FaEye,
  FaRegEye,
  FaHome,
  FaFileAlt,
  FaQuestionCircle,
  FaPlus,
  FaPaperPlane,
  FaCheckCircle
} from "react-icons/fa";
import "./Home.css";
import StoriesContainer from "../components/StoriesContainer";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [openCommentFor, setOpenCommentFor] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [openSolutionFor, setOpenSolutionFor] = useState(null);
  const [solutionText, setSolutionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewedPosts, setViewedPosts] = useState(new Set());
  const token = localStorage.getItem("token");

  const fetchFeedPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const enriched = res.data.posts.map((p) => ({
          ...p,
          liked: false,
          bookmarked: false,
          views: Math.floor(Math.random() * 1000) + 100,
          likesCount: p.likes?.length || 0,
          comments: p.comments || [],
          solutions: p.solutions || [],
          trending: Math.random() > 0.7,
        }));
        setPosts(enriched);
      }
    } catch (err) {
      console.error("Failed to load feed posts", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  const updatePost = (postId, updater) => {
    setPosts((prev) => prev.map((p) => (p._id === postId ? updater(p) : p)));
  };

  const toggleLike = (postId) => {
    updatePost(postId, (p) => {
      const liked = !p.liked;
      const likesCount = liked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
      return { ...p, liked, likesCount };
    });
  };

  const toggleBookmark = (postId) => {
    updatePost(postId, (p) => ({
      ...p,
      bookmarked: !p.bookmarked
    }));
  };

  const markAsViewed = (postId) => {
    if (!viewedPosts.has(postId)) {
      setViewedPosts(prev => new Set([...prev, postId]));
    }
  };

  const openComment = (postId) => {
    setOpenCommentFor(postId);
    setCommentText("");
  };

  const submitComment = (postId) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
    };
    updatePost(postId, (p) => ({ ...p, comments: [newComment, ...p.comments] }));
    setOpenCommentFor(null);
    setCommentText("");
  };

  const sharePost = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      const shareBtn = document.querySelector(`[data-post="${postId}"]`);
      if (shareBtn) {
        const originalText = shareBtn.querySelector('span').textContent;
        shareBtn.querySelector('span').textContent = 'Copied!';
        setTimeout(() => {
          shareBtn.querySelector('span').textContent = originalText;
        }, 2000);
      }
    } catch {
      alert(`Share link: ${url}`);
    }
  };

  const openSolutionPopup = (postId) => {
    setOpenSolutionFor(postId);
    setSolutionText("");
  };

  const submitSolution = (postId) => {
    if (!solutionText.trim()) return;
    const newSolution = {
      id: Date.now(),
      text: solutionText.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
      verified: false
    };
    updatePost(postId, (p) => ({ ...p, solutions: [newSolution, ...p.solutions] }));
    setOpenSolutionFor(null);
    setSolutionText("");
  };

  const postsOnly = posts.filter((p) => p.type === "Post");
  const doubtsOnly = posts.filter((p) => p.type === "Doubt");

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = (now - postDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderCard = (post) => (
    <Card 
      className={`post-card ${viewedPosts.has(post._id) ? 'viewed' : ''} ${post.trending ? 'trending' : ''}`}
      onMouseEnter={() => markAsViewed(post._id)}
    >
      {/* Header with user info */}
      <div className="card-header">
        <div className="user-info">
          <div className="user-avatar">
            <FaUserCircle className="avatar-icon" />
          </div>
          <div className="user-details">
            <div className="user-main">
              <strong className="author-name">{post.userId?.name || "User"}</strong>
              {post.trending && (
                <Badge className="trending-badge" color="warning">
                  <FaFire className="fire-icon" /> Trending
                </Badge>
              )}
            </div>
            <span className="time-text">{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
        <div className="post-actions">
          <button 
            className="icon-btn bookmark-btn"
            onClick={() => toggleBookmark(post._id)}
          >
            {post.bookmarked ? <FaBookmark className="bookmark-icon-filled" /> : <FaRegBookmark className="bookmark-icon" />}
          </button>
          <button className="icon-btn more-btn">
            <FaEllipsisH className="more-icon" />
          </button>
        </div>
      </div>

      {/* Media content */}
      {post.image ? (
        <div className="media-container">
          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            alt="post media"
            className="post-media"
            loading="lazy"
          />
        </div>
      ) : post.video ? (
        <div className="media-container">
          <video controls className="post-media">
            <source src={`http://localhost:5000/uploads/${post.video}`} />
          </video>
        </div>
      ) : null}

      <CardBody className="card-content">
        {/* Description */}
        {post.description && (
          <div className="desc-text">{post.description}</div>
        )}

        {/* Stats */}
        <div className="stats-row">
          <span className="stat">
            <FaHeart className="stat-icon" /> {post.likesCount}
          </span>
          <span className="stat">
            <FaComment className="stat-icon" /> {post.comments.length}
          </span>
          <span className="stat">
            {viewedPosts.has(post._id) ? <FaEye className="stat-icon" /> : <FaRegEye className="stat-icon" />} {post.views}
          </span>
          {post.type === "Doubt" && (
            <span className="stat">
              <FaLightbulb className="stat-icon" /> {post.solutions.length}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="action-row">
          <button
            className={`action-btn ${post.liked ? "liked" : ""}`}
            onClick={() => toggleLike(post._id)}
          >
            {post.liked ? <FaHeart className="action-icon" /> : <FaRegHeart className="action-icon" />}
            <span>{post.liked ? "Liked" : "Like"}</span>
          </button>

          <button
            className="action-btn"
            onClick={() => openComment(post._id)}
          >
            <FaComment className="action-icon" />
            <span>Comment</span>
          </button>

          <button 
            className="action-btn" 
            onClick={() => sharePost(post._id)}
            data-post={post._id}
          >
            <FaShareAlt className="action-icon" />
            <span>Share</span>
          </button>

          {post.type === "Doubt" && (
            <button
              className="action-btn solution"
              onClick={() => openSolutionPopup(post._id)}
            >
              <FaLightbulb className="action-icon" />
              <span>Solve</span>
            </button>
          )}
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <div className="comments-preview">
            {post.comments.slice(0, 2).map((c) => (
              <div key={c.id} className="comment-item">
                <strong>{c.author}:</strong> {c.text}
              </div>
            ))}
            {post.comments.length > 2 && (
              <div 
                className="view-more"
                onClick={() => openComment(post._id)}
              >
                View {post.comments.length - 2} more comments
              </div>
            )}
          </div>
        )}

        {/* Solutions Preview */}
        {post.type === "Doubt" && post.solutions.length > 0 && (
          <div className="solutions-preview">
            <div className="preview-title">
              <FaLightbulb className="solution-icon" /> Solutions
            </div>
            {post.solutions.slice(0, 1).map((s) => (
              <div key={s.id} className="solution-item">
                <div className="solution-header">
                  <strong>{s.author}</strong>
                  {s.verified && <FaCheckCircle className="verified-icon" />}
                </div>
                <span>{s.text}</span>
              </div>
            ))}
            {post.solutions.length > 1 && (
              <div 
                className="view-more"
                onClick={() => openSolutionPopup(post._id)}
              >
                View {post.solutions.length - 1} more solutions
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );

  const SkeletonLoader = () => (
    <Col lg="6" xl="4" className="mb-4">
      <Card className="post-card skeleton">
        <div className="card-header">
          <div className="user-info">
            <div className="user-avatar skeleton-avatar"></div>
            <div className="user-details">
              <div className="skeleton-text skeleton-name"></div>
              <div className="skeleton-text skeleton-time"></div>
            </div>
          </div>
        </div>
        <div className="media-container">
          <div className="skeleton-media"></div>
        </div>
        <CardBody className="card-content">
          <div className="skeleton-text skeleton-desc"></div>
          <div className="skeleton-text skeleton-desc"></div>
          <div className="stats-row">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  return (
    <div className="home-dark-app">
      <StoriesContainer />
      
      <Container className="home-container">
        {/* Header */}
        <div className="feed-header">
          <div className="header-main">
            <h2 className="feed-title">
              <FaHome className="title-icon" />
              Home Feed
            </h2>
            <div className="header-stats">
              <span className="stat-badge">
                <FaFileAlt className="stat-icon" /> {postsOnly.length} Posts
              </span>
              <span className="stat-badge">
                <FaQuestionCircle className="stat-icon" /> {doubtsOnly.length} Doubts
              </span>
            </div>
          </div>
          
          <div className="tab-navigation">
            <button
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              <FaFileAlt className="tab-icon" />
              Posts ({postsOnly.length})
            </button>
            <button
              className={`tab ${activeTab === "doubts" ? "active" : ""}`}
              onClick={() => setActiveTab("doubts")}
            >
              <FaQuestionCircle className="tab-icon" />
              Doubts ({doubtsOnly.length})
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <Row className="posts-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          ) : (activeTab === "posts" ? postsOnly : doubtsOnly).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {activeTab === "posts" ? <FaFileAlt /> : <FaQuestionCircle />}
              </div>
              <h3>No {activeTab} to show</h3>
              <p>Be the first to create a {activeTab.slice(0, -1)}!</p>
              <Button className="create-btn" color="primary">
                <FaPlus className="create-icon" />
                Create {activeTab.slice(0, -1)}
              </Button>
            </div>
          ) : (
            (activeTab === "posts" ? postsOnly : doubtsOnly).map((post) => (
              <Col key={post._id} lg="6" xl="4" className="mb-4">
                {renderCard(post)}
              </Col>
            ))
          )}
        </Row>

        {/* Load More Button */}
        {!loading && (activeTab === "posts" ? postsOnly : doubtsOnly).length > 0 && (
          <div className="load-more-container">
            <Button className="load-more-btn" outline>
              Load More Posts
            </Button>
          </div>
        )}

        {/* Comment Modal */}
        {openCommentFor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  <FaComment className="modal-icon" />
                  Add Comment
                </h3>
                <button className="close-btn" onClick={() => setOpenCommentFor(null)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <Input
                  type="textarea"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="4"
                  className="modal-textarea"
                  autoFocus
                />
                <div className="char-count">
                  {commentText.length}/500
                </div>
              </div>
              <div className="modal-actions">
                <Button className="btn-secondary" onClick={() => setOpenCommentFor(null)}>
                  Cancel
                </Button>
                <Button 
                  className="btn-primary" 
                  onClick={() => submitComment(openCommentFor)}
                  disabled={!commentText.trim()}
                >
                  <FaPaperPlane className="submit-icon" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Solution Modal */}
        {openSolutionFor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  <FaLightbulb className="modal-icon" />
                  Provide Solution
                </h3>
                <button className="close-btn" onClick={() => setOpenSolutionFor(null)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <Input
                  type="textarea"
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  placeholder="Write your detailed solution... (Markdown supported)"
                  rows="6"
                  className="modal-textarea"
                  autoFocus
                />
                <div className="char-count">
                  {solutionText.length}/2000
                </div>
              </div>
              <div className="modal-actions">
                <Button className="btn-secondary" onClick={() => setOpenSolutionFor(null)}>
                  Cancel
                </Button>
                <Button 
                  className="btn-success" 
                  onClick={() => submitSolution(openSolutionFor)}
                  disabled={!solutionText.trim()}
                >
                  <FaLightbulb className="submit-icon" /> Submit Solution
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;