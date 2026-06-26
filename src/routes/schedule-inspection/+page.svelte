<script lang="ts">
  import Navbar from "$lib/components/navbar.svelte";
  import { CAL_COM_LINK } from "$lib/contact-info";
</script>

<svelte:head>
  <title>Schedule Your Free Roof Inspection | Wolo Roofing</title>
  <meta
    name="description"
    content="Schedule a free roof inspection with Wolo Roofing in Central Indiana."
  >
</svelte:head>

<Navbar />

<main class="schedule-page min-h-screen pt-22">
  <iframe
    src={CAL_COM_LINK}
    title="Schedule a free roof inspection with Wolo Roofing"
    class="h-[calc(100vh-5.5rem)] w-full border-0"
  ></iframe>
</main>

<style>
  :global(:root) {
    --cal-page-bg: #ffffff;
  }

  :global(body) {
    background: var(--cal-page-bg);
  }

  :global(header) {
    background: var(--cal-page-bg) !important;
    box-shadow: none !important;
  }

  .schedule-page {
    background: var(--cal-page-bg);
  }

  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --cal-page-bg: #111111;
    }
  }
</style>
