import { MapPin, Clock } from "lucide-react";
import type { ExhibitionFormData } from "@/app/exhibitor/information/types";

interface PreviewSectionProps {
  formData: ExhibitionFormData;
}

export function PreviewSection({ formData }: PreviewSectionProps) {
  return (
    <div className="col-span-1">
      <div className="sticky top-8">
        <h3 className="mb-4 text-sm font-medium text-gray-700">プレビュー</h3>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-yellow-400">
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt="プレビュー"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl">🍕</span>
            )}
          </div>
          <h4 className="mb-1 text-lg font-bold text-gray-900">
            {formData.title}
          </h4>
          <p className="mb-4 text-sm text-gray-600">{formData.circleName}</p>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-500">
              {formData.selectedCategory}
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
              ¥{formData.price}
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
              <MapPin className="mr-1 inline h-3 w-3" />
              {formData.location.split(" ")[0]}
            </span>
          </div>
          <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formData.duration}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">
            {formData.description || "本格窯焼きピザをお楽しみください"}
          </p>
        </div>
      </div>
    </div>
  );
}
