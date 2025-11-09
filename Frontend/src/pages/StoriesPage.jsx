import React from "react";
import { Card, CardBody } from "reactstrap";

const StoriesPage = () => {
  const stories = [
    { id: 1, name: "Vivek", image: "https://i.pravatar.cc/80?img=1" },
    { id: 2, name: "Ankit", image: "https://i.pravatar.cc/80?img=2" },
    { id: 3, name: "Priya", image: "https://i.pravatar.cc/80?img=3" },
    { id: 4, name: "Rohan", image: "https://i.pravatar.cc/80?img=4" },
    { id: 5, name: "Neha", image: "https://i.pravatar.cc/80?img=5" },
    { id: 1, name: "Vivek", image: "https://i.pravatar.cc/80?img=1" },
    { id: 2, name: "Ankit", image: "https://i.pravatar.cc/80?img=2" },
    { id: 3, name: "Priya", image: "https://i.pravatar.cc/80?img=3" },
    { id: 4, name: "Rohan", image: "https://i.pravatar.cc/80?img=4" },
    { id: 5, name: "Neha", image: "https://i.pravatar.cc/80?img=5" },
    { id: 1, name: "Vivek", image: "https://i.pravatar.cc/80?img=1" },
    { id: 2, name: "Ankit", image: "https://i.pravatar.cc/80?img=2" },
    { id: 3, name: "Priya", image: "https://i.pravatar.cc/80?img=3" },
    { id: 4, name: "Rohan", image: "https://i.pravatar.cc/80?img=4" },
    { id: 5, name: "Neha", image: "https://i.pravatar.cc/80?img=5" },
    { id: 1, name: "Vivek", image: "https://i.pravatar.cc/80?img=1" },
    { id: 2, name: "Ankit", image: "https://i.pravatar.cc/80?img=2" },
    { id: 3, name: "Priya", image: "https://i.pravatar.cc/80?img=3" },
    { id: 4, name: "Rohan", image: "https://i.pravatar.cc/80?img=4" },
    { id: 5, name: "Neha", image: "https://i.pravatar.cc/80?img=5" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f4f6fc",
        marginLeft: "18%",
        marginRight: "20%",
        padding: "15px 0",
      }}
    >
      <Card
        style={{
          border: "none",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          backgroundColor: "#fff",
          padding: "15px 20px",
        }}
      >
        <CardBody
          style={{
            display: "flex",
            gap: "18px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "70px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <img
                src={story.image}
                alt={story.name}
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #6a11cb",
                  padding: "2px",
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#333",
                  marginTop: "5px",
                  fontWeight: "500",
                }}
              >
                {story.name}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default StoriesPage;
