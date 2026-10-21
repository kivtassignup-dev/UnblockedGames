import React from 'react';
import { Play, Heart, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame
}) => {
  const isGradient = game.thumbnail.startsWith('linear-gradient');

  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer text-left"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-950">
        {isGradient ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{ background: game.thumbnail }}
          >
            <Gamepad2 className="w-12 h-12 text-white/90 drop-shadow-md mb-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-white font-bold text-sm tracking-wide drop-shadow-sm line-clamp-1">
              {game.title}
            </span>
          </div>
        ) : (
          <img
            src={game.thumbnail}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to stylized container on error
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add('bg-gradient-to-br', 'from-slate-800', 'to-slate-950', 'flex', 'items-center', 'justify-center');
              }
            }}
          />
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-slate-300 hover:text-rose-400 backdrop-blur-xs transition-colors cursor-pointer"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Play Overlay Button on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4">
        {/* Anti-Slop Rule: Zero-Pill unboxed metadata with subtle typographic separators */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
          <span>{game.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400">★ {Number(game.rating).toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono text-[11px]">{Number(game.plays).toLocaleString()} plays</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1 mb-1">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {game.description}
        </p>

        {/* Footer info: tags as quiet text without pill boxes */}
        {game.tags && game.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="truncate">{game.tags.join(' / ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
