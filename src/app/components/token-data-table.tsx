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
import { Fragment } from "react";
import Image from "next/image";
import { type InfiniteData } from "@tanstack/react-query";

const tableHeaders = [
  { name: "Item" },
  { name: "Current Price" },
  { name: "Last Sold" },
  { name: "Floor difference" },
  { name: "Owner" },
  { name: "Time listed" },
];

interface TokenDataTableProps {
  infiniteData: InfiniteData<MagicEdenCollectionResponse>;
}

// TODO: Component per type of cell
export default function TokenDataTable({
  className,
  infiniteData,
}: PropsWithClassName<TokenDataTableProps>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table className="h-[30rem]">
        <TableHeader>
          <TableRow>
            {tableHeaders.map((tableHeader) => {
              return (
                <TableHead
                  key={tableHeader.name}
                  className="sticky top-0 bg-background"
                >
                  {tableHeader.name}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {infiniteData?.pages.map((page, index) => {
            return (
              <Fragment key={`page-${index}`}>
                {page.tokens.map((token) => {
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
                        {token.market.floorAsk.price?.amount.decimal ??
                          "Not Listed"}{" "}
                        {token.market.floorAsk.price?.currency.symbol}
                      </TableCell>
                      <TableCell>Unknown</TableCell>
                      <TableCell>Unknown</TableCell>
                      <TableCell>{token.token.owner.slice(0, 6)}...</TableCell>
                      <TableCell>Unknown</TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            );
          })}
          <TableRow></TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
