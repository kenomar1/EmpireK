// src/lib/sanityClient.ts
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const clientConfig = {
  projectId: "70a0b1g2",
  dataset: "posts",
  apiVersion: "2025-01-01",
  useCdn: true,
};

export const client = createClient({
  ...clientConfig,
  // HARDCODED TOKEN — FOR DEBUGGING ONLY!
  token:
    "skFVcSUIZ2sMzLjXNb82HvMLQASE00w56CvxjZT00vmathmWjOLP1YksV4LIK04ConbLUOFa380sJIwowgirNRG2JmFpfo6wKECGTmVk3udmWs3TpYAiwltUxjstDsjEzSEGnyrNLAoscu5holyFN5R62hBys8eHkMtauds2RIxp3FsoPXYS",
  ignoreBrowserTokenWarning: true,
});

// Image URL builder
const builder = createImageUrlBuilder({
  projectId: clientConfig.projectId,
  dataset: clientConfig.dataset,
});

export const urlFor = (source: any) => builder.image(source);