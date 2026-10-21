import React, { useState } from 'react';
import { X, Shield, ExternalLink, Zap } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak, openAboutBlank } from '../utils/cloak';

export const CloakModal = ({
  isOpen,
  onClose,
  onTriggerDecoy
}) => {
  const [selectedId, setSelectedId] = useState(() => {
    return localStorage.getItem('unblock_cloak_id') || 'default';
  });

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedId(preset.id);
    applyCloak(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Stealth &amp; Tab Cloaking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Disguise your browser tab title and favicon to appear like standard school or productivity software, or launch in an about:blank cloaked window.
          </p>

          {/* Preset Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Select Tab Disguise
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CLOAK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedId === preset.id
                      ? 'border-sky-500 bg-sky-950/20 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.icon}
                      alt=""
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div>
                      <span className="text-xs font-bold block">{preset.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[240px]">
                        {preset.title}
                      </span>
                    </div>
                  </div>
                  {selectedId === preset.id && (
                    <div className="w-2 h-2 rounded-full bg-sky-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                onClose();
                openAboutBlank(window.location.href, 'Classes');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Launch Site in About:Blank Tab</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTriggerDecoy();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-800/80 hover:bg-rose-900/50 text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Toggle Google Docs Emergency Decoy (Esc)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
