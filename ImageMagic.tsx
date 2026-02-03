
import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';

export const ImageMagic: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await editImage(image, prompt);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResultImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI Image Magic
        </h1>
        <p className="text-slate-400">
          Powered by Gemini 2.5 Flash Image. Simply describe the changes you want to see—whether it's adding filters, removing objects, or changing styles.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input Area */}
        <div className="glass-card rounded-3xl p-8 border border-slate-700/50">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Upload Source Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-video rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center justify-center bg-slate-900/30 overflow-hidden relative group`}
            >
              {image ? (
                <>
                  <img src={image} alt="Source" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-medium">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-600 mb-3"></i>
                  <span className="text-slate-500 text-sm">Click to browse or drag & drop</span>
                  <span className="text-[10px] text-slate-600 mt-1">PNG, JPG or WEBP</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3">What should we change?</label>
            <textarea
              placeholder="e.g. 'Add a retro 80s neon filter' or 'Make the background a mountain range'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              disabled={!image || !prompt || isProcessing}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Casting Magic Spell...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-sparkles"></i>
                  Apply Transformation
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl font-bold transition-colors"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="glass-card rounded-3xl p-8 border border-slate-700/50 min-h-[500px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Generated Result</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            {resultImage ? (
              <div className="w-full h-full flex flex-col animate-in fade-in duration-700">
                <img src={resultImage} alt="Result" className="w-full flex-1 object-contain rounded-t-xl" />
                <div className="p-4 bg-slate-800/50 flex justify-between items-center rounded-b-xl border-t border-slate-700">
                  <span className="text-xs text-slate-400">Successfully generated</span>
                  <a 
                    href={resultImage} 
                    download="flowai-result.png"
                    className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-2"
                  >
                    <i className="fa-solid fa-download"></i>
                    Download
                  </a>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 text-sm font-medium">Gemini is re-imagining your image...</p>
              </div>
            ) : (
              <div className="text-center opacity-30 px-12">
                <i className="fa-solid fa-image text-6xl mb-4 text-slate-600"></i>
                <p className="text-slate-400">Configure your edit on the left to see the result here.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <button 
              onClick={() => setPrompt('Apply a cinematic high-contrast teal and orange look')}
              className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] text-slate-400 font-bold uppercase transition-all"
            >
              Cinematic Look
            </button>
            <button 
              onClick={() => setPrompt('Convert this into a pencil sketch on textured paper')}
              className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] text-slate-400 font-bold uppercase transition-all"
            >
              Sketch Art
            </button>
            <button 
              onClick={() => setPrompt('Make it look like a vintage 1970s polaroid with scratches')}
              className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] text-slate-400 font-bold uppercase transition-all"
            >
              Vintage Film
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
