import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, DollarSign } from "lucide-react";
import type { ExhibitionFormData } from "@/app/exhibitor/information/types";
import { DESCRIPTION_MAX_LENGTH } from "@/app/exhibitor/information/constants";
import { CategorySelector } from "@/app/exhibitor/information/_components/categorySelector";
import { ArDesignSelector } from "@/app/exhibitor/information/_components/arDesignSelector";
import { ImageUpload } from "@/app/exhibitor/information/_components/imageUpload";

interface FormSectionProps {
  formData: ExhibitionFormData;
  onUpdate: <K extends keyof ExhibitionFormData>(
    field: K,
    value: ExhibitionFormData[K],
  ) => void;
}

export function FormSection({ formData, onUpdate }: FormSectionProps) {
  return (
    <div className="col-span-2">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="mb-1 text-xl font-bold text-gray-900">
            基本情報の入力
          </h2>
          <p className="text-sm text-gray-600">
            出展の基本情報を入力してください
          </p>
        </div>

        <div className="space-y-6">
          <CategorySelector
            selectedCategory={formData.selectedCategory}
            onSelect={(category) => onUpdate("selectedCategory", category)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                出展タイトル
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onUpdate("title", e.target.value)}
                className="border-gray-200 bg-gray-50"
              />
            </div>
            <div>
              <label
                htmlFor="circle"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                サークル名
              </label>
              <Input
                id="circle"
                value={formData.circleName}
                onChange={(e) => onUpdate("circleName", e.target.value)}
                className="border-gray-200 bg-gray-50"
              />
            </div>
          </div>

          <ImageUpload />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                <MapPin className="mr-1 inline h-4 w-4" />
                場所
              </label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onUpdate("location", e.target.value)}
                className="border-gray-200 bg-gray-50"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                <DollarSign className="mr-1 inline h-4 w-4" />
                金額
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ¥
                </span>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => onUpdate("price", e.target.value)}
                  className="border-gray-200 bg-gray-50 pl-8"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              <Clock className="mr-1 inline h-4 w-4" />
              所要時間
            </label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => onUpdate("duration", e.target.value)}
              className="border-gray-200 bg-gray-50"
            />
          </div>

          <ArDesignSelector
            selectedArDesign={formData.selectedArDesign}
            onSelect={(design) => onUpdate("selectedArDesign", design)}
          />

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              紹介コメント
            </label>
            <p className="mb-2 text-xs text-gray-500">
              最大100文字まで入力できます
            </p>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={6}
              className="resize-none border-gray-200 bg-gray-50"
            />
            <div className="mt-1 text-right text-xs text-gray-500">
              {formData.description.length} / {DESCRIPTION_MAX_LENGTH}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
