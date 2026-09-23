<script lang="ts">
  import Icon from "@iconify/svelte";

  let { idPrefix = "lead" } = $props<{
    idPrefix?: string;
    formLocation?: string;
  }>();
</script>

<div
  id={`${idPrefix}-cta`}
  class="card bg-base-200 w-full max-w-screen border border-neutral/10 shadow-sm"
>
  <div class="card-body text-base-content">
    <h2 class="card-title uppercase text-xl font-semibold tracking-wide ">
      Get Your Instant Roof Estimate
    </h2>

    <ul
      class=" flex flex-col gap-3 text-sm sm:text-lg text-base-content/80 my-2"
    >
      <li class="flex items-center gap-2">
        <Icon icon="lucide:check" class="size-4 text-primary" />Takes about 60
        seconds
      </li>
      <li class="flex items-center gap-2">
        <Icon icon="lucide:check" class="size-4 text-primary" />No appointment
        required
      </li>
      <li class="flex items-center gap-2">
        <Icon icon="lucide:check" class="size-4 text-primary" />Free inspection
        available after your result
      </li>
    </ul>

    <a href="/estimate" class="btn btn-primary btn-lg">
      Start My Estimate
      <Icon icon="lucide:arrow-right" />
    </a>
  </div>
</div>
