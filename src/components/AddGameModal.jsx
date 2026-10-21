import React, { useState } from 'react';
import { X, Plus, Download, Upload } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
  onImportGames,
  customGames
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe URL or embed code.');
      return;
    }

    // Extract URL if user pasted full <iframe ... src="..." ...>
    let finalUrl = iframeInput.trim();
    if (finalUrl.includes('<iframe')) {
      const match = finalUrl.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        finalUrl = match[1];
      }
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom added game.',
      iframeUrl: finalUrl,
      iframeCode: `<iframe src="${finalUrl}" title="${title.trim()}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`,
      thumbnail: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
      controls: controls.trim() || 'Refer to the game screen for controls.',
      rating: 5.0,
      plays: 1,
      featured: false,
      tags: [category, 'Custom'],
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
    setTitle('');
    setIframeInput('');
    setDescription('');
    setControls('');
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customGames, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'unblockhub_custom_games.json');
    dlAnchor.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed)) {
          onImportGames(parsed);
          onClose();
        } else {
          setError('Invalid JSON format: expected an array of games.');
        }
      } catch (err) {
        setError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Add Custom Game Iframe</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Game Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Retro Space Blaster"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-hidden focus:border-sky-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Sports">Sports</option>
                <option value="Classic">Classic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thumbnail Theme
              </label>
              <div className="h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 flex items-center text-xs text-slate-400">
                Gradient Card
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Iframe URL or &lt;iframe&gt; HTML Embed Code
            </label>
            <textarea
              rows={2}
              value={iframeInput}
              onChange={e => setIframeInput(e.target.value)}
              placeholder="https://example.com/game or <iframe src='...'></iframe>"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 font-mono text-xs focus:outline-hidden focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short summary of gameplay"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Controls (Optional)
            </label>
            <input
              type="text"
              value={controls}
              onChange={e => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer, Space to shoot"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {customGames.length > 0 && (
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Export custom games as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              )}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors cursor-pointer"
            >
              Save Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
