
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, RefreshCw, MessageSquare, FileText } from 'lucide-react';
import { PromptInputs, ChatMessage } from '../types';
import { generateInitialPrompt, sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const STYLE_OPTIONS = [
  "Professional / Formal",
  "Casual / Conversational",
  "Friendly / Empathetic",
  "Humorous / Witty",
  "Persuasive / Sales-oriented",
  "Academic / Technical",
  "Direct / Concise",
  "Creative / Storytelling"
];

const FORMAT_OPTIONS = [
  "Paragraphs / Prose",
  "Bulleted List",
  "Numbered List / Step-by-step",
  "Table",
  "Code Block",
  "Email Format",
  "Social Media Post",
  "JSON / XML",
  "FAQ Format"
];

const AUDIENCE_OPTIONS = [
  "General Public",
  "Professionals / Experts",
  "Business Owners",
  "Beginners / Students",
  "Executives / C-Suite",
  "Developers / Technical",
  "Customers / Clients",
  "Children",
  "Internal Team"
];

export const PromptGenerator: React.FC = () => {
  const [inputs, setInputs] = useState<PromptInputs>({
    goal: '',
    context: '',
    style: '',
    format: '',
    length: '',
    audience: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof PromptInputs, boolean>>>({});
  
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors: Partial<Record<keyof PromptInputs, boolean>> = {};
    let hasError = false;

    (Object.keys(inputs) as Array<keyof PromptInputs>).forEach((key) => {
      if (!inputs[key].trim()) {
        newErrors[key] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setIsLoading(true);
    setHasStarted(true);
    
    const responseText = await generateInitialPrompt(inputs);
    
    setChatHistory([
      {
        id: 'ai-1',
        role: 'model',
        content: responseText
      }
    ]);
    
    setIsLoading(false);
  };

  const processMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);

    const aiResponseText = await sendMessageToGemini(chatHistory, userMsg.content);
    
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiResponseText,
      isFinal: aiResponseText.includes("**Final Prompt (Ready to Use)**")
    };

    setChatHistory(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!inputValue.trim()) {
      setInputError(true);
      return;
    }

    const text = inputValue;
    setInputValue('');
    setInputError(false);
    await processMessage(text);
  };

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-sas-blue hover:bg-blue-900 text-white'
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
    );
  };

  const renderModelMessage = (content: string, isFinal?: boolean) => {
    // Attempt to split based on the separator defined in geminiService
    const parts = content.split('---SUGGESTIONS_START---');
    
    let promptPart = parts[0] || content;
    let suggestionsPart = parts[1] || '';

    // Extract title and code block from prompt part if possible
    const promptMatch = promptPart.match(/(\*\*.*?\*\*)\s*\n\s*```(?:[\w]*\n)?([\s\S]*?)```/);
    
    let promptTitle = "Prompt";
    let promptText = promptPart;

    if (promptMatch) {
      promptTitle = promptMatch[1].replace(/\*\*/g, ''); // Remove asterisks
      promptText = promptMatch[2].trim();
    } else {
        const codeBlockMatch = promptPart.match(/```(?:[\w]*\n)?([\s\S]*?)```/);
        if (codeBlockMatch) {
             promptText = codeBlockMatch[1].trim();
        }
    }

    return (
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        {/* Section 1: The Prompt Window */}
        <div className="flex-1 w-full lg:w-1/2 bg-white dark:bg-slate-700 rounded-xl shadow-md border-l-4 border-sas-blue overflow-hidden flex flex-col">
          <div className="bg-sas-light dark:bg-slate-800 p-3 px-4 flex justify-between items-center border-b border-sas-gray/20">
             <div className="flex items-center gap-2 text-sas-blue dark:text-sas-teal font-bold">
                <FileText size={18} />
                <span>{promptTitle}</span>
             </div>
             <CopyButton text={promptText} />
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex-grow">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-700 dark:text-slate-300">
                {promptText}
            </pre>
          </div>
        </div>

        {/* Section 2: Suggestions Window */}
        {suggestionsPart.trim() && (
            <div className="flex-1 w-full lg:w-1/2 bg-white dark:bg-slate-700 rounded-xl shadow-md border-l-4 border-sas-yellow overflow-hidden flex flex-col">
              <div className="bg-sas-light dark:bg-slate-800 p-3 px-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold border-b border-sas-gray/20">
                <MessageSquare size={18} />
                <span>Suggestions & Feedback</span>
              </div>
              <div className="p-5 prose dark:prose-invert max-w-none text-sm leading-relaxed flex-grow">
                 <ReactMarkdown>{suggestionsPart}</ReactMarkdown>
              </div>
            </div>
        )}
      </div>
    );
  };

  const getLabel = (text: string) => (
    <label className="block mb-2 text-sm font-bold text-slate-700 dark:text-sas-gray whitespace-nowrap overflow-hidden text-ellipsis">
      {text} <span className="text-red-500">*</span>
    </label>
  );

  const getInputClass = (fieldName: keyof PromptInputs) => `
    w-full p-3 rounded-lg border 
    ${errors[fieldName] 
      ? 'border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-900/10' 
      : 'border-sas-gray/40 dark:border-slate-600 bg-sas-light dark:bg-slate-900 focus:ring-sas-blue'
    } 
    focus:ring-2 outline-none transition-all
  `;

  // Setup Form
  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto p-2 md:p-4 animate-fadeIn">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-sas-gray/20 overflow-hidden">
          <div className="bg-gradient-to-r from-sas-blue to-blue-800 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-sas-yellow" />
              Create Your Prompt
            </h2>
            <p className="opacity-80 text-sm mt-1">Fill in the details below to generate a high-quality prompt.</p>
          </div>
          
          <form onSubmit={handleStart} className="p-4 md:p-8 space-y-6">
            {/* Using a flex container on mobile and grid on desktop to ensure perfect stacking */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                {getLabel("Goal (What should the AI do?)")}
                <textarea
                  className={`${getInputClass('goal')} min-h-[100px]`}
                  placeholder="e.g., Write a blog post about coffee..."
                  value={inputs.goal}
                  onChange={e => {
                    setInputs({...inputs, goal: e.target.value});
                    if (errors.goal) setErrors(prev => ({...prev, goal: false}));
                  }}
                />
              </div>

              <div className="md:col-span-2">
                {getLabel("Context (Background info)")}
                <textarea
                  className={`${getInputClass('context')} min-h-[100px]`}
                  placeholder="e.g., We are a sustainable coffee brand launching a new roast..."
                  value={inputs.context}
                  onChange={e => {
                    setInputs({...inputs, context: e.target.value});
                    if (errors.context) setErrors(prev => ({...prev, context: false}));
                  }}
                />
              </div>

              <div className="w-full">
                {getLabel("Style / Tone")}
                <select
                  className={getInputClass('style')}
                  value={inputs.style}
                  onChange={e => {
                    setInputs({...inputs, style: e.target.value});
                    if (errors.style) setErrors(prev => ({...prev, style: false}));
                  }}
                >
                  <option value="">Select style</option>
                  {STYLE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                {getLabel("Format")}
                <select
                  className={getInputClass('format')}
                  value={inputs.format}
                  onChange={e => {
                    setInputs({...inputs, format: e.target.value});
                    if (errors.format) setErrors(prev => ({...prev, format: false}));
                  }}
                >
                  <option value="">Select format</option>
                  {FORMAT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                {getLabel("Length")}
                <select
                  className={getInputClass('length')}
                  value={inputs.length}
                  onChange={e => {
                    setInputs({...inputs, length: e.target.value});
                    if (errors.length) setErrors(prev => ({...prev, length: false}));
                  }}
                >
                  <option value="">Select length</option>
                  <option value="Short (1-2 paragraphs)">Short (1-2 paragraphs)</option>
                  <option value="Medium (500 words)">Medium (500 words)</option>
                  <option value="Detailed (1000+ words)">Detailed (1000+ words)</option>
                </select>
              </div>

              <div className="w-full">
                {getLabel("Audience")}
                <select
                  className={getInputClass('audience')}
                  value={inputs.audience}
                  onChange={e => {
                    setInputs({...inputs, audience: e.target.value});
                    if (errors.audience) setErrors(prev => ({...prev, audience: false}));
                  }}
                >
                  <option value="">Select audience</option>
                  {AUDIENCE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sas-blue hover:bg-blue-900 text-white font-bold py-4 px-6 rounded-lg shadow-xl shadow-sas-blue/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                Generate Initial Prompt
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex flex-col p-2 md:p-4">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-8 p-4 rounded-xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border border-sas-gray/20 shadow-inner mb-4">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'user' ? (
                <div className="max-w-[80%] bg-sas-blue text-white rounded-2xl rounded-br-none p-4 shadow-md">
                   <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
            ) : (
                renderModelMessage(msg.content, msg.isFinal)
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-bl-none shadow-md flex items-center gap-2">
              <span className="w-2 h-2 bg-sas-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-sas-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-sas-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-sas-gray/20">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (inputError) setInputError(false);
            }}
            placeholder="Suggest improvements..."
            className={`flex-1 p-4 rounded-lg bg-sas-light dark:bg-slate-900 border focus:ring-2 outline-none dark:text-white transition-all ${
              inputError 
                ? 'border-red-500 ring-1 ring-red-500 placeholder-red-400' 
                : 'border-transparent focus:ring-sas-blue'
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sas-blue hover:bg-blue-900 text-white p-4 rounded-lg transition-transform active:scale-95 shadow-lg shadow-sas-blue/20 disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};
