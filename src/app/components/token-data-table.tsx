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
import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { elementScroll, useVirtualizer } from "@tanstack/react-virtual";

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
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // Once the user has scrolled within 750px of the bottom of the table, fetch more data if possible
        if (
          scrollHeight - scrollTop - clientHeight < 750 &&
          !isFetchingNextPage &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  // A check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const rowVirtualizer = useVirtualizer({
    // Approcimage initial rect for SSR
    initialRect: { height: 1000, width: 1200 },
    count: tokensData.length,
    estimateSize: () => 75, // Estimation of row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
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
      <Table
        className="flex-[1_1_0]"
        ref={tableContainerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      >
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
