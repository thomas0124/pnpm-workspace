export type Category = "飲食" | "展示" | "体験" | "ステージ";

export type ArDesign = "なし" | "1番" | "2番" | "3番";

export interface ExhibitionFormData {
  id: string;
  title: string;
  exhibitorName: string;
  category: Category;
  price?: number;
  location: string;
  requiredTime?: number;
  comment?: string;
  image?: string;
  arDesign?: { id: string; url: string };
}
