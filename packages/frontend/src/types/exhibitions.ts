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

/**
 * 出展情報の詳細（バックエンドのExhibitionInformationDtoに対応）
 */
export interface ExhibitionInformationDto {
  id: string;
  exhibitorId: string;
  exhibitorName: string;
  title: string;
  category: Category;
  location: string;
  price: number | null;
  requiredTime: number | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  image: string | null;
}

/**
 * 出展情報（バックエンドのExhibitionDtoに対応）
 */
export interface ExhibitionDto {
  id: string;
  exhibitorId: string;
  exhibitionInformationId: string | null;
  exhibitionInformation: ExhibitionInformationDto | null;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
