import { useContext, useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { CategoryContext } from "../../pages/Home";

const Category = () => {
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const [categories, setCategories] = useState([]);

  const handleSelect = (option) => {
    const data = categories.filter(
      (category) => category.category_id === option
    );
    if (data) setSelectedCategory(data[0]);
  };

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
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleClear = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white mx-auto flex-col flex-wrap max-w-5xl">
      <h1 className="text-4xl font-bold mb-2">Explore</h1>
      <p className="text-lg mb-6">Find an article.</p>
      <div>
        <span className="text-lg font-semibold mb-4 block">
          Sort by area of interest
        </span>
        <div className="flex flex-wrap gap-3">
          {selectedCategory === null ? (
            categories.map((category) => (
              <button
                key={category.category_id}
                onClick={() => handleSelect(category.category_id)}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-800 hover:bg-blue-200"
              >
                {category.name}
              </button>
            ))
          ) : (
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-gray-100 rounded-full text-gray-800 flex items-center">
                <IoMdCheckmark />
                {selectedCategory.name}
              </div>
              <button onClick={handleClear} className="text-blue-600 underline">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
