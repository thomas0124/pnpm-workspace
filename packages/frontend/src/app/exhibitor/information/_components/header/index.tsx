import { Button } from "@/components/button";
import { Save, Share2, Trash2 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          えあパンフ - 出展者管理
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" color="gray">
            <Save className="h-4 w-4" />
            下書き保存
          </Button>
          <Button color="teal">
            <Share2 className="h-4 w-4" />
            公開
          </Button>
          <Button variant="outline" color="red">
            <Trash2 className="h-4 w-4" />
            出展取り消し
          </Button>
        </div>
      </div>
    </header>
  );
}
