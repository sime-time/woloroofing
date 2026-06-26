<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import "../app.css";
  import "@fontsource-variable/libre-franklin/wght.css";
  import "@fontsource/barlow-condensed/600.css";
  import "@fontsource/barlow-condensed/800.css";

  let { children } = $props();

  const defaultMeta = {
    title:
      "WOLO Roofing & Exteriors | Roofing, Storm Damage & Insurance Claims in Central Indiana",
    description:
      "WOLO Roofing & Exteriors provides residential and commercial roofing, storm damage restoration, insurance claim assistance, siding, gutters, and exterior repairs across Central Indiana.",
    url: "https://woloroofing.com/",
  };

  const scheduleInspectionMeta = {
    title: "Schedule Your Free Roof Inspection | Wolo Roofing",
    description:
      "Schedule a free roof inspection with Wolo Roofing in Central Indiana.",
    url: "https://woloroofing.com/schedule-inspection",
  };

  const landingMeta = {
    title: "Storm Damage? Get a Free Roof Inspection | Wolo Roofing",
    description:
      "Contact Wolo Roofing after storm, hail, or wind damage. Get a free roof inspection and fast follow-up from a Wolo Roofing agent.",
    url: "https://woloroofing.com/landing",
  };

  const meta = $derived(
    page.url.pathname === "/schedule-inspection"
      ? scheduleInspectionMeta
      : page.url.pathname === "/landing"
        ? landingMeta
        : defaultMeta,
  );
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description}>

  <meta property="og:type" content="website">
  <meta property="og:url" content={meta.url}>
  <meta property="og:title" content={meta.title}>
  <meta property="og:description" content={meta.description}>
  <meta property="og:image" content="https://woloroofing.com/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={meta.title}>
  <meta name="twitter:description" content={meta.description}>
  <meta name="twitter:image" content="https://woloroofing.com/og-image.jpg">
</svelte:head>

{@render children()}
