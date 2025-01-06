import { createContext, useState } from "react";

type SearchProviderType = {
  children: React.ReactNode;
};
type SearchContextType = {
  searchType: string;
  setSearchType: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchContext = createContext<SearchContextType>({
  searchType: "",
  setSearchType: () => {},
});

export const SearchProvider = ({ children }: SearchProviderType) => {
  const [searchType, setSearchType] = useState("");
  console.log("searchType",searchType)
  return (
    <SearchContext.Provider value={{ searchType, setSearchType }}>
      {children}
    </SearchContext.Provider>
  );
};
