import { Upload } from "lucide-react";

export function ImageUpload() {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        写真
      </label>
      <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400">
        <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="mb-1 text-sm text-gray-600">
          クリックして写真をアップロード
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, GIF (最大 5MB)</p>
      </div>
    </div>
  );
}
