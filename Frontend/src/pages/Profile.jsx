import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardImg,
  CardBody,
  CardText,
} from "reactstrap";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [showFriendPopup, setShowFriendPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts or doubts
  const token = localStorage.getItem("token");

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch profile data");
    }
  };

  // Fetch posts
  const fetchPosts = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch posts");
    }
  };

  // Fetch post count
  const fetchPostCount = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/count/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPostCount(res.data.count);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch post count");
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/auth/remove-friend/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to remove friend");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchPosts(user._id);
      fetchPostCount(user._id);
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  const normalPosts = posts.filter((post) => post.type === "Post");
  const doubts = posts.filter((post) => post.type === "Doubt");

  return (
    <Container className="profile-container">
      {/* Profile Header */}
      <Row className="profile-header align-items-center mb-4">
        <Col xs="12" md="3" className="text-center">
          <div className="profile-pic-emoji">🧑‍💻</div>
        </Col>
        <Col xs="12" md="9">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
          <p>
            <strong>{postCount}</strong> posts •{" "}
            <strong>
              <Button
                color="link"
                className="p-0"
                onClick={() => setShowFriendPopup(true)}
              >
                {user.friends?.length || 0} friends
              </Button>
            </strong>
          </p>
        </Col>
      </Row>

      {/* Toggle Buttons for Posts/Doubts */}
      <Row className="mb-3">
        <Col xs="6">
          <Button
            color={activeTab === "posts" ? "primary" : "secondary"}
            className="w-100"
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </Button>
        </Col>
        <Col xs="6">
          <Button
            color={activeTab === "doubts" ? "primary" : "secondary"}
            className="w-100"
            onClick={() => setActiveTab("doubts")}
          >
            Doubts
          </Button>
        </Col>
      </Row>

      {/* Posts Grid */}
      {activeTab === "posts" && (
        <Row className="posts-grid mb-4">
          {normalPosts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            normalPosts.map((post, idx) => (
              <Col key={post._id + idx} xs="12" sm="6" md="4" lg="3" className="mb-3">
                <Card className="post-card">
                  {post.image && (
                    <CardImg
                      src={`http://localhost:5000/uploads/${post.image}`}
                      alt="Post"
                    />
                  )}
                  {post.video && (
                    <video controls className="w-100">
                      <source src={`http://localhost:5000/uploads/${post.video}`} />
                    </video>
                  )}
                  <CardBody>
                    <CardText>{post.description}</CardText>
                    <CardText className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {new Date(post.createdAt).toLocaleString()}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      {/* Doubts Grid */}
      {activeTab === "doubts" && (
        <Row className="posts-grid mb-4">
          {doubts.length === 0 ? (
            <p>No doubts yet</p>
          ) : (
            doubts.map((post, idx) => (
              <Col key={post._id + idx} xs="12" sm="6" md="4" lg="3" className="mb-3">
                <Card className="post-card">
                  {post.image && (
                    <CardImg
                      src={`http://localhost:5000/uploads/${post.image}`}
                      alt="Doubt"
                    />
                  )}
                  {post.video && (
                    <video controls className="w-100">
                      <source src={`http://localhost:5000/uploads/${post.video}`} />
                    </video>
                  )}
                  <CardBody>
                    <CardText>{post.description}</CardText>
                    <CardText className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {new Date(post.createdAt).toLocaleString()}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      {/* Friend Popup */}
      {showFriendPopup && (
        <div className="friend-popup-overlay">
          <div className="friend-popup-content">
            <div className="popup-header">
              <h5>Friends</h5>
              <button
                className="close-popup"
                onClick={() => setShowFriendPopup(false)}
              >
                &times;
              </button>
            </div>
            <div className="friends-list-popup">
              {user.friends.length === 0 ? (
                <p>No friends yet</p>
              ) : (
                user.friends.map((friend, idx) => (
                  <div
                    key={friend._id + idx}
                    className="friend-popup-card d-flex justify-content-between align-items-center"
                  >
                    <span>{friend.name}</span>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveFriend(friend._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Profile;
