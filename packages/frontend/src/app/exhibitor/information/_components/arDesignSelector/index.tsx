import type { ArDesign } from "@/app/exhibitor/information/types";
import { AR_DESIGNS } from "@/app/exhibitor/information/constants";

interface ArDesignSelectorProps {
  selectedArDesign: ArDesign;
  onSelect: (design: ArDesign) => void;
}

export function ArDesignSelector({
  selectedArDesign,
  onSelect,
}: ArDesignSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        ARデザイン
      </label>
      <div className="flex gap-2">
        {AR_DESIGNS.map((design) => (
          <button
            key={design}
            onClick={() => onSelect(design)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              selectedArDesign === design
                ? "bg-red-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {design}
          </button>
        ))}
      </div>
    </div>
  );
}
