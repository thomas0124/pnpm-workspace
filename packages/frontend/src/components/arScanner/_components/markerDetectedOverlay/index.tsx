export function MarkerDetectedOverlay() {
  return (
    <div className="absolute left-1/2 top-1/2 flex w-64 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl bg-white p-8 shadow-2xl duration-300 animate-in fade-in zoom-in">
      {/* Marker Icon */}
      <div className="relative mb-4 h-32 w-32">
        <div className="absolute inset-0 rounded-lg border-8 border-black" />
        <div className="absolute inset-4 rounded-sm border-8 border-black" />
        <div className="absolute inset-8 rounded-sm bg-black" />
      </div>

      {/* Text */}
      <h2 className="mb-2 text-lg font-bold text-gray-900">AR MARKER</h2>
      <p className="text-sm text-gray-500">ID: 001</p>
    </div>
  );
}
