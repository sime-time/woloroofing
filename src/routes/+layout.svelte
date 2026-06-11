<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "../app.css";
  import "@fontsource-variable/libre-franklin/wght.css";
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

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://woloroofing.com/">
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content="https://woloroofing.com/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content="https://woloroofing.com/og-image.jpg">
</svelte:head>

{@render children()}
