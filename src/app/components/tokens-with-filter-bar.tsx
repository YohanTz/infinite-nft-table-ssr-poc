"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import TokenDataTable from "./token-data-table";
import getTokensFromCollection from "../query/getTokensFromCollection";

export default function TokensWithFilterBar() {
  const {
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["collectionInfo"],
    queryFn: ({ pageParam }) =>
      getTokensFromCollection({
        nextCursor: pageParam,
        collection: "0xed5af388653567af2f388e6224dc7c4b3241c544",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.continuation ?? (undefined as unknown),
    initialPageParam: undefined,
  });

  return (
    <>
      <button onClick={() => fetchNextPage()}>Fetch more data!</button>
      <TokenDataTable className="mt-8" infiniteData={infiniteData} />
    </>
  );
}
