<script lang="ts">
  import Icon from "@iconify/svelte";
  import { WOLOPHONE } from "$lib/constants";

  const navItems = [
    {
      label: "Services",
      href: "/#services",
    },
    {
      label: "Storm & Insurance",
      href: "/#storm",
    },
    {
      label: "Our Work",
      href: "/#work",
    },
    {
      label: "Why Wolo",
      href: "/#why",
    },
    {
      label: "Service Area",
      href: "/#area",
    },
    {
      label: "Contact",
      href: "/#contact",
    },
  ];

  let scrollY = $state(0);
  let mobileMenuOpen = $state(false);
  const isScrolled = $derived(scrollY > 8);
</script>

<svelte:window bind:scrollY />

<section
  class={["fixed top-0 left-0 flex justify-center z-50 transition-colors duration-300 py-4 w-full", 
		isScrolled ? "bg-neutral shadow-lg" : "bg-linear-to-b from-neutral/70 to-transparent",
	]}
>
  <nav class="flex justify-between items-center w-full max-w-7xl">
    <div>
      <!-- Logo -->
      <a href="/#hero" class="btn btn-ghost border-none hover:bg-transparent">
        <img src="/logo.svg" alt="Wolo Roofing" class="h-14 w-auto">
      </a>
    </div>

    <!-- Desktop Nav Links -->
    <div class="hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        {#each navItems as item}
          <li>
            <a href={item.href} class="text-base-100 hover:text-accent">
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- End Button -->
    <div class="flex">
      <a
        class="btn btn-ghost text-base-100 hover:text-accent hidden lg:flex border-none hover:bg-transparent"
        href="#phone"
      >
        <Icon icon="lucide:phone" />

        {WOLOPHONE}</a
      >
      <a class="btn btn-primary hidden lg:flex" href="#contact"
        >Free Inspection</a
      >

      <!-- Mobile Menu Button -->
      <button
        type="button"
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        class="btn btn-ghost border-none text-base-100 hover:text-accent hover:bg-transparent lg:hidden"
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
      >
        <Icon
          icon={mobileMenuOpen ? "lucide:x" : "lucide:menu"}
          class="h-7 w-auto"
        />
      </button>
    </div>
  </nav>
</section>
