import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { TagCloud } from './components/TagCloud';
import { AIToolFilter } from './components/AIToolFilter';
import { LoginModal } from './components/LoginModal';
import { recipes, Recipe, allCategories, aiTools } from './data/recipes';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAITools, setSelectedAITools] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [displayedCount, setDisplayedCount] = useState(12);
  const observerRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleAITool = (tool: string) => {
    setSelectedAITools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginMode(mode);
    setShowLoginModal(true);
  };

  // 추천 레시피 (좋아요가 많은 순으로 3개)
  const recommendedRecipes = [...recipes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  // 요즘 AI 레시피 (조회수가 많은 순으로 6개)
  const trendingRecipes = [...recipes]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // 필터된 레시피들 (추천, 트렌딩 제외)
  const recommendedIds = new Set(recommendedRecipes.map((r) => r.id));
  const trendingIds = new Set(trendingRecipes.map((r) => r.id));

  const allOtherRecipes = recipes.filter((recipe) => {
    const isNotInFeatured = !recommendedIds.has(recipe.id) && !trendingIds.has(recipe.id);
    
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => recipe.categories.includes(cat));

    const matchesAITool =
      selectedAITools.length === 0 ||
      selectedAITools.some((tool) => recipe.aiTools.includes(tool));

    return isNotInFeatured && matchesSearch && matchesCategory && matchesAITool;
  });

  const displayedRecipes = allOtherRecipes.slice(0, displayedCount);

  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < allOtherRecipes.length) {
          setDisplayedCount((prev) => prev + 12);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, allOtherRecipes.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">AI 레시피</h1>
                <p className="text-gray-600">
                  다양한 AI 활용 방법과 프롬프트를 공유하는 플랫폼
                </p>
              </div>
            </div>

            {/* Login/Signup Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => openLoginModal('login')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </button>
              <button
                onClick={() => openLoginModal('signup')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>회원가입</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="프롬프트, 태그, 키워드로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 오늘의 추천 레시피 */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">🔥 오늘의 추천 레시피!</h2>
            <p className="text-gray-600">가장 인기있는 AI 레시피를 확인해보세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                featured
              />
            ))}
          </div>
        </section>

        {/* 요즘 AI 레시피 */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">⚡ 요즘 AI 레시피!</h2>
            <p className="text-gray-600">많은 사람들이 보고 있는 트렌딩 레시피</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                compact
              />
            ))}
          </div>
        </section>

        {/* 필터 섹션 */}
        <section className="mb-8">
          {/* AI Tool Filter */}
          <div className="mb-6">
            <AIToolFilter
              aiTools={aiTools}
              selectedTools={selectedAITools}
              onToggleTool={toggleAITool}
            />
          </div>

          {/* Tag Cloud */}
          <div className="mb-6">
            <TagCloud
              categories={allCategories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
            />
          </div>
        </section>

        {/* 모든 AI 레시피 (무한 스크롤) */}
        <section>
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">📚 모든 AI 레시피</h2>
            <p className="text-gray-600">
              {allOtherRecipes.length}개의 레시피
            </p>
          </div>

          {displayedRecipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>

              {/* 무한 스크롤 트리거 */}
              {displayedCount < allOtherRecipes.length && (
                <div ref={observerRef} className="py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
                  <p className="text-gray-600 mt-4">더 많은 레시피 로딩 중...</p>
                </div>
              )}

              {displayedCount >= allOtherRecipes.length && allOtherRecipes.length > 0 && (
                <div className="py-8 text-center text-gray-600">
                  모든 레시피를 확인했습니다 ✨
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                다른 키워드로 검색하거나 필터를 조정해보세요
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          mode={loginMode}
          onClose={() => setShowLoginModal(false)}
          onSwitchMode={() =>
            setLoginMode(loginMode === 'login' ? 'signup' : 'login')
          }
        />
      )}
    </div>
  );
}
