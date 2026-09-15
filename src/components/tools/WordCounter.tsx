import React, { useState } from 'react';
import { FileText, Copy, Check, RotateCcw, Sparkles, BookOpen, Mic } from 'lucide-react';
import { copyTextSafely } from '../../utils/clipboard';

interface Props {
  onNotify?: (msg: string) => void;
}

const SAMPLE_TEXT = `BizPilot was built for the modern independent professional. As a freelancer or small-business owner, your time is your most valuable asset. Spending hours switching between clunky spreadsheets, manual calculators, and scattered document editors drains your creative energy.

With BizPilot, every essential calculation, text check, and client document happens seamlessly in one clean workspace. Work faster, price with confidence, and deliver exceptional work for every client you serve.`;

export const WordCounter: React.FC<Props> = ({ onNotify }) => {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [copied, setCopied] = useState<boolean>(false);

  // Metrics computation
  // Words: split by whitespace, filter empty
  const wordsArray = text.trim().length > 0 ? text.trim().split(/\s+/) : [];
  const wordCount = wordsArray.length;

  // Characters with spaces
  const charCountWithSpaces = text.length;

  // Characters excluding spaces (\s includes spaces, tabs, newlines)
  const charCountNoSpaces = text.replace(/\s/g, '').length;

  // Sentences: match ending punctuation followed by space or end
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  const sentenceCount = text.trim().length === 0 ? 0 : sentenceMatches ? sentenceMatches.length : (wordCount > 0 ? 1 : 0);

  // Paragraphs: split by double newlines or non-empty lines
  const paragraphsArray = text.split(/\n+/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphsArray.length;

  // Reading time: avg 200 words per minute
  const readingTimeMinutes = Math.ceil(wordCount / 200) || 0;
  // Speaking time: avg 130 words per minute
  const speakingTimeMinutes = Math.ceil(wordCount / 130) || 0;

  const handleClear = () => {
    setText('');
    if (onNotify) onNotify('Text cleared');
  };

  const handleCopy = async () => {
    if (!text) return;
    const success = await copyTextSafely(text);
    if (success) {
      setCopied(true);
      if (onNotify) onNotify('Text copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    if (onNotify) onNotify('Loaded sample business copy');
  };

  return (
    <div id="word-counter-tool" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Word &amp; Character Counter</h3>
            <p className="text-sm text-slate-500">Live stats for proposals, articles, emails, and social posts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Sample Text
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Words</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1 font-mono">{wordCount.toLocaleString()}</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Characters</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{charCountWithSpaces.toLocaleString()}</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">No Spaces</div>
          <div className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">{charCountNoSpaces.toLocaleString()}</div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sentences</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-1 font-mono">{sentenceCount.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="mt-4">
        <label htmlFor="word-counter-textarea" className="sr-only">
          Paste or write your content here
        </label>
        <div className="relative">
          <textarea
            id="word-counter-textarea"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to get instant word, character, and sentence counts..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base leading-relaxed resize-y transition-all"
          />
        </div>
      </div>

      {/* Secondary Stats & Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Reading time: ~{readingTimeMinutes} min
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Mic className="w-3.5 h-3.5 text-slate-400" />
            Speaking time: ~{speakingTimeMinutes} min
          </span>
          <span>Paragraphs: {paragraphCount}</span>
        </div>

        <div>
          {copied ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <Check className="w-3.5 h-3.5" /> Copied to Clipboard
            </span>
          ) : (
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
