import { useState, useEffect, useCallback } from 'react';
import { HiOutlineRefresh, HiOutlineShieldCheck } from 'react-icons/hi';

function generateChallenge() {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      return { question: `${a} + ${b}`, answer: a + b };
    case '-':
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * a);
      return { question: `${a} − ${b}`, answer: a - b };
    case '×':
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      return { question: `${a} × ${b}`, answer: a * b };
    default:
      return { question: '2 + 3', answer: 5 };
  }
}

export default function MathCaptcha({ onVerify }) {
  const [challenge, setChallenge] = useState(generateChallenge);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState('pending'); // pending | success | error

  const refresh = useCallback(() => {
    setChallenge(generateChallenge());
    setUserAnswer('');
    setStatus('pending');
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setUserAnswer(val);

    if (val === '') {
      setStatus('pending');
      onVerify(false);
      return;
    }

    const num = parseInt(val, 10);
    if (!isNaN(num) && num === challenge.answer) {
      setStatus('success');
      onVerify(true);
    } else if (val.length >= String(challenge.answer).length) {
      setStatus('error');
      onVerify(false);
    } else {
      setStatus('pending');
      onVerify(false);
    }
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-300 ${
      status === 'success'
        ? 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-500/50'
        : status === 'error'
          ? 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500/50'
          : 'border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineShieldCheck className={`w-5 h-5 ${
          status === 'success' ? 'text-green-500' : 'text-primary-500'
        }`} />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Security Verification
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Challenge display */}
        <div className="flex-1 flex items-center gap-3">
          <div className="select-none px-4 py-2.5 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 font-mono text-lg font-bold text-gray-800 dark:text-white shadow-sm tracking-wider">
            {challenge.question} = ?
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={userAnswer}
            onChange={handleChange}
            placeholder="?"
            maxLength={4}
            className={`w-20 text-center font-mono text-lg font-bold rounded-lg border-2 py-2.5 outline-none transition-all duration-200 ${
              status === 'success'
                ? 'border-green-400 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-500/50'
                : status === 'error'
                  ? 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/50'
                  : 'border-gray-300 dark:border-dark-500 bg-white dark:bg-dark-700 text-gray-800 dark:text-white focus:border-primary-400 dark:focus:border-primary-500'
            }`}
          />
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={refresh}
          title="New challenge"
          className="p-2.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-white dark:hover:bg-dark-700 transition-all duration-200"
        >
          <HiOutlineRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Status message */}
      {status === 'success' && (
        <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1 animate-slide-up">
          ✓ Verified successfully
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1 animate-slide-up">
          ✗ Incorrect answer, try again
        </p>
      )}
    </div>
  );
}
