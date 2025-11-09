import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const RightSidebar = () => {
  const [user, setUser] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [showFriendPopup, setShowFriendPopup] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    mobile: "",
    profilePicture: null,
  });

  const token = localStorage.getItem("token");

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setUser(res.data.user);
    } catch (err) {
      console.error(err);
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
    }
  };

  // Open edit modal
  const openEditModal = () => {
    setEditData({
      name: user.name,
      bio: user.bio || "",
      mobile: user.mobile || "",
      profilePicture: null,
    });
    setEditModal(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setEditData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update profile
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
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

  if (!user) return null;

  return (
    <div
      style={{
        width: "22%",

        // marginTop: "70px",
        background: "linear-gradient(135deg, #c9d6ff, #e2e2e2)",
        padding: "20px",
        height: "100vh",
        position: "fixed",
        right: 0,
        top: 0,
        overflowY: "auto",
        boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Profile Section */}
      <Card
        style={{
          border: "none",
          borderRadius: "20px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #8EC5FC, #E0C3FC)",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <CardBody className="text-center text-dark">
          {/* Profile Picture */}
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
                border: "3px solid white",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "#fff",
                margin: "0 auto 10px",
                fontSize: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🧑‍💻
            </div>
          )}

          <h5 style={{ fontWeight: "700" }}>{user.name}</h5>
          <p style={{ marginBottom: "8px", color: "#333" }}>{user.bio || "No bio added"}</p>
          <p style={{ fontSize: "0.9rem", color: "#444" }}>📱 {user.mobile || "Not provided"}</p>
          <p>
            <strong>{user.friends?.length || 0}</strong> Friends
          </p>
          <Button color="primary" size="sm" onClick={openEditModal}>
            Edit Profile
          </Button>{" "}
          <Button color="info" size="sm" onClick={() => setShowFriendPopup(true)}>
            Friends
          </Button>
        </CardBody>
      </Card>

      {/* Friend Popup */}
      {showFriendPopup && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            right: "25%",
            background: "#fff",
            width: "300px",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            <h6>Friends</h6>
            <button
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={() => setShowFriendPopup(false)}
            >
              ✖
            </button>
          </div>
          <div style={{ marginTop: "10px", maxHeight: "250px", overflowY: "auto" }}>
            {user.friends?.length === 0 ? (
              <p>No friends yet</p>
            ) : (
              user.friends.map((friend) => (
                <div
                  key={friend._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {friend.profilePicture ? (
                      <img
                        src={friend.profilePicture}
                        alt={friend.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          marginRight: "10px",
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
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Profile</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleUpdateProfile}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Bio</Label>
              <Input
                type="text"
                name="bio"
                value={editData.bio}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Mobile</Label>
              <Input
                type="text"
                name="mobile"
                value={editData.mobile}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Profile Picture</Label>
              <Input
                type="file"
                name="profilePicture"
                onChange={handleInputChange}
                accept="image/*"
              />
            </FormGroup>
            <Button color="primary" type="submit" className="w-100">
              Update
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default RightSidebar;
