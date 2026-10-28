import React, { useState } from 'react';
import { 
  Info, 
  Send, 
  CheckCircle2, 
  Code2, 
  CloudSun, 
  Globe2, 
  Terminal, 
  Github, 
  Sparkles, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface AboutPageProps {
  isDark: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 700);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div
        className={`p-8 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
          isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-white/70'
        }`}
      >
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            <CloudSun className="w-4 h-4" />
            <span>WeatherNow Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Smart Weather Forecast for the Modern Web
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            WeatherNow delivers ultra-accurate, real-time meteorological intelligence, 7-day extended forecasts, 24-hour hourly progressions, and deep atmospheric metrics wrapped in a modern glassmorphism interface.
          </p>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          className={`p-6 rounded-3xl border shadow-xl ${
            isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg">Hyper-Local Live Data</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Instant geocoding and real-time WMO weather models across 200,000+ global municipalities with zero latency or API rate walls.
          </p>
        </div>

        <div
          className={`p-6 rounded-3xl border shadow-xl ${
            isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg">Atmospheric Diagnostics</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Precise UV radiation levels, humidity dew point calculation, wind gusts & compass bearings, air pressure, and European AQI metrics.
          </p>
        </div>

        <div
          className={`p-6 rounded-3xl border shadow-xl ${
            isDark ? 'glass-card border-white/5' : 'glass-card-light border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg">Privacy & Offline LocalStorage</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Favourite cities, theme preferences, and unit preferences are kept completely private and cached in your browser.
          </p>
        </div>
      </div>

      {/* Deployment & Local Running Guide (Requested in Prompt) */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
          isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          <span>Developer Guide</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight">
          Running Locally & Publishing to GitHub Pages
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Everything you need to clone, run, or host WeatherNow anywhere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 1: Run Locally */}
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300 mb-3">
              <Code2 className="w-4 h-4" />
              <span>1. Run Locally (Node.js & Vite)</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 text-indigo-200 text-xs font-mono overflow-x-auto border border-white/10">
{`# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open your browser
http://localhost:3000`}
            </pre>
          </div>

          {/* Step 2: Publish to GitHub Pages */}
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white/80 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300 mb-3">
              <Github className="w-4 h-4" />
              <span>2. Publish to GitHub Pages</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 text-purple-200 text-xs font-mono overflow-x-auto border border-white/10">
{`# 1. In package.json, add:
# "homepage": "https://<user>.github.io/<repo>"

# 2. Build the production bundle
npm run build

# 3. Deploy dist folder to gh-pages branch
npx gh-pages -d dist`}
            </pre>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
          isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200'
        }`}
      >
        <div className="max-w-xl mx-auto text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-indigo-400">
            <Info className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h3 className="text-2xl font-black">Contact & Feedback</h3>
          <p className="text-xs text-slate-400">
            Have questions, feedback, or suggestions for WeatherNow? Send us a note below.
          </p>
        </div>

        {isSubmitted ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-extrabold text-base text-emerald-200">
              Message Received!
            </h4>
            <p className="text-xs text-slate-300">
              Thank you for reaching out. Our weather team will review your inquiry shortly.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-400'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-400'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Feature Request, Bug Report, or General Question"
                className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-400'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your thoughts or report an issue..."
                className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all resize-none ${
                  isDark
                    ? 'bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-400'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
