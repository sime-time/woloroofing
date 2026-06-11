<script lang="ts">
  import Icon from "@iconify/svelte";
  import { contacts, socials } from "$lib/contact-info";
</script>

<section
  id="contact"
  class="flex w-full items-center justify-center bg-base-100 py-30"
>
  <div
    class="relative z-10 grid w-full max-w-7xl min-w-0 gap-12 px-6 lg:grid-cols-2 lg:items-center"
  >
    <div class="flex min-w-0 flex-col gap-6">
      <p class="label text-primary text-xs sm:text-sm">Get In Touch</p>

      <h2 class="uppercase text-base-content text-4xl md:text-6xl">
        Get Your Free Inspection
      </h2>

      <p class="text-base-content/60">
        Call, email, or send us a message and we'll schedule your free,
        no-obligation inspection. Storm damage, a worn-out roof, or a whole
        exterior, we've got you.
      </p>

      <div class="flex flex-col gap-6">
        {#each contacts as contact}
          <a href={contact.href} class="group flex gap-4 items-center w-fit">
            <div
              class="btn btn-square btn-soft btn-primary btn-lg group-hover:bg-primary group-hover:text-primary-content group-hover:border-primary"
            >
              <Icon icon={contact.icon} />
            </div>
            <div class="text-base-content">
              <h3 class="tracking-wider font-semibold text-lg">
                {contact.label}
              </h3>
              <p class="text-sm opacity-60 tracking-wide">
                {contact.description}
              </p>
            </div>
          </a>
        {/each}

        <div class="flex gap-4 items-center">
          {#each socials as social}
            <a
              href={social.link}
              class="btn btn-square btn-neutral btn-lg rounded-lg"
              aria-label={social.type}
            >
              <Icon icon={social.logo} />
            </a>
          {/each}
          <p class="text-base-content/60 text-sm">@woloroofing</p>
        </div>
      </div>
    </div>

    <div>
      <!-- Contact Form -->
    </div>
  </div>
</section>
