<script lang="ts">
  const projects = [
    {
      title: "Full Restoration",
      description:
        "Damage and age replaced with a finished roof system built for Indiana weather.",
      before: "/restoration-before.webp",
      after: "/restoration-after.webp",
      beforeAlt: "Roof before WOLO Roofing restoration work",
      afterAlt: "Roof after WOLO Roofing restoration work",
    },
    {
      title: "Siding Refresh",
      description:
        "A weather-worn exterior rebuilt with clean lines, tighter protection, and stronger curb appeal.",
      before: "/siding-before.webp",
      after: "/siding-after.webp",
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

  <div class="grid w-full max-w-6xl gap-6 pt-8 lg:grid-cols-2">
    {#each projects as project}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <figure
        class="diff relative aspect-1297/1113 overflow-hidden rounded"
        tabindex="0"
      >
        <div class="diff-item-1 relative" role="img" tabindex="0">
          <img alt={project.beforeAlt} src={project.before}>
          <div class="absolute inset-x-0 top-0 z-10 p-3">
            <button
              type="button"
              class="badge badge-soft badge-error badge-lg shadow-md"
            >
              Before
            </button>
          </div>
        </div>

        <div class="diff-item-2 relative" role="img">
          <img alt={project.afterAlt} src={project.after}>
          <div class="absolute inset-x-0 top-0 z-10 flex justify-end p-3">
            <button
              type="button"
              class="badge badge-soft badge-primary badge-lg shadow-md"
            >
              After
            </button>
          </div>
        </div>

        <div class="diff-resizer"></div>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex gap-3 bg-linear-to-t from-neutral to-neutral/40 p-4 text-neutral-content sm:flex-row sm:items-end justify-between sm:p-5"
        >
          <h3 class="text-xl font-semibold uppercase sm:text-2xl">
            {project.title}
          </h3>

          <a
            class="btn btn-primary btn-sm pointer-events-auto shrink-0"
            href="#contact"
          >
            Start your project
          </a>
        </div>
      </figure>
    {/each}
  </div>
</section>
