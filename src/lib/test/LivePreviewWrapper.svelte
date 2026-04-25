<script lang="ts">
  import { createLivePreview } from '../livePreview.svelte.ts'
  import type { LivePreviewOptions } from '../types'

  type Props = Pick<LivePreviewOptions<Record<string, unknown>>, 'apiRoute' | 'depth' | 'initialData' | 'serverURL'>

  const { apiRoute, depth, initialData, serverURL }: Props = $props()

  const preview = createLivePreview(() => ({ apiRoute, depth, initialData, serverURL }))
</script>

<span data-testid="is-loading">{preview.isLoading}</span>
<pre data-testid="data">{JSON.stringify(preview.data)}</pre>
