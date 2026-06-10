<script lang="ts">
  import Icon from "@iconify/svelte";
  import { WOLOPHONE } from "$lib/constants";

  const benefits = [
    "Free Inspections",
    "Insurance Claims",
    "10-Yr Workmanship Warranty",
  ];
</script>

<section
  id="hero"
  class="hero relative min-h-screen overflow-hidden bg-neutral"
  style="background-image: url(/restoration-after.webp);"
>
  <div class="hero-overlay bg-linear-to-r from-neutral to-transparent"></div>
  <div
    class="hero-conent text-neutral-content text-start w-full px-6 md:max-w-7xl mx-auto"
  >
    <div class="flex flex-col gap-5 w-full justify-start">
      <!-- Label -->
      <div class="flex items-center gap-4">
        <span class="h-px w-8 bg-accent"></span>
        <p class="label text-xs sm:text-sm text-accent">
          Locally Owned · Central Indiana
        </p>
      </div>

      <!-- Heading -->
      <h1 class="uppercase text-5xl md:text-7xl w-full xl:max-w-1/2">
        Roofing &amp; Exterior <br>Restoration Done<br>
        <span class="text-accent">The Right Way.</span>
      </h1>

      <!-- Subheading -->
      <p
        class="text-neutral-content/90 text-base leading-7 md:leading-8 md:text-lg md:max-w-2/3 lg:max-w-1/2 font-light"
      >
        Residential &amp; commercial roofing, storm damage restoration, and full
        insurance claim assistance, from inspection through completion. Backed
        by our
        <span class="font-semibold text-neutral-content">
          10-year workmanship warranty.
        </span>
      </p>

      <!-- Buttons -->
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <button
          type="button"
          class="btn btn-primary btn-lg uppercase border-2 py-7 w-full md:w-fit"
        >
          Get a free inspection <Icon icon="lucide:arrow-right" />
        </button>
        <a
          class="btn btn-lg py-7 btn-outline border-2 border-base-100/50 text-primary-content  hover:text-accent hover:border-accent hover:bg-transparent w-full md:w-fit"
          href="#phone"
        >
          <Icon icon="lucide:phone" />

          {WOLOPHONE}</a
        >
      </div>

      <!-- Benefits -->
      <ul class="mt-5 flex gap-5 md:max-w-2/3 flex-wrap">
        {#each benefits as benefit}
          <li class="flex items-center gap-2 text-sm text-base-100/70">
            <Icon icon="lucide:check" class="text-accent size-4" />{benefit}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
