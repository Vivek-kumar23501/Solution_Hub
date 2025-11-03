import React, { useState, useRef, useEffect } from "react";
import "./Stories.css";

// Dummy fallback stories
const dummyStories = [
  { 
    id: 1, 
    name: "kumar_su...",
    media: "https://picsum.photos/400/700", 
    thumbnail: "https://picsum.photos/100/100",
    timestamp: new Date().toISOString()
  },
  { 
    id: 2, 
    name: "rajjwardha...",
    media: "https://picsum.photos/400/700?2",
    thumbnail: "https://picsum.photos/100/100?2",
    timestamp: new Date().toISOString()
  }
];

export default function Stories({
  stories = dummyStories,
  userStories = [],
  onStoryOpen,
  onAddStoryClick
}) {
  const [seenStories, setSeenStories] = useState(new Set());
  const scrollRef = useRef(null);

  // Load seen stories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("seenStories");
    if (saved) setSeenStories(new Set(JSON.parse(saved)));
  }, []);

  // Mark story as seen and open viewer
  const handleStoryClick = (storyId) => {
    const updated = new Set([...seenStories, storyId]);
    setSeenStories(updated);
    localStorage.setItem("seenStories", JSON.stringify([...updated]));

    if (onStoryOpen) onStoryOpen(storyId);
  };

  const isSeen = (id) => seenStories.has(id);

  return (
    <div className="stories-container">
      <div className="stories-wrapper" ref={scrollRef}>
        {/* ➕ Add Story */}
        <div className="story-item add-story" onClick={onAddStoryClick}>
          <div className="story-ring add-ring">
            <div className="add-story-icon">+</div>
          </div>
          <p className="story-name">Your Story</p>
        </div>

        {/* 🧍 User's Own Stories */}
        {userStories.map((story) => (
          <div
            key={`user-${story.id}`}
            className="story-item"
            onClick={() => handleStoryClick(story.id)}
          >
            <div className={`story-ring ${isSeen(story.id) ? "seen" : "unseen"}`}>
              <img
                src={story.thumbnail || story.media}
                alt={story.name}
                className="story-img"
                loading="lazy"
              />
            </div>
            <p className="story-name">{story.name}</p>
          </div>
        ))}

        {/* 👥 Other Users' Stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="story-item"
            onClick={() => handleStoryClick(story.id)}
          >
            <div className={`story-ring ${isSeen(story.id) ? "seen" : "unseen"}`}>
              <img
                src={story.thumbnail || story.media}
                alt={story.name}
                className="story-img"
                loading="lazy"
              />
            </div>
            <p className="story-name">{story.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
