import TokensWithFilterBar from "./components/tokens-with-filter-bar";
import getTokensFromCollection from "./query/getTokensFromCollection";
import { searchParamsCache } from "./search-params";

interface HomePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { sortDirection } = searchParamsCache.parse(searchParams);

  const data = await getTokensFromCollection({
    collection: "0xed5af388653567af2f388e6224dc7c4b3241c544",
    sortDirection,
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col p-10">
      <h1 className="font-sans text-2xl">
        NFT Table SSR + Infinite Scroll + Filters + State in query params
      </h1>
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-muted-foreground">✅ SSR (with query params)</p>
        <p className="text-muted-foreground">✅ Sort</p>
        <p className="text-muted-foreground">✅ Sort State in query params</p>
        <p className="text-muted-foreground">✅ Infinite query</p>
        <p className="text-muted-foreground">✅ Infinite Scroll</p>
        <p className="text-muted-foreground">✅ Virtualized Table</p>
        <p className="text-muted-foreground">
          ❌ Scroll to the top of the page when sorting changes
        </p>
        <p className="text-muted-foreground">❌ react-table</p>
      </div>

      <TokensWithFilterBar initialData={data} />
    </main>
  );
}
