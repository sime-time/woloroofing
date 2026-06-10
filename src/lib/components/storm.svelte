<script lang="ts">
  import Icon from "@iconify/svelte";
  import StormStepCard from "./storm-step-card.svelte";

  const listItems = [
    "Free, no-obligation storm damage inspection",
    "Full photo documentation for your claim",
    "We meet your insurance adjuster on-site",
    "Professional project management start to finish",
  ];

  const steps = [
    {
      number: "01",
      title: "Free Inspection",
      description:
        "We document every sign of storm, wind, and hail damage with photos and detailed notes.",
    },
    {
      number: "02",
      title: "File the Claim",
      description:
        "We help you file and provide the evidence your insurance company needs to approve it.",
    },
    {
      number: "03",
      title: "Meet the Adjuster",
      description:
        "We meet your adjuster on-site to make sure nothing gets missed or underpaid.",
    },
    {
      number: "04",
      title: "Restore & Warranty",
      description:
        "We complete the work to spec, backed by our 10-year workmanship warranty.",
    },
  ];
</script>

<section
  id="storm"
  class="relative flex w-full items-center justify-center overflow-hidden bg-neutral bg-cover bg-center px-6 py-30"
  style="background-image: url(/roof-storm.webp);"
>
  <div class="absolute inset-0 bg-neutral/50"></div>
  <div
    class="absolute inset-0 bg-linear-to-r from-neutral via-neutral/80 to-neutral/30"
  ></div>

  <div
    class="relative z-10 grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"
  >
    <div class="flex flex-col gap-6">
      <p class="label text-accent">
        <Icon icon="lucide:cloud-lightning" class="mr-2" />
        Storm Damage &amp; Insurance Claims
      </p>

      <h2 class="uppercase text-base-100 text-4xl md:text-6xl">
        Storm Hit?<br>
        <span class="text-accent">We handle the whole claim.</span>
      </h2>

      <p class="text-base-100/90 text-lg">
        Filing a roofing insurance claim is confusing, and a missed detail can
        <u>cost you thousands.</u>
        WOLO specializes in storm damage restoration and insurance claim
        assistance across Central Indiana. We inspect, document, and work
        directly with your adjuster
        <u>so you get the restoration you're owed</u>, without the runaround.
      </p>

      <ul class="space-y-2">
        {#each listItems as item}
          <li class="flex gap-2 items-center text-base-100">
            <Icon icon="lucide:check" class="text-accent size-5" /> {item}
          </li>
        {/each}
      </ul>

      <button
        type="button"
        class="btn btn-primary btn-lg uppercase border-2 py-7 w-full md:w-fit"
      >
        Start my free inspection <Icon icon="lucide:arrow-right" />
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      {#each steps as step}
        <StormStepCard
          number={step.number}
          title={step.title}
          description={step.description}
        />
      {/each}
    </div>
  </div>
</section>
