const baseUrl = "https://api-mainnet.magiceden.io/v3/rtp/ethereum/tokens/v7";

export interface MagicEdenCollectionResponse {
  continuation: string;
  tokens: Array<{
    token: {
      chainId: number;
      contract: string;
      name: string;
      tokenId: string;
      owner: string;
    };
    media: { image: string };
    market: {
      floorAsk: {
        price?: { amount: { decimal: number }; currency: { symbol: string } };
      };
    };
  }>;
}

export const sortDirections = ["asc", "desc"] as const;

export default async function getTokensFromCollection({
  nextCursor,
  collection,
  sortDirection,
}: {
  nextCursor?: string;
  collection: string;
  sortDirection: (typeof sortDirections)[number];
}) {
  const queryParams = [
    `collection=${collection}`,
    `sortDirection=${sortDirection}`,
  ];

  if (nextCursor) {
    queryParams.push(`continuation=${nextCursor}`);
  }

  const response = await fetch(`${baseUrl}?${queryParams.join("&")}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json() as Promise<MagicEdenCollectionResponse>;
}
