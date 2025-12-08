// app/uploadpage/loading.tsx
export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-6 text-lg text-gray-700 font-medium">Loading Retina Analyzer...</p>
      </div>
    </div>
  );
}