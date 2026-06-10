<script lang="ts">
  import ServiceCard from "./service-card.svelte";

  const services = [
    {
      icon: "lucide:house",
      title: "Residential Roofing",
      description:
        "Full roof replacement, repairs, and new installs for homes of every style: shingle, architectural, and more.",
    },
    {
      icon: "lucide:building-2",
      title: "Commercial Roofing",
      description:
        "Durable, code-compliant roofing systems for commercial and multi-unit properties, managed start to finish.",
    },
    {
      icon: "lucide:cloud-lightning",
      title: "Storm Damage Restoration",
      description:
        "Wind, hail, and storm damage assessed and restored quickly, thoroughly, and documented for your claim.",
    },
    {
      icon: "lucide:file-text",
      title: "Insurance Claim Assistance",
      description:
        "We inspect, document, and work directly with your adjuster so your claim is handled right the first time.",
    },
    {
      icon: "lucide:layers",
      title: "Siding",
      description:
        "Siding replacement and repair that protects your home and transforms its curb appeal.",
    },
    {
      icon: "lucide:droplets",
      title: "Gutters",
      description:
        "Seamless gutters and downspouts that move water away from your roof, siding, and foundation.",
    },
    {
      icon: "lucide:hammer",
      title: "Exterior Repairs",
      description:
        "Fascia, soffit, trim, and full exterior restoration, with every detail finished to last.",
    },
    {
      icon: "lucide:clipboard-check",
      title: "Inspections & Estimates",
      description:
        "Honest, no-pressure inspections with clear, written estimates before any work begins.",
    },
  ];
</script>

<section
  id="services"
  class="flex flex-col gap-3 justify-center items-center w-full py-30 px-6 bg-base-200"
>
  <p class="label text-primary">What we do</p>

  <h2 class="uppercase text-4xl md:text-6xl text-center">
    Roofing &amp; Exterior Services
  </h2>

  <div>
    <span class="divider divider-accent w-16 h-0"></span>
  </div>

  <p class="text-neutral/70 max-w-3xl text-center">
    From a single repair to a full exterior restoration, WOLO handles every part
    of your project with professional management and honest communication.
  </p>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mt-6"
  >
    {#each services as service}
      <ServiceCard
        title={service.title}
        description={service.description}
        icon={service.icon}
      />
    {/each}
  </div>
</section>
