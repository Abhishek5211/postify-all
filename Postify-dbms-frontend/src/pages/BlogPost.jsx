import React, { useEffect, useState } from "react";
import CommentSection from "../components/Comment/CommentSection";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogPost = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState({
    username: "",
    title: "",
    body: "",
    date: "",
    category: "",
  });

  const [totalComments, setTotalComments] = useState(0);

  const [comments, setComments] = useState(0);

  const fetchComments = async () => {
    try {
      const blogId = params.blogId;
      const res = await fetch(`/api/comment/${blogId}`);
      const data = await res.json();
      if (res.ok) {
        setTotalComments(data.allComments.totalComments);
        setComments(data.allComments.comments);
      }
    } catch (e) {
      throw console.log(e);
    }
  };

  const handleCommentSubmit = async (comment) => {
    // Handle comment submission logic here
    try {
      const formData = {
        postId: params.blogId,
        content: comment,
      };
      console.log(formData);

      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchComments();
      }
    } catch (e) {
       toast.error(e.message);
      navigate('/signin');
    }
  };

  const fetchListing = async () => {
    try {
      const blogId = params.blogId;
      const res = await fetch(`/api/post/${blogId}`);
      const data = await res.json();

      console.log(data);
      setBlogPost({
        username: data.post.user.firstname + " " + data.post.user.lastname,
        title: data.post.title || "",
        body: data.post.content || "",
        date:
          format(new Date(data.post.created_at), "MMMM do, yyyy h:mm a") || "",
        category: data.post.categories,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    fetchListing();
    fetchComments();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          {blogPost.title}
        </h1>
        <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
          <div className="flex items-center">
            <img
              src="https://www.pngall.com/wp-content/uploads/12/Avatar-No-Background.png"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <span className="font-medium text-gray-700">
              By {blogPost.username}
            </span>
          </div>
          <div>{blogPost.date}</div>
        </div>
        <div className="mb-6">
          {blogPost.category &&
            blogPost.category.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {category.name}
              </span>
            ))}
        </div>
        <div className="text-gray-700 text-lg leading-relaxed mb-6">
          {blogPost.body}
        </div>
        <div className="border-t pt-4 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{totalComments} Comments</h2>
          <CommentSection
            postId={params.postId}
            handleCommentSubmit={handleCommentSubmit}
          />
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.comment_id}
                className="mb-6 p-4 bg-gray-100 rounded-lg transition"
              >
                <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                  <div className="flex items-center">
                    <img
                      src="https://www.pngall.com/wp-content/uploads/12/Avatar-No-Background.png"
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="font-medium text-gray-700">
                      {comment.user.firstname + ' ' + comment.user.lastname}
                    </span>
                  </div>
                  <div>{format(new Date(comment.created_at), 'MMMM do, yyyy h:mm a') }</div>
                </div>
                <div className="text-gray-700 text-base">{comment.content}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-600">No comments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
