import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, DollarSign } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ExhibitionFormSchema } from "@/app/exhibitor/information/types";
import { DESCRIPTION_MAX_LENGTH } from "@/app/exhibitor/information/constants";
import { CategorySelector } from "@/app/exhibitor/information/_components/categorySelector";
import { ImageUpload } from "@/app/exhibitor/information/_components/imageUpload";
import { InputWithLabel } from "@/components/inputWithLabel";
import * as React from "react";

interface FormSectionProps {
  form: UseFormReturn<ExhibitionFormSchema>;
}

export function FormSection({ form }: FormSectionProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const category = watch("category");
  const commentValue = watch("comment") ?? "";

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
            selectedCategory={category}
            onSelect={(selectedCategory) =>
              setValue("category", selectedCategory, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              id="title"
              label="出展タイトル"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
            <InputWithLabel
              id="circle"
              label="サークル名"
              {...register("exhibitorName")}
            />
            {errors.exhibitorName && (
              <p className="text-sm text-red-500">
                {errors.exhibitorName.message}
              </p>
            )}
          </div>

          <ImageUpload
            onImageChange={(preview) => {
              setValue("image", preview || "", {
                shouldValidate: false,
                shouldDirty: true,
              });
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
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
            <InputWithLabel
              id="price"
              label={
                <>
                  <DollarSign className="mr-1 inline h-4 w-4" />
                  金額
                </>
              }
              type="number"
              min="0"
              {...register("price", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
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
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <InputWithLabel
            id="duration"
            label={
              <>
                <Clock className="mr-1 inline h-4 w-4" />
                所要時間
              </>
            }
            type="number"
            min="0"
            {...register("requiredTime", {
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
            inputWrapper={(input) => (
              <div className="relative">
                {React.cloneElement(input, {
                  className: `${input.props.className} pr-8`,
                })}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  分
                </span>
              </div>
            )}
          />
          {errors.requiredTime && (
            <p className="text-sm text-red-500">
              {errors.requiredTime.message}
            </p>
          )}

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
              {...register("comment")}
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={6}
              className="resize-none border-gray-200 bg-gray-50"
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
            <div className="mt-1 text-right text-xs text-gray-500">
              {commentValue ? commentValue.length : 0} /{" "}
              {DESCRIPTION_MAX_LENGTH}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
