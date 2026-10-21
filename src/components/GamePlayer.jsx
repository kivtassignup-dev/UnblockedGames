import React, { useState, useRef } from 'react';
import { ArrowLeft, RotateCcw, Maximize2, ExternalLink, Heart, Tv, Keyboard } from 'lucide-react';
import { openAboutBlank } from '../utils/cloak';

export const GamePlayer = ({
  game,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectGame,
  allGames
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const relatedGames = allGames
    .filter(g => g.id !== game.id)
    .slice(0, 3);

  return (
    <div className={`mx-auto w-full transition-all duration-200 ${isTheater ? 'max-w-none px-0' : 'max-w-6xl px-4 sm:px-6'}`}>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 mb-2 border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        {/* Action Controls Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer ${
              isFavorite ? 'text-rose-500 border-rose-900/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleReload}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reload Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2 rounded-lg border border-slate-800 bg-slate-900 transition-colors cursor-pointer ${
              isTheater ? 'text-sky-400 border-sky-800 bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isTheater ? 'Default View' : 'Theater Mode'}
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => openAboutBlank(game.iframeUrl, game.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-sky-400 hover:border-sky-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Open in about:blank cloaked tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About:Blank</span>
          </button>
        </div>
      </div>

      {/* Main Game Iframe Frame */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-xl overflow-hidden bg-black border border-slate-800/80 shadow-2xl flex items-center justify-center ${
          isTheater ? 'h-[85vh] rounded-none border-x-0' : 'h-[620px] max-h-[75vh]'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-2">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading {game.title}...</span>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={game.iframeUrl}
          title={game.title}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-pointer-lock"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Game Information & Controls */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">★ {Number(game.rating).toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">{Number(game.plays).toLocaleString()} plays</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {game.title}
            </h1>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {game.description}
          </p>

          {/* Controls Card */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              <Keyboard className="w-4 h-4 text-sky-400" />
              <span>How To Play &amp; Controls</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-mono">
              {game.controls}
            </p>
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Tags:</span>
              <span>{game.tags.join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Right Column: Related Games */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 tracking-wide">
            More Popular Games
          </h3>
          <div className="space-y-2">
            {relatedGames.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-800/70 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="w-14 h-11 rounded-md overflow-hidden bg-slate-950 shrink-0">
                  {rel.thumbnail.startsWith('linear-gradient') ? (
                    <div className="w-full h-full" style={{ background: rel.thumbnail }} />
                  ) : (
                    <img src={rel.thumbnail} alt={rel.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-sky-400 truncate">
                    {rel.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{rel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400">★ {Number(rel.rating).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
