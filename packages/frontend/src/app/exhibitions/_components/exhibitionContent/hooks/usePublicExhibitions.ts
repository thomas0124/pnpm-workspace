import { useState, useEffect } from "react";
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
  arDesign: {
    id: string;
    url: string | null;
  } | null;
  image: string | null;
}

interface UsePublicExhibitionsParams {
  search?: string;
  category?: string;
}

export function usePublicExhibitions({
  search,
  category,
}: UsePublicExhibitionsParams) {
  const [data, setData] = useState<PublicExhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExhibitions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const query: { search?: string; category?: Category } = {};
        if (search) {
          query.search = search;
        }
        if (category) {
          query.category = category as Category;
        }

        const response = await client.public.exhibitions.$get({
          query,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch exhibitions");
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Failed to fetch exhibitions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, [search, category]);

  return { data, isLoading, error };
}
