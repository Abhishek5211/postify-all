import { useState } from "react";

function ProfileNavBar() {
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSwitch = (id) => {
    setSelectedOption(id);
  };
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a
                className={`${
                  !selectedOption
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-transform duration-500 ease-in-out`}
                onClick={() => handleSwitch(0)}
              >
                Your Articles
              </a>
              <a
                className={`${
                  selectedOption
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-transform duration-500 ease-in-out`}
                onClick={() => handleSwitch(1)}
              >
                Edit Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ProfileNavBar;
