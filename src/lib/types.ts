import type { CollectionPopulationRequestHandler } from '@payloadcms/live-preview'

export type { CollectionPopulationRequestHandler }

export type RefreshRouteOnSaveProps = {
  /** Optional custom API route used by Payload. */
  apiRoute?: string
  /** Depth of population for related documents. */
  depth?: number
  /**
   * Function called to refresh the current route or page when a save event is received from the CMS.
   *
   * In SvelteKit, pass `() => invalidateAll()` from `$app/navigation`.
   * In other Svelte apps, pass any function that re-fetches and updates page data.
   */
  refresh: () => void
  /** The URL of your Payload CMS server, e.g. `'https://cms.zapal.tech'`. */
  serverURL: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LivePreviewOptions<T extends Record<string, any>> = {
  /** Optional custom API route used by Payload. */
  apiRoute?: string
  /** Depth of population for related documents. */
  depth?: number
  /**
   * Initial data from the server to prevent a flash of missing content on first render.
   * Pass your SSR/SSG fetched data here.
   */
  initialData: T
  /**
   * Custom handler to intercept and modify data fetching.
   * Useful for routing requests through middleware or applying transformations.
   */
  requestHandler?: CollectionPopulationRequestHandler
  /** The URL of your Payload CMS server, e.g. `'https://cms.zapal.tech'`. */
  serverURL: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LivePreviewState<T extends Record<string, any>> = {
  /** The live-updated document data. Starts as `initialData` and updates on each CMS save. */
  data: T
  /**
   * `true` until the first post-message update is received.
   * Use this to conditionally show a loading indicator and avoid stale-data flicker.
   */
  isLoading: boolean
}
