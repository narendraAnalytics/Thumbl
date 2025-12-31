
import React, { useState, useEffect, useRef } from 'react';
import { IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle, ThumbnailResult } from './types';
import { generateThumbnail, searchGrounding, enhancePrompt } from './services/geminiService';
import ApiKeySelector from './components/ApiKeySelector';

const LANGUAGES: IndianLanguage[] = ['Telugu', 'Hindi', 'Tamil', 'Marathi'];
const SIZES: ImageSize[] = ['1K', '2K', '4K'];
const STYLES: ThumbnailStyle[] = ['Cinematic', 'Cartoon', 'Sketch', '3D Art', 'Minimalist'];

const PLATFORMS: { name: string; ratio: AspectRatio; icon: string }[] = [
  { name: 'YouTube', ratio: '16:9', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z' },
  { name: 'LinkedIn', ratio: '3:4', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
  { name: 'Instagram', ratio: '9:16', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { name: 'Facebook', ratio: '9:16', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }
];

const App: React.FC = () => {
  const [isKeySelected, setIsKeySelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThumbnailResult | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  
  // Form State
  const [headline, setHeadline] = useState('');
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<IndianLanguage>('Hindi');
  const [size, setSize] = useState<ImageSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [style, setStyle] = useState<ThumbnailStyle>('Cinematic');
  const [useSearch, setUseSearch] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    };
    checkKey();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 3 - referenceImages.length;
      // Explicitly type filesToProcess as File[] to prevent 'unknown' issues in older TS environments
      const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReferenceImages(prev => [...prev, reader.result as string]);
        };
        // Fix for Error: Argument of type 'unknown' is not assignable to parameter of type 'Blob'
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || enhancing) return;
    setEnhancing(true);
    setError(null);
    try {
      const betterPrompt = await enhancePrompt(prompt);
      setPrompt(betterPrompt);
    } catch (err: any) {
      setError("Could not enhance prompt. Please try again.");
    } finally {
      setEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      let searchContext = "";
      let groundingLinks: { title: string; uri: string }[] = [];

      if (useSearch) {
        const searchRes = await searchGrounding(prompt);
        searchContext = searchRes.text;
        groundingLinks = searchRes.links;
      }

      const imageUrl = await generateThumbnail(
        headline,
        prompt,
        language,
        size,
        aspectRatio,
        style,
        referenceImages.length > 0 ? referenceImages : undefined,
        searchContext
      );

      setResult({
        imageUrl,
        searchContext,
        groundingLinks,
        aspectRatio
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key Error: Please re-select your API key.");
        setIsKeySelected(false);
      } else {
        setError(err.message || "Failed to generate thumbnail. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isKeySelected) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <ApiKeySelector onSuccess={() => setIsKeySelected(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-red-600 p-2 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              LinguistSnap AI <span className="text-[10px] text-indigo-400 border border-indigo-400/30 px-1.5 py-0.5 rounded ml-1 uppercase">Social Pro</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsKeySelected(false)}
            className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            Change API Engine
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              Creator Studio
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Platform Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p, idx) => (
                    <button
                      key={`${p.name}-${idx}`}
                      type="button"
                      onClick={() => setAspectRatio(p.ratio)}
                      className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                        aspectRatio === p.ratio 
                        ? 'bg-slate-100 border-white text-slate-900 shadow-lg' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={p.icon} />
                      </svg>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline Language Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Headline Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                        language === lang 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creative Style Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Artistic Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                        style === s 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-400">Headline Text (Optional)</label>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">In {language}</span>
                </div>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={`Leave blank for AI to generate...`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                />
              </div>

              {/* Visual Prompt Input */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-400">Background Scene Concept</label>
                    <button 
                        type="button"
                        onClick={handleEnhance}
                        disabled={enhancing || !prompt.trim()}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${
                            enhancing 
                            ? 'bg-slate-800 border-slate-700 text-slate-500' 
                            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 active:scale-95'
                        }`}
                    >
                        {enhancing ? (
                            <>
                                <div className="w-2 h-2 border border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                                Optimizing...
                            </>
                        ) : (
                            <>
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                ✨ Enhance with AI
                            </>
                        )}
                    </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the background scenery or subject..."
                  className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm"
                />
              </div>

              {/* Resolution Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Image Quality</label>
                <div className="flex gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                        size === s 
                        ? 'bg-white border-white text-slate-900' 
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Grounding Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                   </div>
                   <div>
                    <div className="text-sm font-semibold">Smart Insights</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Web Context</div>
                   </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseSearch(!useSearch)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useSearch ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useSearch ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Multiple Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Visual References (Max 3, Optional)</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {referenceImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {referenceImages.length < 3 && (
                      <div className="relative aspect-square">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full h-full border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-800/50 rounded-xl flex items-center justify-center transition-all group">
                          <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-center">
                    {referenceImages.length === 0 ? "Upload Portrait/Logo" : `${referenceImages.length} of 3 uploaded`}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !prompt}
                className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-2xl flex items-center justify-center gap-2 uppercase tracking-widest ${
                  loading || !prompt
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 shadow-indigo-600/20'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Crafting Content...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Post
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold">
                  ⚠️ {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Panel: Results & Preview */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !loading && (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[600px]">
              <div className="w-24 h-24 bg-slate-800 rounded-3xl rotate-3 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Creative Canvas</h3>
              <p className="text-slate-500 max-w-sm text-sm">
                Your professional content will appear here once generated.
              </p>
            </div>
          )}

          {loading && (
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[600px]">
                <div className="relative">
                    <div className="w-32 h-32 border-[6px] border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-[6px] border-slate-700/50 border-t-white rounded-full animate-spin-reverse"></div>
                    </div>
                </div>
                <div className="mt-12 space-y-4 text-center">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Synthesizing...</h3>
                    <div className="flex gap-1 justify-center">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">
                        {headline.trim() ? `Rendering "${headline.slice(0, 15)}..."` : 'Auto-Generating Viral Headline'}
                        <br />
                        Platform: {aspectRatio} • Lang: {language}
                    </p>
                </div>
                <style>{`
                    @keyframes spin-reverse {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(-360deg); }
                    }
                    .animate-spin-reverse {
                        animation: spin-reverse 2s linear infinite;
                    }
                    .delay-75 { animation-delay: 75ms; }
                    .delay-150 { animation-delay: 150ms; }
                `}</style>
             </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
                   <div className="flex items-center gap-3">
                      <div className={`px-2 py-0.5 text-[10px] font-black rounded text-white uppercase tracking-tighter ${
                        result.aspectRatio === '16:9' ? 'bg-red-600' : 
                        result.aspectRatio === '3:4' ? 'bg-blue-600' : 'bg-pink-600'
                      }`}>
                        {result.aspectRatio}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Export ({size})</span>
                   </div>
                   <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = result.imageUrl;
                        link.download = `linguistsnap-${result.aspectRatio.replace(':', '-')}-${Date.now()}.png`;
                        link.click();
                      }}
                      className="px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg active:scale-95 group"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      DOWNLOAD IMAGE
                    </button>
                   </div>
                </div>
                <div className="p-6 flex justify-center bg-slate-950/50">
                    <div className={`rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group transition-all duration-500 ${
                      result.aspectRatio === '16:9' ? 'w-full aspect-video' : 
                      result.aspectRatio === '3:4' ? 'w-2/3 aspect-[3/4]' : 'w-1/2 aspect-[9/16]'
                    }`}>
                        <img src={result.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" alt="Generated Social Post" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
              </div>

              {/* Research Insights & Links */}
              {(result.searchContext || (result.groundingLinks && result.groundingLinks.length > 0)) && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Topic Intelligence
                  </h3>
                  
                  {result.searchContext && (
                    <div className="mb-6 text-slate-300 text-sm leading-relaxed p-5 bg-slate-800/40 rounded-2xl border border-slate-700/30 font-medium italic">
                      "{result.searchContext}"
                    </div>
                  )}

                  {result.groundingLinks && result.groundingLinks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.groundingLinks.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/10 transition-colors">
                            <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-white truncate">
                            {link.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 py-3 text-center z-[100]">
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-600">
          Professional Creative Suite • <span className="text-indigo-600">Gemini 3 Pro Multimodal</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
