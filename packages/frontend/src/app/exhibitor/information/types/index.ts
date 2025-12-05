export type Category = "飲食" | "展示" | "体験" | "ステージ";

export type ArDesign = "なし" | "1番" | "2番" | "3番";

export interface ExhibitionFormData {
  selectedCategory: Category;
  selectedArDesign: ArDesign;
  title: string;
  circleName: string;
  location: string;
  price: string;
  duration: string;
  description: string;
  image: File | null;
  imagePreview: string | null;
}
