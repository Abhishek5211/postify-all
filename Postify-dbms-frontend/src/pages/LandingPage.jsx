
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Blog</h1>
          <p className="text-xl mb-8">
            Discover insightful articles and stay updated with the latest trends.
          </p>
          <a
            href="#featured"
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold"
          >
            Explore Now
          </a>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div id="featured" className="container mx-auto py-12">
        <h2 className="text-4xl font-bold text-center mb-8">Featured Posts</h2>
        <div className="flex flex-wrap -mx-4">
          {/* Example Post Card */}
          <div className="w-full md:w-1/3 px-4 mb-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ghandruk_HDR6.jpg/960px-Ghandruk_HDR6.jpg"
                alt="Post Thumbnail"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Post Title</h3>
                <p className="text-gray-700 mb-4">
                  Rainfall A Brief description of the post goes here, short and engaging.
                </p>
                <a href="#" className="text-blue-500 font-semibold">
                  Read More →
                </a>
              </div>
            </div>
          </div>
          {/* Add more post cards as needed */}
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 Blog App. All rights reserved.</p>
          <div className="flex justify-center mt-4">
            <a href="#" className="text-blue-400 mx-2">Facebook</a>
            <a href="#" className="text-blue-400 mx-2">Twitter</a>
            <a href="#" className="text-blue-400 mx-2">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
