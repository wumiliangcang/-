import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim() && !isGenerating) {
      onGenerate(text);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
        <div className="relative flex items-end bg-neutral-900 rounded-xl p-2 border border-neutral-700 shadow-xl">
          <textarea
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm p-3 outline-none resize-none h-24 leading-relaxed"
            placeholder="Describe a 3D scene... e.g., 'A cyberpunk city block with neon lights' or 'A low-poly dragon'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isGenerating}
            className={`
              mb-1 mr-1 p-3 rounded-lg flex items-center justify-center transition-all duration-300
              ${!text.trim() || isGenerating 
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 active:scale-95 hover:shadow-indigo-500/25'}
            `}
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-neutral-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> AI-Powered Generation
        </span>
        <span className="text-xs text-neutral-600">Press Enter to generate</span>
      </div>
    </div>
  );
};

export default PromptInput;