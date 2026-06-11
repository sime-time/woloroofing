<script lang="ts">
  import Icon from "@iconify/svelte";

  const locations = [
    "Indianapolis",
    "Carmel",
    "Fishers",
    "Noblesville",
    "Westfield",
    "Brownburg",
    "Greenwood",
    "Avon",
  ];
</script>

<section
  id="area"
  class="flex w-full items-center justify-center bg-neutral py-30"
>
  <div
    class="relative z-10 grid w-full max-w-7xl min-w-0 gap-12 px-6 lg:grid-cols-2 lg:items-center"
  >
    <div class="flex min-w-0 flex-col gap-6">
      <p class="label text-accent text-xs sm:text-sm">
        <Icon icon="lucide:map" class="mr-2 shrink-0" />
        Where We Work
      </p>

      <h2 class="uppercase text-base-100 text-4xl md:text-6xl">
        Proudly Serving Central Indiana
      </h2>

      <p class="text-base-100/70">
        WOLO Roofing &amp; Exteriors serves Indianapolis and the surrounding
        communities. If you're in Central Indiana and need roofing or exterior
        work, we're ready to help.
      </p>

      <ul class="grid min-w-0 gap-3 grid-cols-2 md:grid-cols-3">
        {#each locations as location}
          <li
            class="flex gap-2 text-base-200 text-sm items-center border border-base-300/15 rounded p-3 bg-base-300/5"
          >
            <Icon icon="lucide:map-pin" class="size-4 shrink-0 text-accent" />
            {location}
          </li>
        {/each}
      </ul>
    </div>

    <div
      class="overflow-hidden rounded-lg aspect-4/3 w-full border border-white/10"
    >
      <iframe
        src="https://www.google.com/maps?q=Indianapolis,Indiana&output=embed"
        width="100%"
        height="100%"
        style="border:0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="WOLO Roofing service area in Central Indiana"
      ></iframe>
    </div>
  </div>
</section>
