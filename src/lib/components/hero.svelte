<script lang="ts">
  import Icon from "@iconify/svelte";
  import { WOLOPHONE, WOLOPHONE_HREF } from "$lib/contact-info";
  import LandingForm from "./landing-form.svelte";

  const benefits = [
    "Free Inspections",
    "Insurance Claims",
    "10-Yr Workmanship Warranty",
  ];
</script>

<section
  id="hero"
  class="hero relative min-h-screen overflow-hidden bg-neutral"
>
  <!-- Image + Overlay -->
  <enhanced:img
    src="$lib/assets/images/hero-home.webp"
    alt="House with fully restored roof"
    class="absolute inset-0 h-full w-full object-cover"
    sizes="100vw"
    fetchpriority="high"
    loading="eager"
    decoding="async"
  />
  <div
    class="absolute inset-0 z-10 bg-linear-to-r from-neutral/95 to-neutral/65"
  ></div>

  <div
    class="hero-content text-neutral-content text-start w-full px-6 pt-28 md:max-w-7xl mx-auto z-30 grid grid-cols-1 lg:grid-cols-5 gap-0"
  >
    <div class="flex flex-col gap-4 w-full justify-start col-span-3 mb-4">
      <!-- Label -->
      <div class="hidden lg:flex items-center gap-4">
        <span class="h-px w-8 bg-accent"></span>
        <p class="label text-xs sm:text-sm text-accent">
          Locally Owned · Central Indiana
        </p>
      </div>

      <!-- Heading -->
      <h1 class="uppercase text-5xl md:text-7xl w-full">
        Roof took a hit?<br>
        <span class="text-accent">Get a Free Inspection</span>
      </h1>

      <!-- Subheading -->
      <p
        class="text-neutral-content/90 text-base leading-6 md:leading-8 md:text-lg md:max-w-2/3  font-light"
      >
        We document the damage, work directly with your insurance adjuster, and
        get your roof restored. Backed by a
        <span class="font-semibold text-neutral-content">
          10-year workmanship warranty.
        </span>
      </p>

      <!-- Benefits -->
      <ul class="hidden lg:flex gap-5 flex-wrap">
        {#each benefits as benefit}
          <li class="flex items-center gap-2 text-sm text-base-100/70">
            <Icon icon="lucide:check" class="text-accent size-4" />{benefit}
          </li>
        {/each}
      </ul>
    </div>

    <div class="col-span-2">
      <LandingForm idPrefix="hero-lead" formLocation="hero" />
    </div>
  </div>
</section>
