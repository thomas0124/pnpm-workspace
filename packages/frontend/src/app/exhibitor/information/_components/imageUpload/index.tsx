"use client";

import { Upload } from "lucide-react";
import { useRef, ChangeEvent } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageChange: (file: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
];

export function ImageUpload({ onImageChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイル形式のバリデーション
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("形式エラー", {
        description: "PNG、JPG、GIF形式の画像のみアップロードできます",
      });
      // inputの値をリセットして、同じファイルを再度選択できるようにする
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // ファイルサイズのバリデーション
    if (file.size > MAX_FILE_SIZE) {
      toast.error("サイズオーバー", {
        description: "ファイルサイズは5MB以下にしてください",
      });
      // inputの値をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // FileReaderでプレビュー用のbase64文字列を生成
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      onImageChange(preview);
      toast.success("画像をアップロードしました");
    };
    reader.onerror = () => {
      toast.error("読み込みエラー", {
        description: "画像の読み込みに失敗しました",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        写真
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div
        onClick={handleClick}
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="mb-1 text-sm text-gray-600">
          クリックして写真をアップロード
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, GIF (最大 5MB)</p>
      </div>
    </div>
  );
}