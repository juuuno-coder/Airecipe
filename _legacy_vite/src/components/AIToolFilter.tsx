import { Sparkles } from 'lucide-react';

interface AIToolFilterProps {
  aiTools: string[];
  selectedTools: string[];
  onToggleTool: (tool: string) => void;
}

export function AIToolFilter({
  aiTools,
  selectedTools,
  onToggleTool,
}: AIToolFilterProps) {
  const toolIcons: Record<string, string> = {
    ChatGPT: '🤖',
    Claude: '🧠',
    Gemini: '✨',
    Midjourney: '🎨',
    'DALL-E': '🖼️',
    'Stable Diffusion': '🎭',
    'GitHub Copilot': '💻',
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h2 className="text-gray-900">AI 서비스</h2>
        <span className="text-gray-500 text-sm">
          (복수 선택 가능)
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {aiTools.map((tool) => {
          const isSelected = selectedTools.includes(tool);
          return (
            <button
              key={tool}
              onClick={() => onToggleTool(tool)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <span className="text-lg">{toolIcons[tool] || '🔧'}</span>
              <span>{tool}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
