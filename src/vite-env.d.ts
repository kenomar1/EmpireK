/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_COMMENTS_WRITE_TOKEN: string;
  // Add any other VITE_ variables here if you have more
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
