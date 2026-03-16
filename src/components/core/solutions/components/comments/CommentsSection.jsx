import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  getCommentsForSolution,
  addCommentToSolution,
  deleteComment,
  updateComment,
} from "@services/commentService";
import styles from "./CommentsSection.module.scss";
import { formatDistanceToNow } from "date-fns";

const CommentsSection = ({ solutionId, refreshFlag }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useSelector((state) => state.auth);

  const fetchComments = async () => {
    if (!solutionId) return;
    try {
      const res = await getCommentsForSolution(solutionId);
      if (res.code === 200) {
        setComments(res.data);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [solutionId, refreshFlag]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    try {
      const res = await addCommentToSolution(solutionId, { content: newComment });
      if (res.code === 201) {
        setNewComment("");
        fetchComments();
      }
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  return (
    <div className={styles.commentsSection}>
      <h5 className={styles.header}>Comments</h5>
      {comments.length === 0 && <p className={styles.noComments}>No comments yet.</p>}
      <div className={styles.list}>
        {comments.map((c) => (
          <div key={c._id} className={styles.comment}>
            <div className={styles.meta}>
              <span className={styles.author}>
                {c.user?.name || c.user?.username || "Anonymous"}
              </span>
              <span className={styles.time}>
                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className={styles.content}>{c.content}</div>
          </div>
        ))}
      </div>

      {user ? (
        <div className={styles.addComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="form-control"
          />
          <button
            className="btn btn-primary btn-sm mt-1"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </div>
      ) : (
        <p className={styles.loginPrompt}>Log in to post a comment</p>
      )}
    </div>
  );
};

CommentsSection.propTypes = {
  solutionId: PropTypes.string.isRequired,
  refreshFlag: PropTypes.number,
};

export default CommentsSection;
