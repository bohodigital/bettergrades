export * from "./schema";
export * from "./catalog";
export * from "./practice";
export * from "./routing";
export * from "./validate";

import { validateRegistry } from "./validate";

export const registryValidationErrors = validateRegistry();
if (registryValidationErrors.length) {
  throw new Error(`Content registry validation failed: ${registryValidationErrors.join("; ")}`);
}
