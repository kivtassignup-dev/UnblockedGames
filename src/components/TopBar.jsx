import React from 'react';
import { Shield } from 'lucide-react';

export const TopBar = ({
  activeCategory,
  onSelectCategory,
  onOpenCloakModal,
  onBackToHome
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={onBackToHome}
          className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          UnblockHub
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectCategory('All')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'All' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Arcade')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'Arcade' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Arcade
          </button>
          <button
            onClick={() => onSelectCategory('Action')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'Action' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Action
          </button>
          <button
            onClick={() => onSelectCategory('Puzzle')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'Puzzle' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Puzzle
          </button>
          <button
            onClick={() => onSelectCategory('Favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'Favorites' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            Favorites
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCloakModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            title="Tab Cloak & Panic Disguise"
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Tab Cloak</span>
          </button>
        </div>
      </div>
    </header>
  );
};
