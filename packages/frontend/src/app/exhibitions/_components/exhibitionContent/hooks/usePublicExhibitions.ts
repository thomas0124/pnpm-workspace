import useSWR from "swr";
import client from "@/lib/apiClient";

type Category = "Food" | "Exhibition" | "Experience" | "Stage";

export interface PublicExhibition {
  id: string;
  title: string;
  category: Category;
  exhibitorName: string;
  location: string;
  price: number | null;
  requiredTime: number | null;
  comment: string | null;
  image: string | null;
}

interface UsePublicExhibitionsParams {
  search?: string;
  category?: string;
}

async function fetcherExhibitions(
  search?: string,
  category?: string,
): Promise<PublicExhibition[]> {
  const query: { search?: string; category?: Category } = {};
  if (search) {
    query.search = search;
  }
  if (
    category &&
    ["Food", "Exhibition", "Experience", "Stage"].includes(category)
  ) {
    query.category = category as Category;
  }

  const response = await client.public.exhibitions.$get({
    query,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch exhibitions");
  }

  const result = await response.json();
  return result.data;
}

export function usePublicExhibitions({
  search,
  category,
}: UsePublicExhibitionsParams) {
  const { data, isLoading, error } = useSWR<PublicExhibition[], Error>(
    ["public-exhibitions", search, category],
    ([, search, category]: [string, string | undefined, string | undefined]) =>
      fetcherExhibitions(search, category),
  );

  return { data: data ?? [], isLoading, error: error ?? null };
}
