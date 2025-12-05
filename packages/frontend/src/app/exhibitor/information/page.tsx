"use client";

import { Header } from "@/app/exhibitor/information/_components/header";
import { Sidebar } from "@/app/exhibitor/information/_components/sidebar";
import { FormSection } from "@/app/exhibitor/information/_components/formSection";
import { PreviewSection } from "@/app/exhibitor/information/_components/previewSection";
import { useExhibitionForm } from "@/app/exhibitor/information/hooks/useExhibitionForm";

export default function BasicInfoPage() {
  const { formData, updateField } = useExhibitionForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-3 gap-8">
              <FormSection formData={formData} onUpdate={updateField} />
              <PreviewSection formData={formData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
