<script lang="ts">
  import restorationAfter from "$lib/assets/images/restoration-after.webp?enhanced";
  import restorationBefore from "$lib/assets/images/restoration-before.webp?enhanced";
  import sidingAfter from "$lib/assets/images/siding-after.webp?enhanced";
  import sidingBefore from "$lib/assets/images/siding-before.webp?enhanced";
  import BeforeAfterSlider from "./before-after-slider.svelte";

  const projects = [
    {
      title: "Full Restoration",
      description:
        "Damage and age replaced with a finished roof system built for Indiana weather.",
      before: restorationBefore,
      after: restorationAfter,
      beforeAlt: "Roof before WOLO Roofing restoration work",
      afterAlt: "Roof after WOLO Roofing restoration work",
    },

    {
      title: "Siding Refresh",
      description:
        "A weather-worn exterior rebuilt with clean lines, tighter protection, and stronger curb appeal.",
      before: sidingBefore,
      after: sidingAfter,
      beforeAlt: "Home exterior before WOLO Roofing siding work",
      afterAlt: "Home exterior after WOLO Roofing siding work",
    },
  ];
</script>

<section
  id="work"
  class="flex flex-col gap-3 justify-center items-center w-full py-30 px-6 bg-base-100"
>
  <p class="label text-primary">Real Projects, Real Results</p>

  <h2 class="uppercase text-4xl md:text-6xl text-center text-base-content">
    Our Work
  </h2>

  <div>
    <span class="divider divider-accent w-16 h-0"></span>
  </div>

  <p class="text-neutral/70 max-w-xl text-center">
    From storm-damaged and worn-out to fully restored, this is WOLO
    craftsmanship on real Indiana homes.
  </p>

  <!-- Before and After Sliders -->
  <div class="grid w-full max-w-6xl gap-7 pt-8 lg:grid-cols-2">
    {#each projects as project}
      <BeforeAfterSlider
        title={project.title}
        beforeSrc={project.before}
        afterSrc={project.after}
        beforeAlt={project.beforeAlt}
        afterAlt={project.afterAlt}
        showLabels={true}
      />
    {/each}
  </div>
</section>
