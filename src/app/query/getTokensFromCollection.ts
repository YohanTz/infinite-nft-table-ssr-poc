const baseUrl = "https://api-mainnet.magiceden.io/v3/rtp/ethereum/tokens/v7";

export interface MagicEdenCollectionResponse {
  continuation: string;
  tokens: Array<{
    token: { chainId: number; contract: string; name: string; tokenId: string };
    media: { image: string };
  }>;
}

export default async function getTokensFromCollection({
  nextCursor,
  collection,
}: {
  nextCursor?: string;
  collection: string;
}) {
  const queryParams = [`collection=${collection}`];

  if (nextCursor) {
    queryParams.push(`continuation=${nextCursor}`);
  }

  const response = await fetch(`${baseUrl}?${queryParams.join("&")}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  //   return undefined;
  return response.json() as Promise<MagicEdenCollectionResponse>;
}
