import { Clock, MapPin } from "lucide-react";

export interface ExhibitionItemProps {
  item: {
    id: number;
    name: string;
    organization: string;
    category: string;
    price: number;
    location: string;
    duration: string;
    description: string;
    icon?: string;
  };
}

export function ExhibitionItem({ item }: ExhibitionItemProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-yellow-400 text-4xl">
            <img
              src={item.icon || "/placeholder.svg"}
              alt={item.name}
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-lg text-gray-900">{item.name}</h3>
          <p className="mb-3 text-sm text-gray-600">{item.organization}</p>

          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-500">
              {item.category}
            </span>
            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              ¥{item.price}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs text-cyan-600">
              <MapPin className="h-3 w-3" />
              {item.location}
            </span>
          </div>

          {/* Duration */}
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{item.duration}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
