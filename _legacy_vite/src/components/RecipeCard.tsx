import { Recipe } from '../data/recipes';
import { Heart, Eye, Zap } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  featured?: boolean;
  compact?: boolean;
}

export function RecipeCard({ recipe, onClick, featured = false, compact = false }: RecipeCardProps) {
  const difficultyColors = {
    '초급': 'bg-green-100 text-green-700 border-green-200',
    '중급': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    '고급': 'bg-red-100 text-red-700 border-red-200',
  };

  // 컴팩트 버전 (요즘 AI 레시피용)
  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-purple-300 group"
      >
        {/* Thumbnail */}
        <div className="relative h-32 overflow-hidden bg-gray-100">
          <img
            src={recipe.thumbnail}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-3">
          {/* Title */}
          <h4 className="text-gray-900 text-sm mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {recipe.title}
          </h4>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="text-gray-600">{recipe.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-gray-600">{recipe.views}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-purple-300 group ${
        featured ? 'ring-2 ring-purple-500 ring-offset-2' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={recipe.thumbnail}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <div
            className={`${
              difficultyColors[recipe.difficulty]
            } px-3 py-1 rounded-full text-sm border backdrop-blur-sm`}
          >
            {recipe.difficulty}
          </div>
        </div>
        {featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-1">
              <span>🔥</span>
              <span>추천</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
            >
              {category}
            </span>
          ))}
          {recipe.categories.length > 2 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{recipe.categories.length - 2}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* AI Tools */}
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {recipe.aiTools.slice(0, 2).map((tool, index) => (
              <span key={index} className="text-gray-700 text-xs">
                {tool}
                {index < Math.min(recipe.aiTools.length, 2) - 1 && ', '}
              </span>
            ))}
            {recipe.aiTools.length > 2 && (
              <span className="text-gray-500 text-xs">
                +{recipe.aiTools.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={recipe.author.avatar}
              alt={recipe.author.name}
              className="w-7 h-7 rounded-full"
            />
            <span className="text-gray-700 text-sm">{recipe.author.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-gray-600 text-sm">{recipe.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-gray-600 text-sm">{recipe.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}