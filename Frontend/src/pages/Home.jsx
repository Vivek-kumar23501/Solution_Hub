/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
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
  FaCheckCircle,
  FaExclamationTriangle,
  FaRocket,
  FaSearch,
  FaCompass,
  FaRegCompass,
  FaRegHeart as FaRegHeartIcon,
  FaRegComment,
  FaRegPaperPlane,
  FaRegBookmark as FaRegBookmarkIcon,
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaTrophy,
  FaChartLine
} from "react-icons/fa";
import "./Home.css";
import StoriesContainer from "../components/Stories";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [openCommentFor, setOpenCommentFor] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [openSolutionFor, setOpenSolutionFor] = useState(null);
  const [solutionText, setSolutionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedPosts, setViewedPosts] = useState(new Set());
  const [shareStatus, setShareStatus] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // Mock suggestions data
  const suggestions = [
    { id: 1, username: "krain_bz3234", name: "Sahil Kumar", mutual: "Sea Ali" },
    { id: 2, username: "dhan.anjay6364", name: "", mutual: "Suggested for you" },
    { id: 3, username: "revinwan123", name: "", mutual: "Followed by _znatlib_1..." },
    { id: 4, username: "zhbpnps", name: "", mutual: "Followed by _pudisp_na..." },
    { id: 5, username: "shanaki166", name: "", mutual: "Followed by _ashian_ba..." },
    { id: 6, username: "amav_s563", name: "Amava_awana", mutual: "" }
  ];

  // Mock ranking data
  const rankings = [
    { id: 1, name: "Alex Johnson", points: 1245, avatar: "" },
    { id: 2, name: "Sarah Miller", points: 1120, avatar: "" },
    { id: 3, name: "Mike Chen", points: 980, avatar: "" },
    { id: 4, name: "Emma Davis", points: 875, avatar: "" },
    { id: 5, name: "James Wilson", points: 760, avatar: "" }
  ];

  // Navigation items
  const navItems = [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/search", icon: FaSearch, label: "Search" },
    { path: "/problems", icon: FaFileAlt, label: "Problems" },
    { path: "/challenges", icon: FaCompass, label: "Challenges" },
    { path: "/notifications", icon: FaRegHeartIcon, label: "Notifications" },
    { path: "/create", icon: FaPlus, label: "Create Post" },
    { path: "/messages", icon: FaRegPaperPlane, label: "Messages" },
    { path: "/profile", icon: FaUserCircle, label: "Profile" },
  ];

  const fetchFeedPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setLoading(true);
        setError(null);
      }
      
      const res = await axios.get(`http://localhost:5000/api/posts?page=${pageNum}&limit=9`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const enriched = res.data.posts.map((p) => ({
          ...p,
          liked: p.likes?.includes(localStorage.getItem("userId")) || false,
          bookmarked: false,
          views: Math.floor(Math.random() * 1000) + 100,
          likesCount: p.likes?.length || 0,
          comments: p.comments || [],
          solutions: p.solutions || [],
          trending: Math.random() > 0.7,
          userHasSolved: false,
        }));

        if (pageNum === 1 || refresh) {
          setPosts(enriched);
        } else {
          setPosts(prev => [...prev, ...enriched]);
        }
        
        setHasMore(res.data.posts.length === 9);
      }
    } catch (err) {
      console.error("Failed to load feed posts", err);
      setError("Failed to load posts. Please try again.");
      if (pageNum === 1) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedPosts(1, true);
  }, []);

  const updatePost = (postId, updater) => {
    setPosts((prev) => prev.map((p) => (p._id === postId ? updater(p) : p)));
  };

  const toggleLike = async (postId) => {
    const post = posts.find(p => p._id === postId);
    const newLikedState = !post.liked;
    
    updatePost(postId, (p) => {
      const likesCount = newLikedState ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
      return { ...p, liked: newLikedState, likesCount };
    });

    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update like", err);
      updatePost(postId, (p) => {
        const likesCount = !newLikedState ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
        return { ...p, liked: !newLikedState, likesCount };
      });
    }
  };

  const toggleBookmark = async (postId) => {
    const post = posts.find(p => p._id === postId);
    const newBookmarkedState = !post.bookmarked;
    
    updatePost(postId, (p) => ({
      ...p,
      bookmarked: newBookmarkedState
    }));

    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update bookmark", err);
      updatePost(postId, (p) => ({
        ...p,
        bookmarked: !newBookmarkedState
      }));
    }
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

  const submitComment = async (postId) => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
    };

    updatePost(postId, (p) => ({ 
      ...p, 
      comments: [newComment, ...p.comments] 
    }));

    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: commentText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to submit comment", err);
      updatePost(postId, (p) => ({
        ...p,
        comments: p.comments.filter(c => c.id !== newComment.id)
      }));
    }

    setOpenCommentFor(null);
    setCommentText("");
  };

  const sharePost = async (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    setShareStatus(prev => ({ ...prev, [postId]: 'Copying...' }));
    
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus(prev => ({ ...prev, [postId]: 'Copied!' }));
      setTimeout(() => {
        setShareStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[postId];
          return newStatus;
        });
      }, 2000);
    } catch {
      setShareStatus(prev => ({ ...prev, [postId]: 'Failed' }));
      setTimeout(() => {
        setShareStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[postId];
          return newStatus;
        });
      }, 2000);
      alert(`Share link: ${url}`);
    }
  };

  const openSolutionPopup = (postId) => {
    setOpenSolutionFor(postId);
    setSolutionText("");
  };

  const submitSolution = async (postId) => {
    if (!solutionText.trim()) return;
    
    const newSolution = {
      id: Date.now(),
      text: solutionText.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
      verified: false
    };

    updatePost(postId, (p) => ({ 
      ...p, 
      solutions: [newSolution, ...p.solutions] 
    }));

    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/solution`,
        { text: solutionText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to submit solution", err);
      updatePost(postId, (p) => ({
        ...p,
        solutions: p.solutions.filter(s => s.id !== newSolution.id)
      }));
    }

    setOpenSolutionFor(null);
    setSolutionText("");
  };

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeedPosts(nextPage);
  };

  const retryFetch = () => {
    fetchFeedPosts(1, true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = (now - postDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const PostCard = ({ post }) => (
    <Card 
      className={`post-card ${viewedPosts.has(post._id) ? 'viewed' : ''}`}
      onMouseEnter={() => markAsViewed(post._id)}
    >
      {/* Header with user info */}
      <div className="card-header">
        <div className="user-info">
          <div className="user-avatar">
            {post.userId?.avatar ? (
              <img 
                src={`http://localhost:5000/uploads/${post.userId.avatar}`} 
                alt="avatar"
                className="avatar-image"
              />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="user-details">
            <strong className="author-name">{post.userId?.name || "User"}</strong>
            <span className="location-text">{post.location || "Unknown"}</span>
          </div>
        </div>
        <button className="icon-btn more-btn">
          <FaEllipsisH className="more-icon" />
        </button>
      </div>

      {/* Media content */}
      {post.image && (
        <div className="media-container">
          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            alt="post media"
            className="post-media"
            loading="lazy"
          />
        </div>
      )}
      
      {post.video && (
        <div className="media-container">
          <video controls className="post-media">
            <source src={`http://localhost:5000/uploads/${post.video}`} type="video/mp4" />
          </video>
        </div>
      )}

      <CardBody className="card-content">
        {/* Action Buttons */}
        <div className="action-row">
          <div className="action-left">
            <button
              className={`icon-btn ${post.liked ? "liked" : ""}`}
              onClick={() => toggleLike(post._id)}
            >
              {post.liked ? <FaHeart className="action-icon" /> : <FaRegHeart className="action-icon" />}
            </button>
            <button
              className="icon-btn"
              onClick={() => openComment(post._id)}
            >
              <FaRegComment className="action-icon" />
            </button>
            <button 
              className="icon-btn" 
              onClick={() => sharePost(post._id)}
            >
              <FaRegPaperPlane className="action-icon" />
            </button>
          </div>
          <button 
            className="icon-btn bookmark-btn"
            onClick={() => toggleBookmark(post._id)}
          >
            {post.bookmarked ? 
              <FaBookmark className="bookmark-icon-filled" /> : 
              <FaRegBookmarkIcon className="bookmark-icon" />
            }
          </button>
        </div>

        {/* Likes count */}
        <div className="likes-count">{post.likesCount.toLocaleString()} likes</div>

        {/* Description */}
        {post.description && (
          <div className="desc-text">
            <strong>{post.userId?.name || "User"}</strong> {post.description}
          </div>
        )}

        {/* View all comments */}
        {post.comments.length > 0 && (
          <div 
            className="view-comments"
            onClick={() => openComment(post._id)}
          >
            View all {post.comments.length} comments
          </div>
        )}

        {/* Time ago */}
        <div className="time-ago">{getTimeAgo(post.createdAt)}</div>

        {/* Add comment input */}
        <div className="add-comment-section">
          <input
            type="text"
            placeholder="Add a comment..."
            className="comment-input"
            onClick={() => openComment(post._id)}
          />
          {post.type === "Doubt" && (
            <button
              className="solution-btn"
              onClick={() => openSolutionPopup(post._id)}
            >
              <FaLightbulb className="solution-btn-icon" />
            </button>
          )}
        </div>
      </CardBody>
    </Card>
  );

  const SkeletonLoader = () => (
    <div className="post-card skeleton">
      <div className="card-header">
        <div className="user-info">
          <div className="user-avatar skeleton-avatar"></div>
          <div className="user-details">
            <div className="skeleton-text skeleton-name"></div>
            <div className="skeleton-text skeleton-location"></div>
          </div>
        </div>
      </div>
      <div className="media-container">
        <div className="skeleton-media"></div>
      </div>
      <div className="card-content">
        <div className="action-row skeleton-actions">
          <div className="skeleton-icon"></div>
          <div className="skeleton-icon"></div>
          <div className="skeleton-icon"></div>
          <div className="skeleton-icon bookmark"></div>
        </div>
        <div className="skeleton-text skeleton-likes"></div>
        <div className="skeleton-text skeleton-desc"></div>
        <div className="skeleton-text skeleton-time"></div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="error-state">
      <div className="error-icon">
        <FaExclamationTriangle />
      </div>
      <h3>Unable to Load Content</h3>
      <p>{error || "Something went wrong while loading your feed."}</p>
      <button className="retry-btn" onClick={retryFetch}>
        <FaRocket className="retry-icon" />
        Try Again
      </button>
    </div>
  );

  const postsOnly = posts.filter((p) => p.type === "Post");
  const doubtsOnly = posts.filter((p) => p.type === "Doubt");
  const currentPosts = activeTab === "posts" ? postsOnly : doubtsOnly;

  return (
    <div className="instagram-app full-screen">
      <div className="main-layout">
        {/* Fixed Left Sidebar */}
        <div className="left-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-brand">
              <h1>EduGram</h1>
            </div>
            
            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <IconComponent className="nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button className="nav-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                <span>Logout</span>
              </button>
            </nav>

            {/* Ranking Section */}
            <div className="ranking-section">
              <div className="ranking-header">
                <FaTrophy className="ranking-icon" />
                <h3>Leaderboard</h3>
              </div>
              <div className="ranking-list">
                {rankings.map((user, index) => (
                  <div key={user.id} className="ranking-item">
                    <div className="rank-number">{index + 1}</div>
                    <div className="rank-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="rank-info">
                      <strong>{user.name}</strong>
                      <span>
                        <FaChartLine className="points-icon" />
                        {user.points} points
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`rank-medal medal-${index + 1}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Stories Container */}
          <StoriesContainer />

          {/* Feed Header */}
          <div className="feed-header">
            <div className="header-tabs">
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
                Problems ({doubtsOnly.length})
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="posts-feed">
            {error && !loading ? (
              <ErrorState />
            ) : loading && page === 1 ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            ) : currentPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {activeTab === "posts" ? <FaFileAlt /> : <FaQuestionCircle />}
                </div>
                <h3>No {activeTab} to show</h3>
                <p>Be the first to create a {activeTab.slice(0, -1)}!</p>
                <Link to="/create" className="create-post-btn">
                  <FaPlus className="create-icon" />
                  Create {activeTab.slice(0, -1)}
                </Link>
              </div>
            ) : (
              currentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}

            {/* Additional skeleton loaders for pagination */}
            {loading && page > 1 && (
              Array.from({ length: 2 }).map((_, index) => (
                <SkeletonLoader key={`skeleton-${index}`} />
              ))
            )}
          </div>

          {/* Load More Button */}
          {!loading && hasMore && currentPosts.length > 0 && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={loadMorePosts}>
                Load More {activeTab === 'posts' ? 'Posts' : 'Problems'}
              </button>
            </div>
          )}
        </div>

        {/* Fixed Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-card">
            <div className="user-profile">
              <div className="profile-avatar">
                <FaUserCircle className="avatar-icon" />
              </div>
              <div className="profile-info">
                <strong>your_username</strong>
                <span>Your Name</span>
              </div>
              <button className="switch-btn">Switch</button>
            </div>
            
            <div className="suggestions-header">
              <span>Suggested for you</span>
              <button className="see-all">See All</button>
            </div>
            
            <div className="suggestion-list">
              {suggestions.map(item => (
                <div key={item.id} className="suggestion-item">
                  <div className="suggestion-user">
                    <div className="suggestion-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="suggestion-info">
                      <strong>{item.username}</strong>
                      <span>{item.mutual}</span>
                    </div>
                  </div>
                  <button className="follow-btn">Follow</button>
                </div>
              ))}
            </div>

            {/* Footer Links */}
            <div className="sidebar-footer">
              <div className="footer-links">
                <a href="#">About</a>
                <a href="#">Help</a>
                <a href="#">Press</a>
                <a href="#">API</a>
                <a href="#">Jobs</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Locations</a>
                <a href="#">Language</a>
                <a href="#">Meta Verified</a>
              </div>
              <div className="copyright">
                © 2025 INSTAGRAM FROM META
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {openCommentFor && (
        <div className="modal-overlay">
          <div className="modal-content comment-modal">
            <div className="modal-header">
              <h3>Comments</h3>
              <button className="close-btn" onClick={() => setOpenCommentFor(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="comment-input-group">
                <Input
                  type="textarea"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className="modal-textarea"
                  autoFocus
                  maxLength="500"
                />
                <button 
                  className="post-comment-btn"
                  onClick={() => submitComment(openCommentFor)}
                  disabled={!commentText.trim()}
                >
                  <FaPaperPlane />
                </button>
              </div>
              <div className="char-count">
                {commentText.length}/500
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solution Modal */}
      {openSolutionFor && (
        <div className="modal-overlay">
          <div className="modal-content solution-modal">
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
                placeholder="Write your detailed solution..."
                rows="6"
                className="modal-textarea"
                autoFocus
                maxLength="2000"
              />
              <div className="char-count">
                {solutionText.length}/2000
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setOpenSolutionFor(null)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => submitSolution(openSolutionFor)}
                disabled={!solutionText.trim()}
              >
                <FaLightbulb className="submit-icon" /> Submit Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;