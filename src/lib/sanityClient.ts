// src/lib/sanityClient.ts
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url"; // ← Updated import
export const client = createClient({
  projectId: "70a0b1g2", // ← Your actual project ID
  dataset: "posts", // ← Your dataset name
  apiVersion: "2025-01-01", // Use today's date
  useCdn: true, // `false` if you want fresh data in dev
});

const builder = createImageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
