import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdEditNote } from "react-icons/md";

function UserBlogCard({
  postId,
  username,
  title,
  snippet,
  commentCount,
  handleDelete,
}) {
  UserBlogCard.propTypes = {
    postId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    snippet: PropTypes.string,
    commentCount: PropTypes.number,
  };

  const navigate = useNavigate();

  const handleEdit = async (e,postId) => {
    e.stopPropagation();
    navigate(`/edit-blog/${postId}`);
  };
  return (
    <div
      className="max-w-4xl rounded overflow-hidden shadow-lg bg-white p-6 mx-auto my-6 transition-transform transform hover:scale-105"
      onClick={() => navigate(`/blog/${postId}`)}
    >
      <div className="font-bold text-2xl cursor-pointer mb-4 text-gray-800">
        {title}
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
          <span className="text-gray-600 text-sm px-2">
            {commentCount} comments
          </span>
        </div>
        <div className="flex items-center gap-1 scale-150">
          <div onClick={(e) => handleEdit( e,postId)} className="p-1">
            <MdEditNote className="text-2xl cursor-pointer hover:scale-110" />
          </div>
          <div onClick={(e) => handleDelete(e, postId)} className="p-1">
            <MdOutlineDeleteOutline className="text-2xl cursor-pointer hover:scale-110" />
          </div>
          {/* <FaRegEdit key={postId} onClick={() =>  />
          <MdDeleteOutline key={postId} onClick={() => handleDelete(postId)} /> */}
        </div>
      </div>
    </div>
  );
}

export default UserBlogCard;
