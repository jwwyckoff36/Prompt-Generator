
import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { MathProblem, MathOperation } from '../types';

interface Props {
  onSuccess: () => void;
  onFail: () => void;
}

export const VerificationPage: React.FC<Props> = ({ onSuccess, onFail }) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'neutral' | 'success' | 'error'>('neutral');

  const generateProblem = () => {
    // Whole numbers between 5 and 50
    const num1 = Math.floor(Math.random() * 46) + 5;
    const num2 = Math.floor(Math.random() * 46) + 5;
    
    setProblem({
      num1,
      num2,
      operation: MathOperation.ADD,
      answer: num1 + num2
    });
    setUserAnswer('');
  };

  useEffect(() => {
    generateProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;

    const val = parseInt(userAnswer, 10);
    
    if (val === problem.answer) {
      setStatus('success');
      setMessage("Human verification complete. Proceeding to Access Verification.");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setStatus('error');
        setMessage("Verification failed. Access denied.");
        setTimeout(() => {
          onFail();
        }, 2000);
      } else {
        setStatus('error');
        setMessage("Incorrect answer. Please try again.");
        setUserAnswer('');
      }
    }
  };

  if (!problem) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-sas-gray/20">
        <div className="bg-sas-blue p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-sas-yellow mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Human Verification</h2>
        </div>
        
        <div className="p-8 text-center space-y-6">
          <p className="text-slate-600 dark:text-slate-400">
            Please solve the following equation to prove you are human.
          </p>
          
          <div className="bg-sas-light dark:bg-slate-900 p-6 rounded-lg border border-sas-gray/30">
            <span className="text-3xl font-mono font-bold text-sas-blue dark:text-sas-teal">
              {problem.num1} {problem.operation} {problem.num2} = ?
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl font-bold rounded-lg border border-sas-gray/50 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-sas-blue outline-none dark:text-white"
              placeholder="?"
              autoFocus
            />

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status === 'error' && <AlertCircle size={16} />}
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'success' || attempts >= 5}
              className="w-full bg-sas-blue hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform active:scale-95"
            >
              Verify Answer
            </button>
          </form>
          
          <p className="text-xs text-slate-400">
            Attempt {attempts + 1} of 5
          </p>
        </div>
      </div>
    </div>
  );
};
