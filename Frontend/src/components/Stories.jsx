import React from "react";
import "./Stories.css";

const dummyStories = [
  { id: 1, name: "kumar_su...", img: "https://via.placeholder.com/100" },
  { id: 2, name: "rajjwardha...", img: "https://via.placeholder.com/100" },
  { id: 3, name: "yaa_its_n...", img: "https://via.placeholder.com/100" },
  { id: 4, name: "jaiprakash...", img: "https://via.placeholder.com/100" },
  { id: 5, name: "nityam_sh...", img: "https://via.placeholder.com/100" },
  { id: 6, name: "vivek_sing...", img: "https://via.placeholder.com/100" }
];

const Stories = () => {
  return (
    <div className="stories-container">
      <div className="stories-wrapper">
        {dummyStories.map((story) => (
          <div key={story.id} className="story-item">
            <div className="story-ring">
              <img src={story.img} alt={story.name} className="story-img" />
            </div>
            <p className="story-name">{story.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
