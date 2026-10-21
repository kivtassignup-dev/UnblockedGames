/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Sparkles, Gamepad2, ArrowUpDown, X } from 'lucide-react';
import { TopBar } from './components/TopBar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { DecoyScreen } from './components/DecoyScreen.jsx';
import { CLOAK_PRESETS, applyCloak } from './utils/cloak.js';

export default function App() {
  const [games, setGames] = useState([]);
  const [customGames, setCustomGames] = useState(() => {
    try {
      const stored = localStorage.getItem('unblock_custom_games');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('unblock_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [activeGame, setActiveGame] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isDecoyActive, setIsDecoyActive] = useState(false);

  // Resolve relative URLs correctly whether hosted at root or on a GitHub Pages subpath
  const resolvePath = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('linear-gradient')) {
      return url;
    }
    const clean = url.startsWith('/') ? url.slice(1) : url;
    const base = import.meta.env.BASE_URL || './';
    const prefix = base.endsWith('/') ? base : `${base}/`;
    return `${prefix}${clean}`;
  };

  // Restore saved cloak on startup
  useEffect(() => {
    const savedCloakId = localStorage.getItem('unblock_cloak_id');
    if (savedCloakId) {
      const found = CLOAK_PRESETS.find(p => p.id === savedCloakId);
      if (found) applyCloak(found);
    }
  }, []);

  // Fetch games from JSON file
  useEffect(() => {
    fetch(resolvePath('games.json'))
      .then(res => res.json())
      .then((data) => {
        const resolved = data.map(g => ({
          ...g,
          iframeUrl: resolvePath(g.iframeUrl),
          thumbnail: resolvePath(g.thumbnail)
        }));
        setGames(resolved);
      })
      .catch(err => {
        console.error('Failed to load games.json:', err);
      });
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#play-')) {
        const gameId = hash.replace('#play-', '');
        const all = [...games, ...customGames];
        const found = all.find(g => g.id === gameId);
        if (found) setActiveGame(found);
      } else if (!hash) {
        setActiveGame(null);
      }
    };

    if (games.length > 0) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [games, customGames]);

  // Global Panic Key Listener (Esc toggles Google Docs decoy)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isAddModalOpen && !isCloakModalOpen) {
        setIsDecoyActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, isCloakModalOpen]);

  // Combine static and custom games
  const allGames = useMemo(() => {
    const combined = [...games, ...customGames];
    return combined;
  }, [games, customGames]);

  // Toggle Favorite
  const handleToggleFavorite = (gameId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('unblock_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Select Game
  const handleSelectGame = (game) => {
    setActiveGame(game);
    window.location.hash = `play-${game.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to catalog
  const handleBackToCatalog = () => {
    setActiveGame(null);
    history.pushState('', document.title, window.location.pathname + window.location.search);
  };

  // Add custom game
  const handleAddCustomGame = (newGame) => {
    const updated = [newGame, ...customGames];
    setCustomGames(updated);
    localStorage.setItem('unblock_custom_games', JSON.stringify(updated));
    handleSelectGame(newGame);
  };

  // Import custom games
  const handleImportGames = (imported) => {
    const merged = [...imported, ...customGames];
    const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
    setCustomGames(unique);
    localStorage.setItem('unblock_custom_games', JSON.stringify(unique));
  };

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    return allGames
      .filter(game => {
        // Category filter
        if (activeCategory === 'Favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (activeCategory === 'Custom') {
          if (!game.isCustom) return false;
        } else if (activeCategory !== 'All') {
          if (game.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchCategory = game.category.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchTags = game.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchCategory && !matchDesc && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [allGames, activeCategory, searchQuery, sortBy, favorites]);

  const featuredGame = useMemo(() => {
    return allGames.find(g => g.featured) || allGames[0];
  }, [allGames]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Google Docs Emergency Decoy Screen */}
      {isDecoyActive && (
        <DecoyScreen onDismiss={() => setIsDecoyActive(false)} />
      )}

      {/* Top Bar Contract (1-line Brand, 4-5 concise nav links, 1 primary action) */}
      <TopBar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activeGame) handleBackToCatalog();
        }}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onBackToHome={handleBackToCatalog}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={handleBackToCatalog}
            onSelectGame={handleSelectGame}
            allGames={allGames}
          />
        ) : (
          <div className="space-y-8">
            {/* Featured Hero Banner (Shown when no search/filter active) */}
            {activeCategory === 'All' && !searchQuery && featuredGame && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Featured Spotlight</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{featuredGame.category}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {featuredGame.title}
                  </h2>

                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    {featuredGame.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSelectGame(featuredGame)}
                      className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
                    >
                      Play Now
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(featuredGame.id)}
                      className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      {favorites.includes(featuredGame.id) ? 'Favorited' : 'Favorite'}
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => handleSelectGame(featuredGame)}
                  className="w-full md:w-80 aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl cursor-pointer group shrink-0"
                >
                  <img
                    src={featuredGame.thumbnail}
                    alt={featuredGame.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            {/* Filter, Search & Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
              {/* Category Segmented Controls (Clickable functional tabs) */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
                {['All', 'Arcade', 'Action', 'Puzzle', 'Sports', 'Favorites'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {cat}
                    {cat === 'Favorites' && favorites.length > 0 && (
                      <span className="ml-1 text-[10px] text-sky-400 font-mono">({favorites.length})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search games..."
                    className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-slate-700 focus:bg-slate-950 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="popular" className="bg-slate-900">Popular</option>
                    <option value="rating" className="bg-slate-900">Top Rated</option>
                    <option value="title" className="bg-slate-900">A - Z</option>
                  </select>
                </div>

                {/* Add Custom Game Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                  title="Add custom game iframe"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Game</span>
                </button>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectGame={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No games found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  {searchQuery
                    ? `No matches for "${searchQuery}". Try a different search term or clear the filter.`
                    : activeCategory === 'Favorites'
                    ? "You haven't saved any games to your favorites yet. Click the heart icon on any game card!"
                    : 'No games available in this category yet.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">UnblockHub</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Unblocked HTML5 Game Catalog</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">Esc</kbd> for Emergency Decoy</span>
            <span aria-hidden="true">&middot;</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-slate-200 cursor-pointer"
            >
              Add Iframe Game
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
        onImportGames={handleImportGames}
        customGames={customGames}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        onTriggerDecoy={() => setIsDecoyActive(true)}
      />
    </div>
  );
}
