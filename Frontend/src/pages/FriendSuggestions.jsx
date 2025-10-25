import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";

const FriendSuggestions = () => {
  const [users, setUsers] = useState([]); // all users
  const [friendRequests, setFriendRequests] = useState([]); // received requests
  const [sentRequests, setSentRequests] = useState([]); // requests sent by me
  const [activeTab, setActiveTab] = useState("allUsers");

  const token = localStorage.getItem("token");

  // Fetch all users and friend requests
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users");
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/friend-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setFriendRequests(res.data.friendRequests);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch friend requests");
      }
    };

    const fetchSentRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/sent-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setSentRequests(res.data.sentRequests);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchFriendRequests();
    fetchSentRequests();
  }, [token]);

  // Send friend request
  const handleAddFriend = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/send-friend-request/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSentRequests((prev) => [...prev, res.data.requestedUser]);
        setUsers(users.filter((user) => user._id !== id)); // remove from all users
        alert("Friend request sent!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send friend request");
    }
  };

  // Accept friend request
  const handleAcceptRequest = async (senderId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/accept-friend-request/${senderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setFriendRequests(friendRequests.filter((user) => user._id !== senderId));
        alert("Friend request accepted!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to accept friend request");
    }
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#34495e" }}>Friends</h2>

      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "allUsers" })}
            onClick={() => setActiveTab("allUsers")}
            style={{ cursor: "pointer" }}
          >
            All Users
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "requests" })}
            onClick={() => setActiveTab("requests")}
            style={{ cursor: "pointer" }}
          >
            Friend Requests
          </NavLink>
        </NavItem>
      </Nav>

      {/* All Users Tab */}
      {activeTab === "allUsers" && (
        <Row className="g-4" style={{ marginTop: "1rem" }}>
          {users.length === 0 ? (
            <p style={{ margin: "1rem", textAlign: "center", color: "#636e72" }}>
              No users available
            </p>
          ) : (
            users.map((user) => (
              <Col xs="12" sm="6" md="4" key={user._id}>
                <Card
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                    padding: "1rem",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <CardImg
                    src={`https://i.pravatar.cc/150?u=${user.email}`}
                    alt={user.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      margin: "auto",
                      objectFit: "cover",
                      border: "2px solid #6c5ce7",
                    }}
                  />
                  <CardBody>
                    <h5>{user.name}</h5>
                    <p style={{ fontSize: "0.9rem", color: "#636e72" }}>{user.email}</p>
                    <Button
                      color="primary"
                      style={{
                        borderRadius: "30px",
                        padding: "0.5rem 1.5rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s",
                      }}
                      onClick={() => handleAddFriend(user._id)}
                    >
                      Add Friend
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      {/* Friend Requests Tab */}
      {activeTab === "requests" && (
        <Row className="g-4" style={{ marginTop: "1rem" }}>
          {friendRequests.length === 0 && sentRequests.length === 0 ? (
            <p style={{ margin: "1rem", textAlign: "center", color: "#636e72" }}>
              No friend requests
            </p>
          ) : (
            <>
              {friendRequests.map((user) => (
                <Col xs="12" sm="6" md="4" key={user._id}>
                  <Card
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                      padding: "1rem",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <CardImg
                      src={`https://i.pravatar.cc/150?u=${user.email}`}
                      alt={user.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        margin: "auto",
                        objectFit: "cover",
                        border: "2px solid #00b894",
                      }}
                    />
                    <CardBody>
                      <h5>{user.name}</h5>
                      <p style={{ fontSize: "0.9rem", color: "#636e72" }}>{user.email}</p>
                      <Button
                        color="success"
                        style={{
                          borderRadius: "30px",
                          padding: "0.5rem 1.5rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.3s",
                        }}
                        onClick={() => handleAcceptRequest(user._id)}
                      >
                        Accept
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}

              {sentRequests.map((user) => (
                <Col xs="12" sm="6" md="4" key={user._id}>
                  <Card
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                      padding: "1rem",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s",
                    }}
                  >
                    <CardImg
                      src={`https://i.pravatar.cc/150?u=${user.email}`}
                      alt={user.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        margin: "auto",
                        objectFit: "cover",
                        border: "2px solid #fd79a8",
                      }}
                    />
                    <CardBody>
                      <h5>{user.name}</h5>
                      <p style={{ fontSize: "0.9rem", color: "#636e72" }}>{user.email}</p>
                      <Button color="secondary" disabled>
                        Requested
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </>
          )}
        </Row>
      )}
    </Container>
  );
};

export default FriendSuggestions;
