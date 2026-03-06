import React from 'react';
import { X, CheckCircle, Edit3, MessageSquare, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden border border-sas-gray/30 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 bg-sas-blue text-white shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="bg-white/20 p-1 rounded">?</span> Application Instructions
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 text-slate-700 dark:text-slate-300 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-sas-blue dark:text-sas-teal border-b border-sas-gray/20 pb-2">
              Welcome to the Prompt Generator
            </h4>
            <p className="text-sm leading-relaxed">
              This tool helps you craft the perfect prompt for Large Language Models (LLMs) like Gemini, ChatGPT, or Claude. 
              Follow the steps below to create, refine, and finalize your prompt.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1 bg-sas-light dark:bg-slate-700 p-2 rounded-full h-fit">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">1. Access & Verification</h5>
                <p className="text-sm mt-1">
                  Enter your secure <strong>Passkey</strong> and complete the <strong>Math Challenge</strong> to verify you are human. This ensures secure access to the tool.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 mt-1 bg-sas-light dark:bg-slate-700 p-2 rounded-full h-fit">
                <Edit3 size={20} className="text-sas-blue dark:text-blue-400" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">2. Define Your Needs</h5>
                <p className="text-sm mt-1 mb-2">
                  Fill out the "Create Your Prompt" form. All fields are mandatory to ensure high quality:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Goal:</strong> What exactly do you want the AI to do?</li>
                  <li><strong>Context:</strong> Provide background info or constraints.</li>
                  <li><strong>Style & Tone:</strong> Choose how the AI should sound (e.g., Professional, Witty).</li>
                  <li><strong>Format:</strong> Choose the output structure (e.g., Blog Post, JSON, Table).</li>
                  <li><strong>Length & Audience:</strong> Specify how long it should be and who will read it.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 mt-1 bg-sas-light dark:bg-slate-700 p-2 rounded-full h-fit">
                <MessageSquare size={20} className="text-sas-yellow" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">3. Generate & Refine</h5>
                <p className="text-sm mt-1">
                  Click <strong>Generate Initial Prompt</strong>. The screen will split into two windows:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Left Window:</strong> Displays the actual prompt text.</li>
                  <li><strong>Right Window:</strong> Shows AI suggestions to improve your prompt.</li>
                </ul>
                <p className="text-sm mt-2 italic border-l-2 border-sas-yellow pl-3">
                  Use the chat bar at the bottom to reply to suggestions (e.g., "incorporate suggestion #1" or "make it shorter").
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 mt-1 bg-sas-light dark:bg-slate-700 p-2 rounded-full h-fit">
                <Copy size={20} className="text-purple-500" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">4. Finalize & Copy</h5>
                <p className="text-sm mt-1">
                  Continue refining until you are happy with the result. When the prompt is perfect, click the <strong>Copy</strong> button in the top right of the Prompt Window to save it to your clipboard.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-sas-blue/5 dark:bg-slate-700/50 rounded-lg text-sm text-center text-sas-blue dark:text-sas-gray">
            <strong>Tip:</strong> The more specific you are in the initial form, the better your starting prompt will be!
          </div>
        </div>
        
        <div className="p-4 border-t border-sas-gray/20 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-sas-blue text-white rounded-lg hover:bg-blue-900 transition font-bold"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};