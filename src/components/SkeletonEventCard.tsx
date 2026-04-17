import React from 'react';
import '../styles/eventCard.css';

const SkeletonEventCard: React.FC = () => (
  <div className="event-card skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <div className="skeleton-title" />
      <div className="skeleton-date" />
      <div className="skeleton-description" />
      <div className="skeleton-footer" />
    </div>
  </div>
);

export default SkeletonEventCard;
