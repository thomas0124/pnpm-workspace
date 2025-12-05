import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, DollarSign } from "lucide-react";
import type { ExhibitionFormData } from "@/types/exhibitions";
import { DESCRIPTION_MAX_LENGTH } from "@/app/exhibitor/information/constants";
import { CategorySelector } from "@/app/exhibitor/information/_components/categorySelector";
import { ImageUpload } from "@/app/exhibitor/information/_components/imageUpload";
import { InputWithLabel } from "@/components/inputWithLabel";
import * as React from "react";

interface FormSectionProps {
  formData: ExhibitionFormData;
  onUpdate: <K extends keyof ExhibitionFormData>(
    field: K,
    value: ExhibitionFormData[K],
  ) => void;
}

export function FormSection({ formData, onUpdate }: FormSectionProps) {
  return (
    <div className="col-span-2 h-full overflow-y-auto pr-2">
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
            selectedCategory={formData.category}
            onSelect={(category) => onUpdate("category", category)}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              id="title"
              label="出展タイトル"
              value={formData.title}
              onChange={(e) => onUpdate("title", e.target.value)}
            />
            <InputWithLabel
              id="circle"
              label="サークル名"
              value={formData.exhibitorName}
              onChange={(e) => onUpdate("exhibitorName", e.target.value)}
            />
          </div>

          <ImageUpload
            onImageChange={(preview) => {
              onUpdate("image", preview || "");
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              id="location"
              label={
                <>
                  <MapPin className="mr-1 inline h-4 w-4" />
                  場所
                </>
              }
              value={formData.location}
              onChange={(e) => onUpdate("location", e.target.value)}
            />
            <InputWithLabel
              id="price"
              label={
                <>
                  <DollarSign className="mr-1 inline h-4 w-4" />
                  金額
                </>
              }
              type="number"
              value={formData.price ?? ""}
              onChange={(e) => onUpdate("price", parseInt(e.target.value))}
              inputWrapper={(input) => (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ¥
                  </span>
                  {React.cloneElement(input, {
                    className: `${input.props.className} pl-8`,
                  })}
                </div>
              )}
            />
          </div>

          <InputWithLabel
            id="duration"
            label={
              <>
                <Clock className="mr-1 inline h-4 w-4" />
                所要時間
              </>
            }
            value={formData.requiredTime ?? ""}
            onChange={(e) => onUpdate("requiredTime", parseInt(e.target.value))}
          />

          {/* <ArDesignSelector
            selectedArDesign={formData.selectedArDesign}
            onSelect={(design) => onUpdate("selectedArDesign", design)}
          /> */}

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
              value={formData.comment ?? ""}
              onChange={(e) => onUpdate("comment", e.target.value)}
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={6}
              className="resize-none border-gray-200 bg-gray-50"
            />
            <div className="mt-1 text-right text-xs text-gray-500">
              {formData.comment ? formData.comment.length : 0} /{" "}
              {DESCRIPTION_MAX_LENGTH}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
