<script lang="ts">
  const { number, title, description } = $props<{
    number: string;
    title: string;
    description: string;
  }>();
</script>

<article
  class="card border-2 border-neutral-content/15 bg-neutral/60 backdrop-blur-xs"
>
  <div class="card-body gap-2">
    <p class="font-heading text-4xl font-extrabold leading-none text-primary">
      {number}
    </p>
    <h3
      class="card-title text-2xl font-extrabold uppercase text-neutral-content"
    >
      {title}
    </h3>
    <p class="leading-8 text-neutral-content/70">
      {description}
    </p>
  </div>
</article>
