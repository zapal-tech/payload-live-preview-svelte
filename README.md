# Payload Live Preview for Svelte

A Svelte 5 rewrite of the official
[`@payloadcms/live-preview-react`](https://www.npmjs.com/package/@payloadcms/live-preview-react) package, providing live preview
support for Payload CMS in Svelte 5 application.

<p style="padding:0.5rem 1rem;background:rgba(0,0,0,0.08)">
  This package is proudly built and maintained by <a href="https://zapal.tech?utm_source=github&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=banner" style="color:#ff2800">Zapal</a>.<br>
  We are a Ukrainian software development company committed to giving back to the open-source community.
</p>

## Installation

```sh
pnpm add @zapal/payload-live-preview-svelte
```

## Usage

This package exports two APIs:

- **`createLivePreview`** — a Svelte 5 reactive utility that subscribes to live data updates from the Payload editor.
- **`RefreshRouteOnSave`** — a renderless component that triggers a page refresh whenever a document is saved.

Both work with **any Svelte 5 application** — no SvelteKit required. When using SvelteKit, pass `() => invalidateAll()` as the
`refresh` prop for `RefreshRouteOnSave` (see [SvelteKit integration](#sveltekit-integration)).

### `createLivePreview`

```svelte
<script lang="ts">
  import { createLivePreview } from '@zapal/payload-live-preview-svelte'

  // Typically received from the server (load function, +page.svelte props, etc.)
  const { initialData, serverURL } = $props()

  const preview = createLivePreview(() => ({
    initialData,
    serverURL,
  }))
</script>

{#if preview.isLoading}
  <p>Loading...</p>
{:else}
  <h1>{preview.data.title}</h1>
{/if}
```

### `RefreshRouteOnSave`

```svelte
<script lang="ts">
  import { RefreshRouteOnSave } from '@zapal/payload-live-preview-svelte'

  // Provide any function that re-fetches page data
  const refresh = () => {
    /* re-fetch logic */
  }
</script>

<RefreshRouteOnSave serverURL="https://cms.zapal.tech" {refresh} />
```

## API

### `createLivePreview(getOptions)`

A Svelte 5 reactive utility (`.svelte.ts` rune-based function). Must be called inside a Svelte component or another reactive
context.

#### Parameters

| Parameter    | Type                          | Description                                                                                                                |
| ------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `getOptions` | `() => LivePreviewOptions<T>` | Getter function returning live preview options. Use a getter so that reactive props are tracked as `$effect` dependencies. |

#### `LivePreviewOptions<T>`

| Option           | Type                                 | Default | Description                                                                                      |
| ---------------- | ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| `serverURL`      | `string`                             | —       | **Required.** The URL of your Payload CMS server, e.g. `'https://cms.example.com'`.              |
| `initialData`    | `T`                                  | —       | **Required.** Initial data from the server. Prevents a flash of missing content on first render. |
| `apiRoute`       | `string`                             | —       | Optional custom API route used by Payload.                                                       |
| `depth`          | `number`                             | —       | Depth of population for related documents.                                                       |
| `requestHandler` | `CollectionPopulationRequestHandler` | —       | Custom handler to intercept and modify data fetching (e.g. routing through middleware).          |

#### Return value

| Property    | Type      | Description                                                                                   |
| ----------- | --------- | --------------------------------------------------------------------------------------------- |
| `data`      | `T`       | The live-updated document data. Starts as `initialData` and updates on each CMS save.         |
| `isLoading` | `boolean` | `true` until the first post-message update arrives. Use to avoid stale-data flicker on mount. |

### `RefreshRouteOnSave`

A renderless Svelte 5 component that listens for Payload editor save events and calls a `refresh` function. It sends a `ready`
message to the CMS on mount to initiate the live preview handshake.

#### Props

| Prop        | Type         | Default | Description                                                                                                                                             |
| ----------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serverURL` | `string`     | —       | **Required.** The URL of your Payload CMS server, e.g. `'https://cms.example.com'`.                                                                     |
| `refresh`   | `() => void` | —       | **Required.** Function called when a save event is received. In SvelteKit, use `() => invalidateAll()`. In other apps, pass any data re-fetch function. |
| `apiRoute`  | `string`     | —       | Optional custom API route used by Payload.                                                                                                              |
| `depth`     | `number`     | —       | Depth of population for related documents.                                                                                                              |

## SvelteKit integration

### `createLivePreview` in SvelteKit

Pass your server-loaded data as `initialData` and your Payload server URL. The `data` value updates reactively in the browser when
the Payload editor is open.

```svelte
<!-- src/routes/[slug]/+page.svelte -->
<script lang="ts">
  import { createLivePreview } from '@zapal/payload-live-preview-svelte'

  const { data: pageData } = $props()

  const preview = createLivePreview(() => ({
    initialData: pageData.page,
    serverURL: pageData.serverURL,
  }))
</script>

{#if preview.isLoading}
  <p>Loading...</p>
{:else}
  <h1>{preview.data.title}</h1>
{/if}
```

### `RefreshRouteOnSave` in SvelteKit

Use `invalidateAll()` from `$app/navigation` as the `refresh` callback so SvelteKit re-runs all active `load` functions whenever
the CMS saves a document.

```svelte
<!-- src/routes/[slug]/+page.svelte -->
<script lang="ts">
  import { RefreshRouteOnSave } from '@zapal/payload-live-preview-svelte'
  import { invalidateAll } from '$app/navigation'
</script>

<RefreshRouteOnSave serverURL="https://cms.zapal.tech" refresh={() => invalidateAll()} />
```

## Differences from `@payloadcms/live-preview-react`

### `createLivePreview` — API changes

| Difference       | React                    | Svelte                                                                                                     |
| ---------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Call signature   | `useLivePreview(props)`  | `createLivePreview(getOptions)` — accepts a **getter function** so reactive props are tracked by `$effect` |
| Return value     | `{ data, isLoading }`    | Same shape (`LivePreviewState<T>`), but values are Svelte 5 reactive (backed by `$state`)                  |
| Internal state   | `useState` / `useEffect` | `$state` / `$effect` runes                                                                                 |
| `ready()` timing | Called once per mount    | Called once per mount (same behavior)                                                                      |

### `RefreshRouteOnSave` — API changes

| Difference    | React                               | Svelte                         |
| ------------- | ----------------------------------- | ------------------------------ |
| Export type   | React functional component (`.tsx`) | Svelte 5 component (`.svelte`) |
| Internal refs | `useRef` for `hasSentReadyMessage`  | Plain `let` variable           |
| Event binding | `useEffect` + `useCallback`         | `$effect` rune                 |

<br/><hr/><br/>

## About Zapal

We are a Ukrainian IT outsourcing and software development company. We believe in giving back to the community, which is why we
open-source the tools we build and use daily to ship high-quality software.

If this package helped you save time, imagine what our dedicated team could do for your product. Whether you need help with
complex custom integrations, building an app from scratch, or expanding your engineering capacity, we are open for business.

- **[Explore our work](https://zapal.tech/projects?utm_source=github&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=about-zapal)**
- **[Hire us for your next project](https://zapal.tech/contacts?utm_source=github&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=about-zapal)**

## Stand with Ukraine 🇺🇦

Zapal is a Ukrainian company. russia's war against our country began in 2014, and since February 2022, our country has been
defending itself against a brutal, unprovoked full-scale invasion by Russia.

We are fighting an existential war against what was once called the "second army in the world." The odds are incredibly
disproportionate, yet Ukraine stands.

While our cities face relentless missile strikes and attacks, our people refuse to break. Our developers continue to write code;
sometimes from bomb shelters, sometimes running on generators, and still we continue to deliver.

But **the only reason** we are alive, working, and able to contribute to the open-source community is the unimaginable daily
heroism of the Ukrainian Armed Forces.

If you use our software, please consider supporting the defenders who make our work possible. Every donation helps balance the
scales and save lives:

If you find this package useful, we ask that you consider supporting the defenders who make our work possible. Every donation
helps balance the scales and save lives:

- **[Come Back Alive](https://savelife.in.ua/en/)** - The largest foundation providing vital tactical equipment, armor, and
  technology to defenders.
- **[Sternenko Fund](https://sternenkofund.org/en/)** - A highly effective initiative focused on supplying FPV drones and
  reconnaissance UAVs directly to front-line units.
- **[United24](https://u24.gov.ua/)** - The official fundraising platform of Ukraine, allowing you to donate directly to Defense,
  Medical Aid, or Rebuilding efforts.
- **[Learn more about how you can help](https://zapal.tech/support-ukraine?utm_source=github&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=stand-with-ukraine)**
