import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  onSuccess: (daysRemaining: number) => void;
}

const AUTOMATION_TITLE = "Prompt Generator";
const PRODUCT_KEY = "mqXid";
const WEBHOOK_URL = "https://hook.us2.make.com/w0e3p2fbketv89rd7r3jfh2au1xu4ddb";

export const PermissionsPage: React.FC<Props> = ({ onSuccess }) => {
  const [passkey, setPasskey] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed || !passkey.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          passkey: passkey.trim(), 
          product_key: PRODUCT_KEY 
        }),
      });

      const responseText = (await response.text()).trim();
      const status = response.status;
      
      // Transaction Type Rules
      
      // A. transaction_type (body) = "Invalid" or status 410
      if (status === 410 || responseText === "Invalid") {
        setError('Please recheck your passkey. If the issue continues, you will need to purchase access to this automation.');
        setIsLoading(false);
        return;
      }

      // Check if it's a number (Case B)
      const numberDays = Number(responseText);
      const isNumber = !isNaN(numberDays) && responseText !== '';

      if (isNumber) {
        // B. transaction_type (body) = a number
        setSuccessMsg(`Days remaining to use this automation: ${numberDays}`);

        if (numberDays < 0) {
          setError(`Your access to this automation has expired. To continue using ${AUTOMATION_TITLE}, a new purchase is required.`);
          setSuccessMsg(null);
        } else {
          if (numberDays < 3) {
            setWarning('⚠️ You only have a few days left to use this automation.');
          }
          
          // Proceed to application after visual confirmation
          setTimeout(() => {
            onSuccess(numberDays);
          }, 1500);
        }
      } else {
        // C. transaction_type (body) = Other than "Invalid" or a number (Status 420 or others)
        setError(`You cannot access this automation with the Passkey you entered. The Passkey is for the ${responseText} Automation.`);
        setIsLoading(false);
        return;
      }

    } catch (err) {
      console.error(err);
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !passkey.trim() || !agreed || isLoading;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-sas-gray/20">
        <div className="bg-sas-blue p-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Automation</h2>
          <p className="text-sas-blue/30 text-xs mt-1 uppercase font-bold tracking-widest">Permissions Required</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Lock size={16} className="text-sas-blue dark:text-sas-teal" /> Enter Your Passkey
            </label>
            <input
              type="text"
              required
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sas-gray/40 dark:border-slate-600 bg-sas-light/30 dark:bg-slate-900/50 focus:ring-2 focus:ring-sas-blue focus:border-transparent outline-none dark:text-white transition-all text-lg"
              placeholder="Passkey"
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-sas-gray/10 group cursor-pointer hover:bg-sas-light/50 transition-colors" onClick={() => setAgreed(!agreed)}>
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  e.stopPropagation();
                  setAgreed(e.target.checked);
                  if (error && e.target.checked) setError(null);
                }}
                className="w-5 h-5 text-sas-blue border-sas-gray/40 rounded focus:ring-sas-blue cursor-pointer transition-colors"
              />
            </div>
            <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none">
              I have read, understood, and agree to the{' '}
              <a 
                href="https://thesimpleaistudio.com/terms-of-service" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sas-blue dark:text-sas-teal underline font-bold hover:text-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a 
                href="https://thesimpleaistudio.com/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sas-blue dark:text-sas-teal underline font-bold hover:text-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>.
            </label>
          </div>

          {successMsg && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm border-l-4 border-green-500 flex gap-3 items-center">
              <CheckCircle2 size={18} className="shrink-0" />
              <p className="font-bold">{successMsg}</p>
            </div>
          )}

          {warning && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm border-l-4 border-yellow-500 flex gap-3 items-start">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p className="font-medium">{warning}</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border-l-4 border-red-500 flex gap-3 items-start animate-shake">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="leading-tight font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-sas-blue hover:bg-blue-900 text-white font-bold py-4 px-4 rounded-lg shadow-lg shadow-sas-blue/30 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Submit'}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-sas-gray dark:text-slate-600 font-medium">
        {AUTOMATION_TITLE.toUpperCase()} &bull; SECURE ACCESS
      </p>
    </div>
  );
};
