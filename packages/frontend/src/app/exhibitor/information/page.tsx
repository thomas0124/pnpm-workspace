"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/exhibitor/information/_components/header";
import { Sidebar } from "@/app/exhibitor/information/_components/sidebar";
import { FormSection } from "@/app/exhibitor/information/_components/formSection";
import { ExhibitionPreview } from "@/components/exhibitionPreview";
import { useAuthGuard } from "@/app/exhibitor/information/hooks/useAuthGuard";
import { useExhibitionForm } from "@/app/exhibitor/information/hooks/useExhibitionForm";
import type { Category } from "@/types/exhibitions";

export default function BasicInfoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();
  const { form, handleSubmit, exhibitionId, setExhibitionId, apiError } =
    useExhibitionForm();
  const watched = form.watch();

  const handleSaveForm = useCallback(async () => {
    await handleSubmit();
  }, [handleSubmit]);

  const handleExhibitionDeleted = useCallback(() => {
    setExhibitionId("");
    form.reset();
    router.push("/exhibitor/information");
  }, [form, router, setExhibitionId]);

  if (isAuthenticated !== true) {
    return null;
  }

  const categoryDisplayMap: Record<Category, string> = {
    Food: "飲食",
    Exhibition: "展示",
    Experience: "体験",
    Stage: "ステージ",
  };

  const displayItem = {
    ...watched,
    displayCategory: categoryDisplayMap[watched.category as Category],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        exhibitionId={exhibitionId}
        onSaveForm={handleSaveForm}
        onExhibitionDeleted={handleExhibitionDeleted}
        formData={watched}
      />
      {apiError && (
        <div className="mx-6 mt-4 border-l-4 border-red-400 bg-red-50 p-4">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 overflow-hidden p-8">
          <div className="mx-auto h-full max-w-[1400px]">
            <div className="grid h-full grid-cols-3 gap-8">
              <FormSection form={form} />
              <ExhibitionPreview item={displayItem} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
