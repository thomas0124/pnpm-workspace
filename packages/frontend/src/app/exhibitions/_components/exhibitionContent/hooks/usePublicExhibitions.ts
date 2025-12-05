import useSWR from "swr";
import client from "@/lib/apiClient";
import type { Category, ExhibitionFormData } from "@/types/exhibitions";

interface UsePublicExhibitionsParams {
  search?: string;
  category?: string;
}

async function fetcherExhibitions(
  search?: string,
  category?: string,
): Promise<ExhibitionFormData[]> {
  const query: { search?: string; category?: Category } = {};
  if (search) {
    query.search = search;
  }
  // API expects english Category enum values
  if (category && ["Food", "Exhibition", "Experience", "Stage"].includes(category)) {
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
  const { data, isLoading, error } = useSWR<ExhibitionFormData[], Error>(
    ["public-exhibitions", search, category],
    ([, search, category]: [string, string | undefined, string | undefined]) =>
      fetcherExhibitions(search, category),
  );

  return { data: data ?? [], isLoading, error: error ?? null };
}
