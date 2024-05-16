import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

import { sortDirections } from "./query/getTokensFromCollection";

export const searchParamsCache = createSearchParamsCache({
  sortDirection: parseAsStringLiteral(sortDirections).withDefault("asc"),
});
