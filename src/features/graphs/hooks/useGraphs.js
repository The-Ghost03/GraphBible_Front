import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

export const useGraphs = () => {
  return useQuery({
    queryKey: ["graphs"], // Le nom de ce cache
    queryFn: async () => {
      const { data } = await api.get("/graphs/");
      return data.graphs; // On ne retourne que le tableau de graphes
    },
  });
};
