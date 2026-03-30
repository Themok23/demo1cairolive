'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">Error</h1>
<<<<<<< HEAD
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Something went wrong</h2>
      <p className="text-text-secondary mb-8 max-w-md">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-amber transition-colors duration-200"
      >
=======
      <h2 className="text-2xl font-semibold mb-4 text-white">Something went wrong</h2>
      <p className="text-gray-400 mb-8 max-w-md">{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} className="px-6 py-3 bg-[#D4A853] text-[#0a0a0f] rounded-lg font-medium hover:bg-[#E8C97A] transition-colors duration-200">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
        Try Again
      </button>
    </div>
  );
}
