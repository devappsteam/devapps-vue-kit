export interface HttpHandlers {
  /**
   * Called when the API responds with 401 Unauthorized. The package never
   * redirects automatically — the consuming application decides what to do.
   */
  onUnauthorized?: () => void;
}
