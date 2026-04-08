import { useState } from 'react';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import { categories } from '../data/dummyData';

export default function SearchBar({ onSearch, onFilter }) {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat === selectedCategory ? '' : cat);
    onFilter?.(cat === selectedCategory ? '' : cat);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search courses, topics, instructors..."
            className="input-field pl-12"
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200
            ${showFilter
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            }`}
        >
          <HiOutlineFilter className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Filter</span>
        </button>
      </div>

      {showFilter && (
        <div className="mt-3 p-4 glass-card animate-slide-up">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200
                  ${selectedCategory === cat
                    ? 'gradient-bg text-white shadow-md'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
