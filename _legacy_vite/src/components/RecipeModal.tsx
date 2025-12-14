import { Recipe } from '../data/recipes';
import { X, Copy, Lightbulb, CheckCircle, Zap, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recipe.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    '초급': 'bg-green-100 text-green-700',
    '중급': 'bg-yellow-100 text-yellow-700',
    '고급': 'bg-red-100 text-red-700',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Thumbnail */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img
            src={recipe.thumbnail}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-3">
              {recipe.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
              <span
                className={`${difficultyColors[recipe.difficulty]} backdrop-blur-sm px-3 py-1 rounded-full text-sm`}
              >
                {recipe.difficulty}
              </span>
            </div>
            <h2 className="text-white">{recipe.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Author and Stats */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={recipe.author.avatar}
                alt={recipe.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-900">{recipe.author.name}</p>
                <p className="text-gray-600 text-sm">{recipe.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-gray-700">{recipe.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-gray-700">{recipe.views}</span>
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-gray-900">권장 AI 도구</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.aiTools.map((tool, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-4 py-2 rounded-lg border border-blue-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-gray-900 mb-3">태그</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">프롬프트</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>복사하기</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                {recipe.prompt}
              </pre>
            </div>
          </div>

          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-gray-900">활용 팁</h3>
            </div>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-purple-600 flex-shrink-0">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          {recipe.examples && recipe.examples.length > 0 && (
            <div>
              <h3 className="text-gray-900 mb-3">예시</h3>
              <div className="space-y-2">
                {recipe.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <p className="text-gray-700 text-sm">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}