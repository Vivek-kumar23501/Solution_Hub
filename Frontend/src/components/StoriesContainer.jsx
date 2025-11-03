import React, { useState, useEffect } from 'react';
import Stories from './Stories';
import StoryViewer from './StoryViewer';
import StoryUpload from './StoryUpload';

// Enhanced dummy data with mixed media types
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
    media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://picsum.photos/100/100?2",
    timestamp: new Date().toISOString()
  },
  { 
    id: 3, 
    name: "yaa_its_n...", 
    media: "https://picsum.photos/400/700?3",
    thumbnail: "https://picsum.photos/100/100?3",
    timestamp: new Date().toISOString()
  },
  { 
    id: 4, 
    name: "jaiprakash...", 
    media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://picsum.photos/100/100?4",
    timestamp: new Date().toISOString()
  },
  { 
    id: 5, 
    name: "nityam_sh...", 
    media: "https://picsum.photos/400/700?5",
    thumbnail: "https://picsum.photos/100/100?5",
    timestamp: new Date().toISOString()
  },
  { 
    id: 6, 
    name: "vivek_sing...", 
    media: "https://picsum.photos/400/700?6",
    thumbnail: "https://picsum.photos/100/100?6",
    timestamp: new Date().toISOString()
  }
];

const StoriesContainer = () => {
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState(null);

  useEffect(() => {
    // Load stories from API or local storage
    setStories(dummyStories);
    
    // Load user's stories from local storage
    const savedUserStories = localStorage.getItem('userStories');
    if (savedUserStories) {
      setUserStories(JSON.parse(savedUserStories));
    }
  }, []);

  const handleStoryOpen = (storyId) => {
    setCurrentStoryId(storyId);
    setIsViewerOpen(true);
  };

  const handleAddStory = (newStory) => {
    const updatedStories = [newStory, ...userStories];
    setUserStories(updatedStories);
    localStorage.setItem('userStories', JSON.stringify(updatedStories));
  };

  const handleAddStoryClick = () => {
    setIsUploadOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setCurrentStoryId(null);
  };

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
  };

  return (
    <div className="stories-system">
      {/* Stories Bar - Top pe show hoga */}
      <Stories 
        stories={stories}
        userStories={userStories}
        onStoryOpen={handleStoryOpen}
        onAddStoryClick={handleAddStoryClick}
      />

      {/* Story Viewer - Jab story click kare tab open hoga */}
      {isViewerOpen && (
        <StoryViewer
          stories={stories}
          userStories={userStories}
          initialStoryId={currentStoryId}
          onClose={handleCloseViewer}
        />
      )}

      {/* Story Upload Modal - Jab + button click kare tab */}
      {isUploadOpen && (
        <StoryUpload
          onStoryAdd={handleAddStory}
          onClose={handleCloseUpload}
        />
      )}
    </div>
  );
};

export default StoriesContainer;