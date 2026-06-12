import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message, className = '' }) => !message ? null : (
  <div className={`max-w-2xl mx-auto mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 flex items-start gap-3 shadow-lg shadow-red-950/20 backdrop-blur-sm text-sm ${className}`}>
    <FaExclamationTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
    <div className="font-medium">{message}</div>
  </div>
);

export default ErrorMessage;


