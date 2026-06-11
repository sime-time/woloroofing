<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import "../app.css";
  import "@fontsource-variable/libre-franklin/wght.css";
  import "@fontsource/barlow-condensed/400.css";
  import "@fontsource/barlow-condensed/500.css";
  import "@fontsource/barlow-condensed/600.css";
  import "@fontsource/barlow-condensed/800.css";

  let { children } = $props();

  const title =
    "WOLO Roofing & Exteriors | Roofing, Storm Damage & Insurance Claims in Central Indiana";
  const description =
    "WOLO Roofing & Exteriors provides residential and commercial roofing, storm damage restoration, insurance claim assistance, siding, gutters, and exterior repairs across Central Indiana.";
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
  <title>{title}</title>
  <meta name="description" content={description}>
</svelte:head>

{@render children()}
