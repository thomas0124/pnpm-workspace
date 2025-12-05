import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ARHeaderProps {
  markerDetected: boolean;
}

export function ARHeader({ markerDetected }: ARHeaderProps) {
  return (
    <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
      <Link href="/exhibitions">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>

      <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
        <div
          className={`h-2 w-2 rounded-full ${
            markerDetected
              ? "animate-pulse bg-green-400"
              : "animate-pulse bg-teal-400"
          }`}
        />
        <span className="text-sm font-medium text-white">
          {markerDetected ? "マーカー検出" : "AR検出中"}
        </span>
      </div>
    </div>
  );
}
