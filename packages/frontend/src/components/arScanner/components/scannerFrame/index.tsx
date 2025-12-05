import { MarkerDetectedOverlay } from "@/components/arScanner/components/markerDetectedOverlay";

interface ScannerFrameProps {
  markerDetected: boolean;
}

export function ScannerFrame({ markerDetected }: ScannerFrameProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
      <div className="relative aspect-square w-full max-w-md">
        {/* Top Left Corner */}
        <div className="absolute left-0 top-0 h-24 w-24">
          <div className="absolute left-0 top-0 h-1 w-full rounded-full bg-teal-400" />
          <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-teal-400" />
        </div>

        {/* Top Right Corner */}
        <div className="absolute right-0 top-0 h-24 w-24">
          <div className="absolute right-0 top-0 h-1 w-full rounded-full bg-teal-400" />
          <div className="absolute right-0 top-0 h-full w-1 rounded-full bg-teal-400" />
        </div>

        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 h-24 w-24">
          <div className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-teal-400" />
          <div className="absolute bottom-0 left-0 h-full w-1 rounded-full bg-teal-400" />
        </div>

        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 h-24 w-24">
          <div className="absolute bottom-0 right-0 h-1 w-full rounded-full bg-teal-400" />
          <div className="absolute bottom-0 right-0 h-full w-1 rounded-full bg-teal-400" />
        </div>

        {markerDetected && <MarkerDetectedOverlay />}
      </div>
    </div>
  );
}
