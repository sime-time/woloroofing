<script lang="ts">
  interface Props {
    title: string;
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
    initialValue?: number;
    step?: number;
    showLabels?: boolean;
    disabled?: boolean;
  }

  const {
    title,
    beforeSrc,
    afterSrc,
    beforeAlt = "Before image",
    afterAlt = "After image",
    initialValue = 50,
    step = 1,
    showLabels = true,
    disabled = false,
  }: Props = $props();

  let sliderElement: HTMLElement;
  // svelte-ignore state_referenced_locally
  let value = $state(clamp(snap(initialValue)));
  let isDragging = $state(false);

  function clamp(nextValue: number) {
    return Math.min(100, Math.max(0, nextValue));
  }

  function snap(nextValue: number) {
    const safeStep = step > 0 ? step : 1;
    return Math.round(nextValue / safeStep) * safeStep;
  }

  function setValue(nextValue: number) {
    value = clamp(snap(nextValue));
  }

  function setValueFromClientX(clientX: number) {
    if (!sliderElement || disabled) return;

    const bounds = sliderElement.getBoundingClientRect();
    if (bounds.width === 0) return;

    setValue(((clientX - bounds.left) / bounds.width) * 100);
  }

  function handlePointerDown(event: PointerEvent) {
    if (disabled) return;

    isDragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setValueFromClientX(event.clientX);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging || disabled) return;
    setValueFromClientX(event.clientX);
  }

  function handlePointerUp(event: PointerEvent) {
    if (!isDragging) return;

    isDragging = false;
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;

    const safeStep = step > 0 ? step : 1;
    const pageStep = safeStep * 10;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        setValue(value - safeStep);
        break;
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        setValue(value + safeStep);
        break;
      case "PageDown":
        event.preventDefault();
        setValue(value - pageStep);
        break;
      case "PageUp":
        event.preventDefault();
        setValue(value + pageStep);
        break;
      case "Home":
        event.preventDefault();
        setValue(0);
        break;
      case "End":
        event.preventDefault();
        setValue(100);
        break;
    }
  }
</script>

<figure
  bind:this={sliderElement}
  class="group relative aspect-1297/1113 w-full overflow-hidden rounded bg-base-200 text-base-content select-none"
  style={`--before-after-value: ${value}%;`}
>
  <enhanced:img
    class="h-full w-full object-cover"
    src={afterSrc}
    alt={afterAlt}
    sizes="(min-width: 1024px) 36rem, 100vw"
    loading="lazy"
    decoding="async"
    draggable="false"
  />

  <div class="before-image absolute inset-0">
    <enhanced:img
      class="h-full w-full object-cover"
      src={beforeSrc}
      alt={beforeAlt}
      sizes="(min-width: 1024px) 36rem, 100vw"
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  </div>

  {#if showLabels}
    <div class="absolute inset-x-0 top-0 z-30 flex justify-between gap-3 p-3">
      <button
        type="button"
        class="badge badge-soft badge-error badge-lg shadow-md"
      >
        Before
      </button>
      <button
        type="button"
        class="badge badge-soft badge-primary badge-lg shadow-md"
      >
        After
      </button>
    </div>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex gap-3 bg-linear-to-t from-neutral to-neutral/40 p-4 text-neutral-content sm:flex-row sm:items-end justify-between sm:p-5"
    >
      <h3 class="text-xl font-semibold uppercase sm:text-2xl">
        {title}
      </h3>

      <a
        class="btn btn-primary btn-sm pointer-events-auto shrink-0"
        href="#contact"
      >
        Start your project
      </a>
    </div>
  {/if}

  <button
    type="button"
    class="handle absolute inset-y-0 z-10 flex w-12 -translate-x-1/2 cursor-ew-resize items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 disabled:cursor-not-allowed disabled:opacity-70"
    aria-label="Image comparison slider"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={Math.round(value)}
    aria-valuetext={`${Math.round(value)}% before image visible`}
    aria-disabled={disabled}
    {disabled}
    role="slider"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    onkeydown={handleKeydown}
  >
    <span class="h-full w-1 rounded-full bg-base-100 shadow-lg"></span>
    <span
      class="absolute grid size-10 place-items-center rounded-full border-2 border-base-100 bg-primary text-primary-content shadow-lg transition-transform group-hover:scale-105"
      aria-hidden="true"
    >
      <span class="flex items-center gap-1">
        <span
          class="h-3 w-3 rotate-45 border-b-2 border-l-2 border-current"
        ></span>
        <span
          class="h-3 w-3 rotate-45 border-r-2 border-t-2 border-current"
        ></span>
      </span>
    </span>
  </button>
</figure>

<style>
  .before-image {
    clip-path: inset(0 calc(100% - var(--before-after-value)) 0 0);
  }

  .handle {
    left: var(--before-after-value);
    touch-action: none;
  }
</style>
