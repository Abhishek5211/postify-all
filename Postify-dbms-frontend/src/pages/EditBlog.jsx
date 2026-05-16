import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBlog = async () => {
    try {
      const blogId = params.blogId;
      const res = await fetch(`/api/post/${blogId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      setTitle(data.post.title);
      setBody(data.post.content);
      console.log(data.post);
      const category = data.post.categories.map(
        (category) => category.category_id
      );
      console.log(category);

      setSelectedCategories(category);
    } catch (e) {
      throw console.error(e);
    }
  };

  const handleSelect = (categoryId) => {
    console.log(categoryId);
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      console.log("noo");
    } else {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBlog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedCategories);
    try {
      const formData = {
        title,
        content: body,
        categoryIds: selectedCategories,
        postId: params.blogId,
      };

      const res = await fetch("/api/post/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        navigate("/");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="p-8 min-h-screen flex justify-center items-center">
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
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
          Update a Post
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="body"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Write your post..."
              rows="10"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.category_id}
                  type="button"
                  onClick={() => {
                    handleSelect(category.category_id);
                  }}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCategories.includes(category.category_id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
