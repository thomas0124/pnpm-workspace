"use client";

import { Header } from "@/app/exhibitor/information/_components/header";
import { Sidebar } from "@/app/exhibitor/information/_components/sidebar";
import { FormSection } from "@/app/exhibitor/information/_components/formSection";
import { ExhibitionPreview } from "@/components/exhibitionPreview";
import { useExhibitionForm } from "@/app/exhibitor/information/hooks/useExhibitionForm";
import type { Category } from "@/types/exhibitions";

export default function BasicInfoPage() {
  const { formData, updateField } = useExhibitionForm();

  const categoryDisplayMap: Record<Category, string> = {
    Food: "飲食",
    Exhibition: "展示",
    Experience: "体験",
    Stage: "ステージ",
  };

  const displayItem = {
    ...formData,
    displayCategory: categoryDisplayMap[formData.category as Category],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 overflow-hidden p-8">
          <div className="mx-auto h-full max-w-[1400px]">
            <div className="grid h-full grid-cols-3 gap-8">
              <FormSection formData={formData} onUpdate={updateField} />
              <ExhibitionPreview item={displayItem} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
