import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, Button } from "reactstrap";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

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

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/auth/remove-friend/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert(res.data.message);
        fetchProfile(); // refresh profile data
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove friend");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (user) fetchPosts(user._id);
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Card style={{ maxWidth: "600px", margin: "auto", padding: "1rem", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <CardBody>
          <CardTitle tag="h4">{user.name}</CardTitle>
          <CardText><strong>Email:</strong> {user.email}</CardText>
          <CardText><strong>Mobile:</strong> {user.mobile}</CardText>
          <CardText><strong>User ID:</strong> {user._id}</CardText>

          <h5 style={{ marginTop: "1rem" }}>Friends</h5>
          {user.friends.length === 0 ? (
            <p>No friends yet</p>
          ) : (
            <ListGroup>
              {user.friends.map((friend) => (
                <ListGroupItem key={friend._id} className="d-flex justify-content-between align-items-center">
                  <span>
                    {friend.name} - {friend.email} - {friend.mobile}
                  </span>
                  <Button color="danger" size="sm" onClick={() => handleRemoveFriend(friend._id)}>
                    Remove
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}

          <h5 style={{ marginTop: "1rem" }}>My Posts & Doubts</h5>
          {posts.length === 0 ? (
            <p>No posts or doubts yet</p>
          ) : (
            posts.map((post) => (
              <Card key={post._id} style={{ marginBottom: "0.5rem" }}>
                <CardBody>
                  <CardText>
                    <strong>Type:</strong> {post.type.toUpperCase()}
                  </CardText>
                  <CardText>{post.description}</CardText>
                  <CardText style={{ fontSize: "0.8rem", color: "#888" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </CardText>
                </CardBody>
              </Card>
            ))
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default Profile;
