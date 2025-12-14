import { Tag } from 'lucide-react';

interface TagCloudProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export function TagCloud({
  categories,
  selectedCategories,
  onToggleCategory,
}: TagCloudProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-gray-600" />
        <h2 className="text-gray-900">카테고리 태그</h2>
        <span className="text-gray-500 text-sm">
          (복수 선택 가능)
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
