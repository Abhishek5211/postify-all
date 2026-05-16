import React from "react";
import { useNavigate } from "react-router-dom";

function BlogCard({ postId, username, title, snippet, date, commentCount }) {
  const navigate = useNavigate();
  const handlePostViewClick = () => {
    navigate(`/blog/${postId}`);
  };
  return (
    <div
      className="max-w-5xl rounded overflow-hidden shadow-lg bg-white p-6 mx-auto my-6 transition-transform transform hover:scale-105"
      onClick={handlePostViewClick}
    >
      <div className="font-bold text-2xl mb-4 text-gray-800">{title}</div>
      <div className="flex items-center justify-end mb-5">
        <div></div>
        <div className="text-gray-400 text-sm">{date}</div>
      </div>
      <p className="text-gray-700 text-base mb-4">{snippet}</p>
      <div className="pt-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://www.pngall.com/wp-content/uploads/12/Avatar-No-Background.png"
            className="w-10 h-10 rounded-full object-cover mr-3"
            alt="profile"
            onClick={() => {}}
          />
          <span className="text-gray-800 font-semibold text-sm">
            {username}
          </span>
        </div>
        <span className="text-gray-600 text-sm">
          {commentCount + " "} comments
        </span>
      </div>
    </div>
  );
}

export default BlogCard;
