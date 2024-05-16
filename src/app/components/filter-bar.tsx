import { Button } from "~/components/ui/button";
import { type sortDirections } from "../query/getTokensFromCollection";
import { cn, type PropsWithClassName } from "~/lib/utils";

interface FiltersBarProps {
  sortDirection: (typeof sortDirections)[number];
  setSortDirection: (arg0: (typeof sortDirections)[number]) => void;
}

export default function FiltersBar({
  className,
  sortDirection,
  setSortDirection,
}: PropsWithClassName<FiltersBarProps>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={() => setSortDirection("asc")}
        disabled={sortDirection === "asc"}
      >
        Sort ascending
      </Button>
      <Button
        onClick={() => setSortDirection("desc")}
        disabled={sortDirection === "desc"}
      >
        Sort descending
      </Button>
    </div>
  );
}
