import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import type { ExhibitionFormData } from "@/types/exhibitions";

export function ExhibitionPreview({ item }: { item: ExhibitionFormData }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="rounded-2x flex h-24 w-24 items-center justify-center text-4xl">
            <Image
              width={48}
              height={48}
              src={
                item.image
                  ? item.image.startsWith("data:")
                    ? item.image
                    : `data:image/jpeg;base64,${item.image}`
                  : "/placeholder.svg"
              }
              alt={item.title}
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-lg text-gray-900">{item.title}</h3>
          <p className="mb-3 text-sm text-gray-600">{item.exhibitorName}</p>

          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-500">
              {item.category}
            </span>
            {item.price !== undefined && (
              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                ¥{item.price}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs text-cyan-600">
              <MapPin className="h-3 w-3" />
              {item.location}
            </span>
          </div>

          {/* Duration */}
          {item.requiredTime !== undefined && (
            <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{item.requiredTime}分</span>
            </div>
          )}

          {/* Comment */}
          {item.comment && (
            <p className="text-sm text-gray-700">{item.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
