import React, { useState } from 'react';
import { Eye, FileText, Share2, Printer, Undo, Redo } from 'lucide-react';

export const DecoyScreen = ({ onDismiss }) => {
  const [docText, setDocText] = useState(
    `AP World History: Unit 5 - Revolutions and Industrialization (1750–1900)\n\n` +
    `1. Major Enlightenment Philosophies:\n` +
    `- John Locke: Natural rights (life, liberty, property); government gets legitimacy through consent of the governed.\n` +
    `- Voltaire: Freedom of speech and religious toleration.\n` +
    `- Montesquieu: Separation of powers into legislative, executive, and judicial branches to prevent tyranny.\n` +
    `- Jean-Jacques Rousseau: Social contract theory and general will of the citizenry.\n\n` +
    `2. Causes of the Industrial Revolution in Great Britain:\n` +
    `- Geographic distribution of coal and iron resources.\n` +
    `- Access to foreign resources through colonial mercantile empire.\n` +
    `- Agricultural revolution increasing food supply and generating urban workforce migration.\n` +
    `- Legal protection of private property and patent laws.\n\n` +
    `3. Economic Transformations:\n` +
    `- Transition from domestic cottage industry to factory system.\n` +
    `- Adam Smith and the Wealth of Nations (1776): free-market capitalism, division of labor.\n` +
    `- Emergence of labor unions and early social legislation.`
  );

  return (
    <div className="fixed inset-0 z-100 bg-[#f9fbfd] text-slate-800 flex flex-col font-sans select-text">
      {/* Google Docs Top Bar */}
      <div className="h-16 border-b border-slate-300/80 bg-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-9 h-9 text-blue-600" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-slate-800">
                AP World History Notes - Unit 5
              </span>
              <span className="text-xs text-slate-400">Saved to Drive</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span>Extensions</span>
              <span>Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDismiss}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold cursor-pointer transition-colors"
            title="Return to Game Hub (or press Esc)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Resume (Esc)</span>
          </button>
          <button
            onClick={onDismiss}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Docs Action Toolbar */}
      <div className="h-9 border-b border-slate-200 bg-[#edf2fa] px-4 flex items-center gap-4 text-slate-600 text-xs">
        <Undo className="w-3.5 h-3.5" />
        <Redo className="w-3.5 h-3.5" />
        <Printer className="w-3.5 h-3.5" />
        <span className="h-4 w-[1px] bg-slate-300" />
        <span className="font-medium">100%</span>
        <span className="h-4 w-[1px] bg-slate-300" />
        <span className="font-medium">Normal text</span>
        <span className="h-4 w-[1px] bg-slate-300" />
        <span className="font-medium">Arial</span>
        <span className="h-4 w-[1px] bg-slate-300" />
        <span>11</span>
      </div>

      {/* Document Paper Body */}
      <div className="flex-1 overflow-y-auto bg-[#f0f4f9] py-8 flex justify-center">
        <div className="w-[816px] min-h-[1056px] bg-white shadow-md p-16 border border-slate-200">
          <textarea
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            className="w-full h-full min-h-[850px] resize-none outline-none font-serif text-[15px] leading-relaxed text-slate-800 bg-transparent border-0"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
