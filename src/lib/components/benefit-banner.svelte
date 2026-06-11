<script lang="ts">
  import Icon from "@iconify/svelte";

  const benefits = [
    {
      icon: "lucide:shield-check",
      text: "10-year warranty",
      subtext: "On all worksmanship",
    },
    {
      icon: "lucide:file-text",
      text: "Insurance claims",
      subtext: "We handle the paperwork",
    },
    {
      icon: "lucide:house",
      text: "Locally Owned",
      subtext: "Central Indiana roots",
    },
    {
      icon: "lucide:search",
      text: "Free Inspections",
      subtext: "No-obligation estimates",
    },
  ];
</script>

<section class="bg-neutral">
  <div class="grid grid-cols-2 lg:grid-cols-4">
    {#each benefits as benefit, index}
      <div
        class={["flex items-center gap-2 md:gap-4 p-6 border border-base-300/10", index === 0 && "xl:pl-16"]}
      >
        <Icon icon={benefit.icon} class="text-accent size-8 shrink-0" />
        <div class="flex flex-col">
          <p
            class="font-heading text-neutral-content font-semibold tracking-wide uppercase  md:text-lg"
          >
            {benefit.text}
          </p>
          <p class="text-neutral-content/70 text-xs md:text-sm">
            {benefit.subtext}
          </p>
        </div>
      </div>
    {/each}
  </div>
</section>
