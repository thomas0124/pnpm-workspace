import type { Category, ArDesign } from "@/app/exhibitor/information/types";

export const CATEGORIES: Category[] = ["飲食", "展示", "体験", "ステージ"];

export const AR_DESIGNS: ArDesign[] = ["なし", "1番", "2番", "3番"];

export const DEFAULT_FORM_DATA = {
  selectedCategory: "飲食" as Category,
  selectedArDesign: "なし" as ArDesign,
  title: "マルゲリータピザ",
  circleName: "イタリア料理研究会",
  location: "1号館 201",
  price: "500",
  duration: "約15分",
  description: "",
  image: null,
  imagePreview: null,
};

export const DESCRIPTION_MAX_LENGTH = 100;
