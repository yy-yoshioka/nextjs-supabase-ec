"use client";

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function SuccessMessage({
  message,
  onDismiss,
  className = "",
}: SuccessMessageProps) {
  return (
    <div
      className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="mr-3 flex-shrink-0 pt-0.5">
          <svg
            className="h-5 w-5 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            className="text-green-700 hover:text-green-900"
            onClick={onDismiss}
            aria-label="閉じる"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
