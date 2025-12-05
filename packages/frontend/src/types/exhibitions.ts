export type Category = "Food" | "Exhibition" | "Experience" | "Stage";

export interface ExhibitionFormData {
  id: string;
  title: string;
  exhibitorName: string;
  category: Category;
  price: number | null;
  location: string;
  requiredTime: number | null;
  comment: string | null;
  image: string | null;
}
