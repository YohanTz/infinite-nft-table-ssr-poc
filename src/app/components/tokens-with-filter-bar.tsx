"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import TokenDataTable from "./token-data-table";
import getTokensFromCollection, {
  sortDirections,
  type MagicEdenCollectionResponse,
} from "../query/getTokensFromCollection";
import { Button } from "~/components/ui/button";
import FilterBar from "./filter-bar";
import { parseAsStringLiteral, useQueryState } from "nuqs";

interface TokensWithFilterBarProps {
  initialData: MagicEdenCollectionResponse;
}

export default function TokensWithFilterBar({
  initialData,
}: TokensWithFilterBarProps) {
  const [sortDirection, setSortDirection] = useQueryState(
    "sortDirection",
    parseAsStringLiteral(sortDirections).withDefault("asc"),
  );

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialData: {
      pages: [initialData],
      pageParams: [],
    },
    queryKey: ["collectionInfo", sortDirection],
    queryFn: ({ pageParam }) =>
      getTokensFromCollection({
        nextCursor: pageParam,
        collection: "0xed5af388653567af2f388e6224dc7c4b3241c544",
        sortDirection,
      }),
    getNextPageParam: (lastPage) => lastPage.continuation ?? undefined,

    initialPageParam: undefined as undefined | string,
  });

  return (
    <>
      <FilterBar
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        className="mt-8"
      />
      <TokenDataTable className="mt-2" infiniteData={infiniteData} />
      {hasNextPage && (
        <Button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          variant="secondary"
          className="mt-4"
        >
          {isFetchingNextPage ? "Loading..." : "Fetch more NFTs!"}
        </Button>
      )}
    </>
  );
}
