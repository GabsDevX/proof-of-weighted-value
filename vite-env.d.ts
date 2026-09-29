/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POWV_GATEWAY_URL?: string;
  readonly VITE_POWV_AUDIT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

