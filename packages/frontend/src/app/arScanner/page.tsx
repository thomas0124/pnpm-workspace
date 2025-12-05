"use client";

import { Suspense } from "react";
import ARScanner from "@/components/arScanner";
import { Spinner } from "@/components/ui/spinner";

function ARScannerLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Spinner className="size-8 text-white" />
    </div>
  );
}

export default function ARScannerPage() {
  return (
    <Suspense fallback={<ARScannerLoading />}>
      <ARScanner />
    </Suspense>
  );
}
