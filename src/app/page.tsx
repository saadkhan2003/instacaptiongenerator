'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('Professional');
  const [industry, setIndustry] = useState('Fashion');
  const [model, setModel] = useState('gemini');
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateCaptions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCopiedIndex(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, tone, industry, model }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate captions');
      }

      setCaptions(data.captions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            InstaCap <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">AI</span>
          </h1>
          <p className="text-xl text-white/90 font-light">Transform your ideas into engaging Instagram captions in seconds</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8"
        >
          <form className="space-y-8" onSubmit={generateCaptions}>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                What's your post about?
              </label>
              <textarea
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                rows={4}
                placeholder="Describe your post or paste your existing caption here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Tone
                </label>
                <select 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Funny</option>
                  <option>Inspirational</option>
                  <option>Promotional</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Industry
                </label>
                <select 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option>Fashion</option>
                  <option>Food & Beverage</option>
                  <option>Travel</option>
                  <option>Fitness</option>
                  <option>Technology</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  AI Model
                </label>
                <select 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gemini">Gemini 2.0 Flash</option>
                  <option value="deepseek">Deepseek R1 32B</option>
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-[0.99] focus:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Captions'
              )}
            </motion.button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          {captions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 border-t border-white/10 pt-8"
            >
              <h2 className="text-xl font-medium text-white mb-6">Generated Captions</h2>
              <div className="space-y-6">
                {captions.map((caption, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group bg-white/5 p-6 rounded-xl border border-white/10 relative hover:bg-white/10 transition-all duration-200"
                  >
                    <p className="text-white/90 whitespace-pre-wrap">{caption}</p>
                    <button
                      onClick={() => copyToClipboard(caption, index)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
                    >
                      {copiedIndex === index ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
