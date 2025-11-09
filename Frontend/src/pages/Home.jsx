import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import { Container, Card, CardBody } from "reactstrap";
import StoriesPage from "./StoriesPage";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts (feed)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      {/* Top Stories Section */}
      <StoriesPage />

      <div
        style={{
          display: "flex",
          backgroundColor: "#f4f6fc",
          minHeight: "100vh",
        }}
      >
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main + Right Section */}
        <div
          style={{
            marginLeft: "18%",
            marginRight: "20%",
            display: "flex",
            flex: 1,
            padding: "25px",
            gap: "25px",
          }}
        >
          {/* Main Feed Section */}
          <Container style={{ flex: 2 }}>
            {loading ? (
              <p style={{ textAlign: "center", marginTop: "50px" }}>
                Loading feed...
              </p>
            ) : posts.length === 0 ? (
              <Card
                style={{
                  border: "none",
                  borderRadius: "15px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  padding: "25px",
                  textAlign: "center",
                }}
              >
                <h4>No posts yet</h4>
                <p>Be the first to share something!</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card
                  key={post._id}
                  style={{
                    border: "none",
                    borderRadius: "15px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                    padding: "20px",
                    marginBottom: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardBody>
                    {/* Post Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <h5 style={{ margin: 0, color: "#4e54c8" }}>
                        {post.userId?.name || "Unknown User"}
                      </h5>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#888",
                        }}
                      >
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        color: "#333",
                        marginBottom: "10px",
                        fontSize: "15px",
                      }}
                    >
                      {post.description}
                    </p>

                    {/* Media (Image/Video) */}
                    {post.image && (
                      <img
                        src={`http://localhost:5000/uploads/${post.image}`}
                        alt="Post"
                        style={{
                          width: "100%",
                          maxHeight: "350px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          marginBottom: "10px",
                        }}
                      />
                    )}
                    {post.video && (
                      <video
                        controls
                        style={{
                          width: "100%",
                          maxHeight: "350px",
                          borderRadius: "12px",
                          marginBottom: "10px",
                        }}
                      >
                        <source
                          src={`http://localhost:5000/uploads/${post.video}`}
                          type="video/mp4"
                        />
                      </video>
                    )}

                    {/* Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        paddingTop: "10px",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <span style={{ color: "#4e54c8", cursor: "pointer" }}>
                        👍 Like
                      </span>
                      <span style={{ color: "#4e54c8", cursor: "pointer" }}>
                        💬 Comment
                      </span>
                      <span style={{ color: "#4e54c8", cursor: "pointer" }}>
                        🔄 Share
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </Container>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
