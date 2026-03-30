'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">Error</h1>
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Something went wrong</h2>
      <p className="text-text-secondary mb-8 max-w-md">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-amber transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
}
