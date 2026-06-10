<script lang="ts">
  import Icon from "@iconify/svelte";

  const { icon, title, description } = $props();
</script>

<div
  class="card group bg-base-100 border-2 border-neutral-300 hover:border-primary hover:shadow-lg transition-all duration-400"
>
  <div class="card-body">
    <div
      class="rounded-lg bg-primary/10 size-12 flex items-center justify-center mb-3 transition-colors duration-400 group-hover:bg-primary"
    >
      <Icon
        {icon}
        class="size-6 text-primary shrink-0 transition-colors duration-400 group-hover:text-primary-content"
      />
    </div>
    <h3 class="card-title uppercase tracking-wider text-base-content">
      {title}
    </h3>
    <p class="text-neutral/60">{description}</p>
  </div>
</div>
