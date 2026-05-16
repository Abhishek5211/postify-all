import { createContext, useEffect, useState } from "react";
import Category from "../components/Category/Category";
import BlogCard from "../components/BlogCard/BlogCard";
import { format } from "date-fns";

export const CategoryContext = createContext();

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchPost = async () => {
    try {
      if (
        selectedCategory === null ||
        selectedCategory === "0" ||
        selectedCategory === ""
      ) {
        const res = await fetch(`/api/post`);
        if (!res.ok) console.log("Error in Backend");
        const data = await res.json();

        const temp = data.posts.map((item) => ({
          post: item.post,
          user: item.user,
          commentCount: item.comment_count,
        }));
        setPosts([...temp]);
      } else {
        const categoryId = selectedCategory.category_id;
        const res = await fetch(`/api/category/${categoryId}`);
        console.log(selectedCategory.category_id);
        if (!res.ok) console.log("Error in Backend");
        const data = await res.json();

        const temp = data.category.posts.map((item) => ({
          post: item,
          user: item.user,
          commentCount: item.comment_count,
        }));
        setPosts([...temp]);
      }
    } catch (e) {
      console.log("Error occured during fetching" + e.message);
    }
  };
  useEffect(() => {
    fetchPost();
  }, [selectedCategory]);

  return (
    <div className="bg-white">
      <CategoryContext.Provider
        value={{ selectedCategory, setSelectedCategory }}
      >
        <Category />
      </CategoryContext.Provider>
      {posts !== null ? (
        posts.map((wrapper) => (
          <BlogCard
            key={wrapper.post.post_id}
            postId={wrapper.post.post_id}
            username={wrapper.user.firstname + " " + wrapper.user.lastname}
            title={wrapper.post.title}
            date={format(
              new Date(wrapper.post.created_at),
              "MMMM do, yyyy h:mm a"
            )}
            snippet={wrapper.post.content.slice(0, 1000)}
            commentCount={wrapper.commentCount}
          />
        ))
      ) : (
        <div>No Posts</div>
      )}
    </div>
  );
}
