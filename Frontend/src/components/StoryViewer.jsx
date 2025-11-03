import React, { useState, useEffect, useRef, useCallback } from 'react';
import './StoryViewer.css';

const StoryViewer = ({ 
  stories, 
  initialStoryId, 
  onClose, 
  userStories = [] 
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const allStories = [...userStories, ...stories];
  const currentStory = allStories[currentStoryIndex];

  // Auto progress
  useEffect(() => {
    if (paused || !loaded) return;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 0.2; // 5 seconds per story
      });
    }, 10);

    return () => clearInterval(progressIntervalRef.current);
  }, [paused, loaded, currentStoryIndex]);

  // Find initial story index
  useEffect(() => {
    const index = allStories.findIndex(story => story.id === initialStoryId);
    if (index !== -1) {
      setCurrentStoryIndex(index);
    }
  }, [initialStoryId]);

  const handleNext = useCallback(() => {
    if (currentStoryIndex < allStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
      setLoaded(false);
    } else {
      onClose();
    }
  }, [currentStoryIndex, allStories.length]);

  const handlePrev = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
      setLoaded(false);
    }
  }, [currentStoryIndex]);

  const handleMediaLoad = () => {
    setLoaded(true);
    if (currentStory.media.endsWith('.mp4') && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext(); // Swipe left
      } else {
        handlePrev(); // Swipe right
      }
    }
    setPaused(false);
  };

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 3) {
      handlePrev(); // Click left third
    } else if (clickX > (2 * width) / 3) {
      handleNext(); // Click right third
    } else {
      setPaused(prev => !prev); // Click middle to pause
    }
  };

  if (!currentStory) return null;

  const isVideo = currentStory.media.endsWith('.mp4');

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer-container">
        {/* Progress Bars */}
        <div className="progress-bars">
          {allStories.map((_, index) => (
            <div key={index} className="progress-bar-container">
              <div 
                className={`progress-bar ${index === currentStoryIndex ? 'active' : ''} ${
                  index < currentStoryIndex ? 'completed' : ''
                }`}
              >
                {index === currentStoryIndex && (
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="story-header">
          <div className="user-info">
            <img 
              src={currentStory.thumbnail || currentStory.media} 
              alt={currentStory.name}
              className="user-avatar"
            />
            <span className="username">{currentStory.name}</span>
            <span className="story-time">24h</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Story Content */}
        <div 
          className="story-content"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={currentStory.media}
              className="story-media"
              onLoadedData={handleMediaLoad}
              onEnded={handleVideoEnd}
              muted
              playsInline
            />
          ) : (
            <img
              src={currentStory.media}
              alt="Story"
              className="story-media"
              onLoad={handleMediaLoad}
            />
          )}
          
          {/* Pause Indicator */}
          {paused && (
            <div className="pause-indicator">⏸</div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button className="nav-arrow prev-arrow" onClick={handlePrev}>
          ‹
        </button>
        <button className="nav-arrow next-arrow" onClick={handleNext}>
          ›
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;