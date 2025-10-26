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
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [showFriendPopup, setShowFriendPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts or doubts
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    mobile: "",
    profilePicture: null,
  });

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

  // Open Edit Profile Modal
  const openEditModal = () => {
    setEditData({
      name: user.name,
      bio: user.bio || "",
      mobile: user.mobile || "",
      profilePicture: null,
    });
    setEditModal(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setEditData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit updated profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("bio", editData.bio);
      formData.append("mobile", editData.mobile);
      if (editData.profilePicture) {
        formData.append("profilePicture", editData.profilePicture);
      }

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        setEditModal(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
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
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-pic-img"
              style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div className="profile-pic-emoji">🧑‍💻</div>
          )}
        </Col>
        <Col xs="12" md="9">
          <h2>{user.name}</h2>
          <p>{user.bio || "No bio provided"}</p>
          <p>
            <strong>{postCount}</strong> posts •{" "}
            <strong>
              <Button color="link" className="p-0" onClick={() => setShowFriendPopup(true)}>
                {user.friends?.length || 0} friends
              </Button>
            </strong>
          </p>
          <Button color="primary" onClick={openEditModal}>
            Edit Profile
          </Button>
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
            normalPosts.map((post) => (
              <Col key={post._id} xs="12" sm="6" md="4" lg="3" className="mb-3">
                <Card className="post-card">
                  {post.image && <CardImg src={`http://localhost:5000/uploads/${post.image}`} alt="Post" />}
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
            doubts.map((post) => (
              <Col key={post._id} xs="12" sm="6" md="4" lg="3" className="mb-3">
                <Card className="post-card">
                  {post.image && <CardImg src={`http://localhost:5000/uploads/${post.image}`} alt="Doubt" />}
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
        <div className="friend-popup-overlay" onClick={() => setShowFriendPopup(false)}>
          <div className="friend-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h5>Friends</h5>
              <button className="close-popup" onClick={() => setShowFriendPopup(false)}>
                &times;
              </button>
            </div>
            <div className="friends-list-popup">
              {user.friends.length === 0 ? (
                <p>No friends yet</p>
              ) : (
                user.friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="friend-popup-card d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      {friend.profilePicture ? (
                        <img
                          src={friend.profilePicture}
                          alt={friend.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "#ccc",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      <span>{friend.name}</span>
                    </div>
                    <Button color="danger" size="sm" onClick={() => handleRemoveFriend(friend._id)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Profile</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleUpdateProfile}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={user.email}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="bio">Bio</Label>
              <Input
                type="text"
                name="bio"
                value={editData.bio}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mobile">Mobile</Label>
              <Input
                type="text"
                name="mobile"
                value={editData.mobile}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="profilePicture">Profile Picture</Label>
              <Input
                type="file"
                name="profilePicture"
                onChange={handleInputChange}
                accept="image/*"
              />
            </FormGroup>
            <Button color="primary" type="submit" className="w-100">
              Update Profile
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Profile;
