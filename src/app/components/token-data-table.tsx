"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn, type PropsWithClassName } from "~/lib/utils";
import { type MagicEdenCollectionResponse } from "../query/getTokensFromCollection";
import { useCallback, useEffect } from "react";
import Image from "next/image";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

const tableHeaders = [
  { name: "Item" },
  { name: "Current Price" },
  { name: "Last Sold" },
  { name: "Floor difference" },
  { name: "Owner" },
  { name: "Time listed" },
];

interface TokenDataTableProps {
  tokensData: MagicEdenCollectionResponse["tokens"];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

// TODO: Component per type of cell
export default function TokenDataTable({
  className,
  tokensData,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: PropsWithClassName<TokenDataTableProps>) {
  const fetchMoreOnBottomReached = useCallback(() => {
    if (document.body) {
      const { scrollHeight } = window.document.body;
      // Once the user has scrolled within 500px of the bottom of the window, fetch more data if possible
      if (
        scrollHeight - window.scrollY - window.innerHeight < 750 &&
        !isFetchingNextPage &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // A check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached();

    window.addEventListener("scroll", fetchMoreOnBottomReached);
    return () => {
      window.removeEventListener("scroll", fetchMoreOnBottomReached);
    };
  }, [fetchMoreOnBottomReached]);

  const rowVirtualizer = useWindowVirtualizer({
    // Approcimage initial rect for SSR
    initialRect: { height: 1080, width: 1920 },
    count: tokensData.length,
    estimateSize: () => 75, // Estimation of row height for accurate scrollbar dragging
    // Measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <div className={cn("flex flex-1 flex-col rounded-md border", className)}>
      <Table>
        <TableHeader>
          {/* TODO: MIN / MAX ON GRID COLS WIDTH */}
          <TableRow className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center">
            {tableHeaders.map((tableHeader) => {
              return (
                <TableHead
                  key={tableHeader.name}
                  className="sticky top-0 z-10 flex items-center bg-background"
                >
                  {tableHeader.name}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody
          className="relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, // Tells scrollbar how big the table is
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const token = tokensData[virtualRow.index];
            if (token === undefined) {
              return null;
            }

            return (
              <TableRow
                key={token.media.image}
                data-index={virtualRow.index} // Needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} // Measure dynamic row height
                className="absolute grid w-full grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={token.media.image}
                      height={42}
                      width={42}
                      alt={token.token.name}
                      className="rounded-md"
                    />
                    <p>{token.token.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {token.market.floorAsk.price?.amount.decimal ?? "Not Listed"}{" "}
                  {token.market.floorAsk.price?.currency.symbol}
                </TableCell>
                <TableCell>Unknown</TableCell>
                <TableCell>Unknown</TableCell>
                <TableCell>{token.token.owner.slice(0, 6)}...</TableCell>
                <TableCell>Unknown</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
