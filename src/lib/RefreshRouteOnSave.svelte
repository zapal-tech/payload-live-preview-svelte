<script lang="ts">
  import { isDocumentEvent, ready } from '@payloadcms/live-preview'

  import type { RefreshRouteOnSaveProps } from './types'

  // apiRoute and depth are accepted as props for API parity but are not used
  // by this component's logic directly (they apply to useLivePreview).
  const { refresh, serverURL }: RefreshRouteOnSaveProps = $props()

  let hasSentReadyMessage = false

  $effect(() => {
    function onMessage(event: MessageEvent) {
      if (isDocumentEvent(event, serverURL)) refresh()
    }

    window.addEventListener('message', onMessage)

    if (!hasSentReadyMessage) {
      hasSentReadyMessage = true

      ready({ serverURL })

      // Refresh after the ready message so the latest saved data is fetched immediately.
      refresh()
    }

    return () => {
      window.removeEventListener('message', onMessage)
    }
  })
</script>
