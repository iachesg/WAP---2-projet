import { createContext } from "react";

export interface SearchContextType {
  searchText: string;
  setSearchText: (text: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);
