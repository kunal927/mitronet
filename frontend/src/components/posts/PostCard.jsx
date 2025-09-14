import React, { useState } from "react";
import "./PostCard.css";

const PostCard = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post._id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post._id, newComment);
      setNewComment("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Just now";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.profileImg ? (
              <img
                src={`https://mitronet.onrender.com/${post.profileImg}`}
                alt={post.FullName}
              />
            ) : (
              <div className="avatar-placeholder">
                {post.FullName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="author-info">
            <h4 className="author-name">{post.FullName || "Unknown User"}</h4>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <div className="post-menu">
          <button className="menu-btn">⋯</button>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <div className="action-stats">
          <span className="like-count">{post.likes?.length || 0} likes</span>
          <span className="comment-count">
            {post.comments?.length || 0} comments
          </span>
        </div>

        <div className="action-buttons">
          <button
            className={`action-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <span className="action-icon">{isLiked ? "❤️" : "🤍"}</span>
            Like
          </button>

          <button
            className="action-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="action-icon">💬</span>
            Comment
          </button>

          <button className="action-btn">
            <span className="action-icon">📤</span>
            Share
          </button>
        </div>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit">
              Post
            </button>
          </form>

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-avatar">
                    <div className="avatar-placeholder">
                      {comment.userName?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="comment-content">
                    <div className="comment-bubble">
                      <strong>{comment.userName}</strong>
                      <p>{comment.text}</p>
                    </div>
                    <span className="comment-date">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
