import { Button } from "@/components/ui/button";
import { Save, Share2, Trash2 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          デジタルパンフレット - 出展者管理
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
          >
            <Save className="h-4 w-4" />
            下書き保存
          </Button>
          <Button className="gap-2 bg-teal-400 text-white hover:bg-teal-500">
            <Share2 className="h-4 w-4" />
            公開
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-red-400 bg-transparent text-red-400 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            出展取り消し
          </Button>
        </div>
      </div>
    </header>
  );
}
