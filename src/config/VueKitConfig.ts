import type { AuthConfig } from "../contracts/auth";
import type { HttpHandlers } from "../contracts/http";

export interface VueKitConfig {
  api: {
    baseURL: string;
    timeout?: number;
    auth?: AuthConfig;
    handlers?: HttpHandlers;
  };

  modules?: {
    /** Base path where generated modules are placed. Defaults to "src/modules". */
    path?: string;
  };

  cli?: {
    /** Custom stubs directory. Defaults to ".devapps/stubs" in the consuming project. */
    stubsPath?: string;
  };
}
