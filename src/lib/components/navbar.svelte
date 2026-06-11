<script lang="ts">
  import Icon from "@iconify/svelte";
  import { WOLOPHONE, WOLOPHONE_HREF } from "$lib/contact-info";

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
  const isScrolled = $derived(scrollY > 8);

  let isMobileMenuOpen = $state(false);

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMenu() {
    isMobileMenuOpen = false;
  }
</script>

<svelte:window bind:scrollY />

<header
  class={["fixed top-0 left-0 z-50 flex w-full justify-center transition-colors duration-300", 
		isScrolled || isMobileMenuOpen ? "bg-neutral shadow-lg" : "bg-linear-to-b from-neutral/70 to-transparent",
	]}
>
  <section
    class="flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6"
  >
    <div>
      <!-- Logo -->
      <a href="/#hero" class="btn btn-ghost border-none hover:bg-transparent">
        <img src="/logo.svg" alt="Wolo Roofing" class="h-14 w-auto">
      </a>
    </div>

    <!-- Desktop Nav -->
    <nav class="hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        {#each navItems as item}
          <li>
            <a href={item.href} class="text-base-100 hover:text-accent">
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- End Button -->
    <div class="flex">
      <a
        class="btn btn-ghost text-base-100 hover:text-accent hidden lg:flex border-none hover:bg-transparent"
        href={WOLOPHONE_HREF}
      >
        <Icon icon="lucide:phone" />

        {WOLOPHONE}</a
      >
      <a class="btn btn-primary hidden lg:flex" href="#contact"
        >Free Inspection</a
      >

      <!-- Mobile Menu Toggle -->
      <button
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={isMobileMenuOpen}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        class="btn btn-ghost border-none text-base-100 hover:text-accent hover:bg-transparent lg:hidden"
        onclick={toggleMenu}
      >
        <Icon
          icon={isMobileMenuOpen ? "lucide:x" : "lucide:menu"}
          class="h-7 w-auto"
        />
      </button>
    </div>
  </section>

  <!-- Mobile Nav Dropdown -->
  {#if isMobileMenuOpen}
    <nav
      id="mobile-navigation"
      class="absolute top-full left-0 flex w-full flex-col gap-6 border-t border-neutral-content/30 bg-neutral/95 px-[5%] pt-8 pb-8 text-neutral-content shadow-lg backdrop-blur lg:hidden"
    >
      {#each navItems as navItem}
        <a
          href={navItem.href}
          class="text-xl font-medium transition-colors hover:text-accent"
          onclick={closeMenu}
        >
          {navItem.label}
        </a>
      {/each}
      <a
        href={WOLOPHONE_HREF}
        class="text-xl font-medium transition-colors hover:text-accent flex gap-3 items-center"
        onclick={closeMenu}
      >
        <Icon icon="lucide:phone" />
        {WOLOPHONE}
      </a>

      <a
        class="btn btn-primary btn-block btn-lg"
        href="#contact"
        onclick={closeMenu}
      >
        Free Inspection
      </a>
    </nav>
  {/if}
</header>
