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

const tableHeaders = [
  { name: "Item" },
  { name: "Current Price" },
  { name: "Last Sold" },
  { name: "Floor difference" },
  { name: "Owner" },
  { name: "Time listed" },
];

interface TokenDataTableProps {
  infiniteData?: { pages: Array<MagicEdenCollectionResponse> };
}

export default function TokenDataTable({
  className,
  infiniteData,
}: PropsWithClassName<TokenDataTableProps>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((tableHeader) => {
              return (
                <TableHead key={tableHeader.name}>{tableHeader.name}</TableHead>
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
                      <TableCell>{token.token.name}</TableCell>
                      <TableCell>0.00$</TableCell>
                      <TableCell>0.0025 ETH</TableCell>
                      <TableCell>+0.02%</TableCell>
                      <TableCell>kwiss.stark</TableCell>
                      <TableCell>1min ago</TableCell>
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
