
import React from 'react';

interface Props {
  onSuccess: () => void;
}

const ApiKeySelector: React.FC<Props> = ({ onSuccess }) => {
  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      onSuccess();
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-4">Set Your Creative Engine</h2>
      <p className="text-slate-400 max-w-md mb-8">
        To use the Pro-level image generation (Gemini 3 Pro Image), you must select an API key from a paid GCP project. 
        <br />
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 underline hover:text-blue-300">
          Learn about billing
        </a>
      </p>
      <button
        onClick={handleSelectKey}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
      >
        Select API Key to Begin
      </button>
    </div>
  );
};

export default ApiKeySelector;
