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
import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
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

  const columns = useMemo<
    ColumnDef<MagicEdenCollectionResponse["tokens"][number]>[]
  >(
    () => [
      {
        accessorKey: "token",
        header: "Item",
        cell: ({ row: { original } }) => {
          return <div>OUI</div>;
        },
        size: 60,
      },
      {
        accessorKey: "token",
        header: "Current Price",
        // cell: (info) => info.getValue(),
        cell: () => {
          return <div>OUI</div>;
        },
      },
      {
        accessorKey: "token",
        header: "Last Sold",

        cell: () => {
          return <div>OUI</div>;
        },
      },
      {
        accessorKey: "token",
        header: "Floor difference",
        cell: () => {
          return <div>OUI</div>;
        },
      },
      {
        accessorKey: "token",
        header: "Owner",
        cell: () => {
          return <div>OUI</div>;
        },
      },
      {
        accessorKey: "token",
        header: "Time listed",
        cell: () => {
          return <div>OUI</div>;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tokensData,
    columns,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

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

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
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
    <div className={cn("rounded-md border", className)}>
      <Table
        className="grid h-[28rem] w-full"
        ref={tableContainerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      >
        <TableHeader className="sticky top-0 z-10 grid">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="flex bg-background"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody
          className="relative grid"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, // Tells scrollbar how big the table is
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (row === undefined) {
              return null;
            }

            return (
              <TableRow
                key={row.id}
                data-index={virtualRow.index} // Needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} // Measure dynamic row height
                className="absolute flex w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="flex"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
                {/* <TableCell>
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
                <TableCell>Unknown</TableCell> */}
              </TableRow>
            );
          })}
          {/* {tokensData.map((token) => {
            return (
              <TableRow key={token.media.image}>
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
          })} */}
        </TableBody>
      </Table>
    </div>
  );
}
