<script lang="ts">
  import { RefreshRouteOnSave } from '$lib'

  let refreshCount = $state(0)
  const refresh = () => refreshCount++

  // In a real app, replace this with `() => invalidateAll()` from `$app/navigation` (SvelteKit)
  // or any function that re-fetches and updates your page data.
</script>

<RefreshRouteOnSave serverURL="http://localhost:3000" {refresh} />

<main
  style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:760px;margin:80px auto;padding:0 1.5rem;line-height:1.6;color:#111"
>
  <h1 style="font-size:2rem;margin-bottom:0.25rem">payload-live-preview-svelte</h1>
  <p style="color:#555;margin-top:0">
    A Payload CMS Live Preview package for Svelte 5, built by <a
      href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=banner"
      style="color:#ff2800;font-weight:700">Zapal</a
    >.
  </p>

  <hr style="border:none;border-top:1px solid #e0e0e0;margin:2rem 0" />

  <section>
    <h2 style="font-size:1.25rem">About Zapal</h2>
    <p>
      <a
        href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=about-zapal-company-name"
        style="color:#931200">Zapal</a
      > is a software development company focused on building modern web applications and open-source developer tooling. We create high-quality
      solutions using cutting-edge technologies like Svelte, SvelteKit, and Payload CMS.
    </p>
    <p>
      Reach us at <a href="mailto:hello@zapal.tech" style="color:#931200">hello@zapal.tech</a> or visit our website at
      <a
        href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=about-zapal-website-link"
        style="color:#931200">zapal.tech</a
      >.
    </p>
  </section>

  <section style="margin-top:2rem">
    <h2 style="font-size:1.25rem">RefreshRouteOnSave preview</h2>
    <p>
      A <code>RefreshRouteOnSave</code> component is mounted on this page and connected to
      <code>http://localhost:3000</code>. It calls the <code>refresh</code> callback whenever a document is saved in the Payload CMS
      editor.
    </p>
    <p>
      Refresh count (increments on each CMS save): <strong>{refreshCount}</strong>
    </p>
  </section>

  <section style="margin-top:2rem">
    <h2 style="font-size:1.25rem">Quick start</h2>
    <pre style="background:#f4f4f4;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.875rem"><code
        >npm install @zapal/payload-live-preview-svelte</code
      ></pre>

    <h3 style="font-size:1rem;margin-top:1.5rem">createLivePreview</h3>
    <pre style="background:#f4f4f4;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.875rem"><code
        >&lt;script lang="ts"&gt;
  import &#123; createLivePreview &#125; from '@zapal/payload-live-preview-svelte'

  const &#123; initialData, serverURL &#125; = $props()

  const preview = createLivePreview(() => (&#123;
    initialData,
    serverURL,
  &#125;))
&lt;/script&gt;

&#123;#if preview.isLoading&#125;
  &lt;p&gt;Loading...&lt;/p&gt;
&#123;:else&#125;
  &lt;h1&gt;&#123;preview.data.title&#125;&lt;/h1&gt;
&#123;/if&#125;</code
      ></pre>

    <h3 style="font-size:1rem;margin-top:1.5rem">RefreshRouteOnSave (SvelteKit)</h3>
    <pre style="background:#f4f4f4;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.875rem"><code
        >&lt;script lang="ts"&gt;
  import &#123; invalidateAll &#125; from '$app/navigation'
  import &#123; RefreshRouteOnSave &#125; from '@zapal/payload-live-preview-svelte'
&lt;/script&gt;

&lt;RefreshRouteOnSave
  serverURL="https://cms.zapal.tech"
  refresh=&#123;() => invalidateAll()&#125;
/&gt;</code
      ></pre>
  </section>

  <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #e0e0e0;font-size:0.875rem;color:#777">
    <p>
      <a href="https://github.com/zapal-tech/payload-live-preview-svelte" style="color:#931200">GitHub</a>
      &nbsp;·&nbsp;
      <a href="https://www.npmjs.com/package/@zapal/payload-live-preview-svelte" style="color:#931200">npm</a>
      &nbsp;·&nbsp;
      <a
        href="https://zapal.tech?utm_source=demo&utm_medium=referral&utm_campaign=payload-live-preview-svelte&utm_content=footer"
        style="color:#931200">zapal.tech</a
      >
    </p>
  </footer>
</main>
