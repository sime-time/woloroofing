<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "../app.css";
  import "@fontsource-variable/libre-franklin/wght.css";
  import "@fontsource/barlow-condensed/400.css";
  import "@fontsource/barlow-condensed/500.css";
  import "@fontsource/barlow-condensed/600.css";
  import "@fontsource/barlow-condensed/800.css";

  let { children } = $props();
</script>

<svelte:head> <link rel="icon" href={favicon}> </svelte:head>

{@render children()}
