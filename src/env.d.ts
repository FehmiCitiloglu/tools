/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Google AdSense publisher ID (e.g. `ca-pub-XXXXXXXXXXXXXXXX`). When empty, ads are disabled. */
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  /** AdSense slot ID for the in-article unit on tool pages. */
  readonly PUBLIC_ADSENSE_SLOT_TOOL_INARTICLE?: string;
  /** AdSense slot ID for the footer unit on tool pages. */
  readonly PUBLIC_ADSENSE_SLOT_TOOL_FOOTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
