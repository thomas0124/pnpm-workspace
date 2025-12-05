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
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 overflow-hidden p-8">
          <div className="mx-auto h-full max-w-[1400px]">
            <div className="grid h-full grid-cols-3 gap-8">
              <FormSection formData={formData} onUpdate={updateField} />
              <PreviewSection formData={formData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
