import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { currentUser } = user;
  

  return (
    <header className="shadow sticky z-50 top-0 px-20">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 flex justify-even items-center">
        <div>
          <Link to="/" className="flex items-center px-4 lg:px-6 cursor-pointer">
            <h1 className="font-bold text-sm sm:text-4xl flex flex-wrap cursor-pointer">
              <span className="text-blue-400">Post</span>
              <span className="text-blue-800">ify</span>
            </h1>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between mx-auto max-w-screen-xl">
          <div className="flex flex-wrap gap-8">
            <form className="bg-slate-100 border-2 text-xl border-gray-200 rounded-full flex items-center p-3  hover:border-gray-700">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-24 sm:w-64"
              />
              <FaSearch className="text-slate-400 rounded-lg fa-lg border-transparent hover:cursor-pointer"></FaSearch>
            </form>
            <ul className="flex flex-wrap gap-4 items-center text-xl space-x-5">
              <Link to={"/home"}>
                <li className="hidden sm:inline text-slate-700  hover:text-blue-800">
                  Home
                </li>
              </Link>
              <Link to={"/personal-page"}>
                <li className="hidden sm:inline text-slate-700  hover:text-blue-800">
                  Personal Page
                </li>
              </Link>
              {currentUser ? (
                <>
                  <Link to={"/profile"}>
                    <li>
                      <img
                        src='https://neko-performance.ch/wp-content/uploads/1200px-OOjs_UI_icon_userAvatar-progressive.svg_.png'
                        className="w-8 h-8 rounded-full object-cover hover:scale-110"
                        alt="profile"
                        onClick={() => navigate("/profile")}
                      />
                    </li>
                  </Link>
                  <Link to={"/create-blog"}>
                      <li className="bg-blue-500 text-white p-3 rounded-lg">Create Blog</li>
                  </Link>
                </>
              ) : (
                <Link to={"/signin"}>
                  <li className="hidden sm:inline text-slate-700  hover:text-blue-800">
                    Sign In
                  </li>
                </Link>
              )}
              <Link to={"/signup"}>
                {!currentUser && (
                  <li className="hidden sm:inline text-white bg-blue-500 p-3 rounded-lg  ">
                    Sign Up
                  </li>
                )}
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
