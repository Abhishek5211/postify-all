import { useEffect, useState } from "react";
import ProfileNavBar from "../components/ProfileNavBar/ProfileNavBar";
import UserBlogCard from "../components/UserBlogCard/UserBlogCard";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

function PersonalPage() {
  const { user } = useSelector((state) => state.user);
  const { currentUser } = user;

  const [posts, setPosts] = useState([]);

  const handleDelete = async (e, postId) => {
    e.stopPropagation();
    const res = await fetch(`/api/post/delete/${postId}`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
      return;
    } else {
      toast.success(data.message);
      setPosts((oldPosts) => {
        return oldPosts.filter((wrapper) => wrapper.post.post_id != postId);
      });
    }
  };

  const fetchPostByUser = async (userId) => {
    try {
      const res = await fetch(`/api/post/user/${userId}`);
      if (!res.ok) console.log("Error in Backend");
      const data = await res.json();

      const temp = data.posts.map((item) => ({
        post: item.post,
        user: item.user,
        commentCount: item.comment_count,
      }));
      console.log(temp);

      setPosts([...temp]);
    } catch (e) {
      console.log("Error occured during fetching" + e.message);
    }
  };

  useEffect(() => {
    fetchPostByUser(currentUser.id);
  }, []);

  return (
    <div className="flex justify-start min-h-screen mx-96 flex-col">
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
      <div className="p-10">
        <h1 className="text-3xl font-bold">
          Welcome {currentUser.firstname + " " + currentUser.lastname}!
        </h1>
      </div>
      <ProfileNavBar />
      <div className="mt-2 flex-col justify-center">
        {posts !== null ? (
          posts.map((wrapper) => (
            <UserBlogCard
              key={wrapper.post.post_id}
              postId={wrapper.post.post_id}
              username={wrapper.user.firstname + " " + wrapper.user.lastname}
              title={wrapper.post.title}
              snippet={wrapper.post.content.slice(0, 1000)}
              commentCount={wrapper.commentCount}
              setPosts={setPosts}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div>No Posts</div>
        )}
      </div>
    </div>
  );
}

export default PersonalPage;
