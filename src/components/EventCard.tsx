import { Bookmark, Check, Copy, Share2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { AppEvent } from "../App";
import "../styles/eventCard.css";

interface EventCardProps {
  event: AppEvent;
  toggleSaved: (id: number) => void;
}

export default function EventCard({ event, toggleSaved }: EventCardProps) {
  function handleSavedClick(e: React.MouseEvent) {
    e.preventDefault(); // Prevents navigation to the link
    toggleSaved(event.id);
  }

  function handleShareClick(e: React.MouseEvent) {
    e.preventDefault(); // Prevents navigation to the link
    setUrlDialog(true);
  }

  const [urlDialog, setUrlDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/event/${event.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <>
      <article className="event-card">
        <Link
          to={`/event/${event.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="event-image-container">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="event-image"
            />
            <div className="event-actions">
              <button
                className={`action-btn ${event.isSaved ? "active" : ""}`}
                onClick={handleSavedClick}
              >
                <Bookmark
                  size={16}
                  color={event.isSaved ? "var(--accent-color)" : "currentColor"}
                />
              </button>
              <button className="action-btn" onClick={handleShareClick}>
                <Share2 size={16} />
              </button>
            </div>
          </div>
          <div className="skeleton-content">
            <div
              className="skeleton-title"
              style={{
                background: "none",
                color: "var(--text-color)",
                height: "auto",
                width: "auto",
                fontWeight: 600,
                fontSize: "1.1rem",
                padding: 0,
              }}
            >
              {event.title}
            </div>
            <div
              className="skeleton-date"
              style={{
                background: "none",
                color: "#666",
                height: "auto",
                width: "auto",
                fontSize: "0.9rem",
                padding: 0,
              }}
            >
              {event.dateFrom}
            </div>
            <div
              className="skeleton-description"
              style={{
                background: "none",
                color: "#666",
                height: "auto",
                width: "auto",
                fontSize: "0.95rem",
                padding: 0,
              }}
            >
              {event.description}
            </div>
            <div
              className="skeleton-footer"
              style={{
                background: "none",
                color: "var(--accent-color)",
                height: "auto",
                width: "auto",
                fontSize: "0.85rem",
                padding: 0,
              }}
            >
              {event.categories}
            </div>
          </div>
        </Link>
      </article>

      {urlDialog && (
        <div
          className="calendar-modal-overlay"
          onClick={() => setUrlDialog(false)}
        >
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <h3>Odkaz na akci</h3>
              <button
                className="calendar-modal-close"
                onClick={() => setUrlDialog(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="calendar-modal-body">
              <p>Zkopírujte si odkaz pro sdílení:</p>

              <div className="url-copy-wrapper">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/event/${event.id}`}
                  className="url-copy-input"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  className="primary-button url-copy-button"
                  onClick={handleCopyUrl}
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  {isCopied ? "Zkopírováno" : "Kopírovat"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
