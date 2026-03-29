export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#D4A853]/30 border-t-[#D4A853] rounded-full animate-spin" />
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
