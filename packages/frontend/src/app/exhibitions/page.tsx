import { Suspense } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ExhibitionsContent } from "@/app/exhibitions/_components/exhibitionContent";

// 動的レンダリングを強制
export const dynamic = "force-dynamic";

// ローディングフォールバック
function ExhibitionsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 pb-20">
      <Spinner className="size-8" />
    </div>
  );
}

export default function ExhibitionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Suspense fallback={<ExhibitionsLoading />}>
        <ExhibitionsContent />
      </Suspense>

      {/* Floating Camera Button */}
      <Link href="/arScanner">
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-teal-500 shadow-2xl hover:bg-teal-600"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Camera className="h-12 w-12 text-white" />
        </Button>
      </Link>
    </div>
  );
}
