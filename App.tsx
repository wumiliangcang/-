import React, { useState } from 'react';
import { Box, Layers, Code2, Share2, Wand2, Loader2 } from 'lucide-react';
import SceneRenderer from './components/SceneRenderer';
import PromptInput from './components/PromptInput';
import { SceneData } from './types';
import { DEFAULT_SCENE, SUGGESTED_PROMPTS } from './constants';
import { generateSceneFromPrompt } from './services/geminiService';

function App() {
  const [sceneData, setSceneData] = useState<SceneData>(DEFAULT_SCENE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const data = await generateSceneFromPrompt(prompt);
      setSceneData(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate scene. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Control Panel */}
      <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-neutral-800 bg-neutral-950/50 backdrop-blur-sm h-screen relative z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Box className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">GenShape 3D</h1>
            <p className="text-xs text-neutral-500 font-medium">AI Model Generator</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Prompt Section */}
          <section>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Wand2 className="w-3 h-3" /> Generator
            </h2>
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
            
            {error && (
               <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                 Error: {error}
               </div>
            )}
          </section>

          {/* Scene Details */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3 h-3" /> Scene Details
            </h2>
            
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-3">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Title</label>
                <div className="text-sm font-medium text-white">{sceneData.title}</div>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Description</label>
                <div className="text-sm text-neutral-300 leading-relaxed">{sceneData.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                    <label className="text-xs text-neutral-500 block mb-1">Objects</label>
                    <div className="text-sm text-indigo-400 font-mono">{sceneData.objects.length} entities</div>
                </div>
                <div>
                    <label className="text-xs text-neutral-500 block mb-1">Lights</label>
                    <div className="text-sm text-yellow-400 font-mono">{sceneData.lights.length} sources</div>
                </div>
              </div>
            </div>
          </section>

          {/* Suggestions */}
          <section>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Try these</h2>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => !isGenerating && handleGenerate(p)}
                  className="text-xs text-left bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 px-3 py-2 rounded-lg transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex gap-2">
           <button 
             onClick={() => setShowCode(!showCode)}
             className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-2 rounded-lg text-sm font-medium transition-colors"
           >
             <Code2 className="w-4 h-4" /> {showCode ? 'Hide Data' : 'View JSON'}
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-2 rounded-lg text-sm font-medium transition-colors">
             <Share2 className="w-4 h-4" /> Share
           </button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div className="flex-1 relative h-[50vh] md:h-screen bg-neutral-950 p-0 md:p-6">
        
        {showCode ? (
           <div className="w-full h-full bg-neutral-900 rounded-xl border border-neutral-800 p-6 overflow-auto custom-scrollbar">
             <h3 className="text-sm font-bold text-neutral-400 mb-4 sticky top-0">Scene Definition (JSON)</h3>
             <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
               {JSON.stringify(sceneData, null, 2)}
             </pre>
           </div>
        ) : (
          <div className="w-full h-full relative group">
             <SceneRenderer sceneData={sceneData} />
             
             {/* Overlay Status */}
             {isGenerating && (
               <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                 <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/30 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
                 </div>
                 <p className="mt-4 text-sm font-medium text-indigo-200 animate-pulse">Architecting Scene...</p>
                 <p className="text-xs text-neutral-500 mt-2">Calculuating geometry & materials</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;