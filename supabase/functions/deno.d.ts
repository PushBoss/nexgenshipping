/// <reference types="https://deno.land/types/index.d.ts" />

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

