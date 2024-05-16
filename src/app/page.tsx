import TokensWithFilterBar from "./components/tokens-with-filter-bar";
import getTokensFromCollection from "./query/getTokensFromCollection";

export default async function HomePage() {
  const data = await getTokensFromCollection({
    collection: "0xed5af388653567af2f388e6224dc7c4b3241c544",
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col p-10">
      <h1 className="font-sans text-xl">
        NFT Table SSR + Infinite Scroll + Filters + State in query params
      </h1>
      <div className="mt-4 flex flex-col gap-2">
        <p>✅ SSR</p>
        <p>❌ Infinite Scroll</p>
        <p>❌ Filters</p>
        <p>❌ State in query params</p>
      </div>

      <TokensWithFilterBar initialData={data} />
    </main>
  );
}
