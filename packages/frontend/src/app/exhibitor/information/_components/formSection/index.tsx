import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, DollarSign, AlertCircle } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ExhibitionFormSchema } from "@/app/exhibitor/information/types";
import { DESCRIPTION_MAX_LENGTH } from "@/app/exhibitor/information/constants";
import { CategorySelector } from "@/app/exhibitor/information/_components/categorySelector";
import { ImageUpload } from "@/app/exhibitor/information/_components/imageUpload";
import { InputWithLabel } from "@/components/inputWithLabel";
import * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  form: UseFormReturn<ExhibitionFormSchema>;
}

/**
 * エラーメッセージ表示用コンポーネント
 */
function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-2 flex items-center gap-x-2 rounded-md bg-red-50 p-2 text-sm text-red-600 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
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
          <div className="space-y-1">
            <CategorySelector
              selectedCategory={category}
              onSelect={(selectedCategory) =>
                setValue("category", selectedCategory, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
            <ErrorMessage message={errors.category?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <InputWithLabel
                id="title"
                label="出展タイトル"
                className={cn(
                  errors.title &&
                    "border-red-500 bg-red-50/30 focus-visible:ring-red-500",
                )}
                {...register("title")}
              />
              <ErrorMessage message={errors.title?.message} />
            </div>
            <div className="space-y-1">
              <InputWithLabel
                id="circle"
                label="サークル名"
                className={cn(
                  errors.exhibitorName &&
                    "border-red-500 bg-red-50/30 focus-visible:ring-red-500",
                )}
                {...register("exhibitorName")}
              />
              <ErrorMessage message={errors.exhibitorName?.message} />
            </div>
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
            <div className="space-y-1">
              <InputWithLabel
                id="location"
                label={
                  <>
                    <MapPin className="mr-1 inline h-4 w-4" />
                    場所
                  </>
                }
                className={cn(
                  errors.location &&
                    "border-red-500 bg-red-50/30 focus-visible:ring-red-500",
                )}
                {...register("location")}
              />
              <ErrorMessage message={errors.location?.message} />
            </div>
            <div className="space-y-1">
              <InputWithLabel
                id="price"
                label={
                  <>
                    <DollarSign className="mr-1 inline h-4 w-4" />
                    金額
                  </>
                }
                type="number"
                min="1"
                className={cn(
                  errors.price &&
                    "border-red-500 bg-red-50/30 focus-visible:ring-red-500",
                )}
                {...register("price", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || v === undefined) return null;
                    const num = Number(v);
                    return isNaN(num) ? null : num;
                  },
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
              <ErrorMessage message={errors.price?.message} />
            </div>
          </div>

          <div className="space-y-1">
            <InputWithLabel
              id="duration"
              label={
                <>
                  <Clock className="mr-1 inline h-4 w-4" />
                  所要時間
                </>
              }
              type="number"
              min="1"
              className={cn(
                errors.requiredTime &&
                  "border-red-500 bg-red-50/30 focus-visible:ring-red-500",
              )}
              {...register("requiredTime", {
                setValueAs: (v) => {
                  if (v === "" || v === null || v === undefined) return null;
                  const num = Number(v);
                  return isNaN(num) ? null : num;
                },
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
            <ErrorMessage message={errors.requiredTime?.message} />
          </div>

          {/* <ArDesignSelector
            selectedArDesign={formData.selectedArDesign}
            onSelect={(design) => onUpdate("selectedArDesign", design)}
          /> */}

          <div className="space-y-1">
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
              className={cn(
                "resize-none border-gray-200 bg-gray-50",
                errors.comment &&
                  "border-red-500 bg-red-50/30 focus-visible:ring-red-500",
              )}
            />
            <ErrorMessage message={errors.comment?.message} />
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
