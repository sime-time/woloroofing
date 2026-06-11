<script lang="ts">
  import Icon from "@iconify/svelte";

  const attributes = [
    {
      icon: "lucide:messages-square",
      title: "Honest communication",
      description:
        "Clear estimates, straight answers, and no high-pressure sales, ever.",
    },
    {
      icon: "lucide:clipboard-list",
      title: "Professional management",
      description:
        "One point of contact managing your project from inspection through completion.",
    },
    {
      icon: "lucide:hammer",
      title: "Quality workmanship",
      description:
        "Done right the first time and backed by our 10-year workmanship warranty.",
    },
    {
      icon: "lucide:shield-check",
      title: "Insurance expertise",
      description:
        "We know the claims process and fight to get your restoration fully covered.",
    },
  ];
</script>

<section
  id="why"
  class="flex w-full items-center justify-center bg-base-200 py-30"
>
  <div
    class="relative z-10 grid w-full max-w-7xl min-w-0 gap-12 px-6 lg:grid-cols-2 lg:items-center"
  >
    <div class="relative min-w-0 pr-6 pb-8 sm:pr-8">
      <enhanced:img
        src="$lib/assets/images/why-wolo-team.jpg"
        alt="WOLO team installing exterior materials on a home"
        class="w-full rounded-lg object-cover object-center h-136 sm:h-160 lg:h-184"
        sizes="(min-width: 1024px) 50vw, 100vw"
        loading="lazy"
        decoding="async"
      />

      <div
        class="absolute bottom-0 right-0 flex flex-col items-center justify-center rounded-lg bg-primary text-center text-primary-content shadow-xl p-3 w-36 h-32"
      >
        <div class="text-5xl font-bold leading-none font-heading">10</div>
        <div
          class="text-xs tracking-wider uppercase font-heading font-semibold"
        >
          Year Workmanship Warranty
        </div>
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-6">
      <p class="label text-primary text-xs sm:text-sm">Why Wolo?</p>

      <h2 class="uppercase text-base-content text-4xl md:text-6xl">
        A Local Team You Can Actually Trust
      </h2>

      <p class="text-base-content/60">
        WOLO Roofing &amp; Exteriors is a locally owned roofing and exterior
        restoration company serving Central Indiana. We specialize in
        residential and commercial roofing, insurance claim assistance, storm
        damage restoration, siding, gutters, and exterior repairs.
      </p>

      <p class="text-base-content/60">
        Our goal is simple: high-quality workmanship, honest communication, and
        professional project management on every job, from the first inspection
        to the final walkthrough.
      </p>

      <div class="grid min-w-0 gap-4 md:grid-cols-2">
        {#each attributes as attribute}
          <div class="card border-2 border-neutral/10 bg-base-100">
            <div class="card-body">
              <h3 class="card-title text-base-content">
                <Icon icon={attribute.icon} class="text-primary" />
                {attribute.title}
              </h3>
              <p class="text-base-content/50">{attribute.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
