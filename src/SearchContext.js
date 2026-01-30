import { createContext } from 'react';

const doSearch = _filterOptions => {
  // SearchContext: do search
};
const searchResults = [1, 2, 3, 4, 5];

const SearchContext = createContext({
  doSearch,
  searchResults,
});

export default SearchContext;
