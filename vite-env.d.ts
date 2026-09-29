/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the deliberately exposed, read-only edge status service. */
  readonly VITE_POWV_GATEWAY_URL?: string;
  /** Base URL of the deliberately exposed, read-only audit status service. */
  readonly VITE_POWV_AUDIT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
