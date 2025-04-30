import { useRouteError } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-lg w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-left">
          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
            {error?.stack || error?.toString()}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
