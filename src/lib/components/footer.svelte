<script lang="ts">
  import Icon from "@iconify/svelte";
  import { contacts, socials } from "$lib/contact-info";

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

  const year = new Date().getFullYear();
</script>

<footer
  class="footer sm:footer-horizontal bg-neutral text-neutral-content p-8 sm:p-10"
>
  <aside class="max-w-sm">
    <a href="/#hero" aria-label="Wolo Roofing home" class="inline-flex">
      <img src="/logo.svg" alt="Wolo Roofing" class="h-16 w-auto">
    </a>
    <p class="text-sm leading-relaxed text-neutral-content/80">
      Wolo Roofing provides residential roofing, storm restoration, and exterior
      service across Central Indiana.
    </p>
    <p class="text-sm text-neutral-content/70">
      &copy; {year} Wolo Roofing. All rights reserved.
    </p>
  </aside>

  <nav>
    <h2 class="footer-title text-neutral-content">Navigate</h2>
    {#each navItems as item}
      <a
        href={item.href}
        class="link link-hover text-neutral-content/80 hover:text-accent"
      >
        {item.label}
      </a>
    {/each}
  </nav>

  <nav>
    <h2 class="footer-title text-neutral-content">Contact</h2>
    {#each contacts as contact}
      <a
        href={contact.href}
        class="link link-hover flex items-center gap-2 text-neutral-content/80 hover:text-accent"
      >
        <Icon icon={contact.icon} class="h-4 w-4" />
        <span>{contact.label}</span>
      </a>
    {/each}
  </nav>

  <nav>
    <h2 class="footer-title text-neutral-content">Follow</h2>
    <div class="flex gap-2">
      {#each socials as social}
        <a
          href={social.link}
          aria-label={`Wolo Roofing on ${social.type}`}
          class="btn btn-outline btn-square text-neutral-content hover:text-accent hover:bg-neutral-content/10"
        >
          <Icon icon={social.logo} class="h-5 w-5" />
        </a>
      {/each}
    </div>
    <div class="w-full  pt-6 text-sm text-neutral-content/70 sm:col-span-full ">
      Website built by:<br>
      <a
        href="https://sitedonenow.com"
        class="link link-hover text-neutral-content hover:text-accent"
      >
        Site Done Now
      </a>
    </div>
  </nav>
</footer>
