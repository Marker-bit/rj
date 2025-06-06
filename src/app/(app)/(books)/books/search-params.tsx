import { parseAsString, createLoader } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  sort: parseAsString.withDefault("percent"),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
