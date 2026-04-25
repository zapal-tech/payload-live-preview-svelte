import { ready, subscribe, unsubscribe } from '@payloadcms/live-preview'

import type { LivePreviewOptions, LivePreviewState } from './types'

/**
 * A Svelte 5 reactive utility to implement [Payload Live Preview](https://payloadcms.com/docs/live-preview/frontend).
 *
 * Pass a getter function returning your options so that reactive props (from `$props()` or `$state()`)
 * are tracked as dependencies inside `$effect` and the subscription is re-established when they change.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { createLivePreview } from '@zapal/payload-live-preview-svelte'
 *
 *   const { initialData, serverURL } = $props()
 *
 *   const preview = createLivePreview(() => ({
 *     initialData,
 *     serverURL,
 *   }))
 * </script>
 * ```
 *
 * @link https://payloadcms.com/docs/live-preview/frontend
 */
export function createLivePreview<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>(getOptions: () => LivePreviewOptions<T>): LivePreviewState<T> {
  let data = $state<T>(getOptions().initialData)
  let isLoading = $state(true)

  $effect(() => {
    const { apiRoute, depth, initialData, requestHandler, serverURL } = getOptions()

    const subscription = subscribe({
      apiRoute,
      callback: (mergedData: T) => {
        data = mergedData
        isLoading = false
      },
      depth,
      initialData,
      requestHandler,
      serverURL,
    })

    ready({ serverURL })

    return () => {
      unsubscribe(subscription)
    }
  })

  return {
    get data() {
      return data
    },
    get isLoading() {
      return isLoading
    },
  }
}
