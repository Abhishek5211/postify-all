import React, { useState } from "react";

const CommentSection = ({postId, handleCommentSubmit }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCancel = () => {
    setComment("");
  };

  return (
    <div className="max-w-full mx-auto bg-white p-4 rounded-lg border border-gray-500 mb-6">
      <textarea
        className="w-full focus:outline-none appearance-none p-2 border border-gray-300 hover:border-gray-300 rounded mb-4"
        placeholder="Write a comment..."
        value={comment}
        required
        onChange={handleCommentChange}
      ></textarea>
      <div className="flex items-center justify-end">
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-200 rounded-xl" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded-xl transition"
            onClick={() => {
              handleCommentSubmit(comment);
              setComment("");
            }}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
