<script lang="ts">
  import LandingForm from "$lib/components/landing-form.svelte";
  import Navbar from "$lib/components/navbar.svelte";
</script>

<Navbar />

<main class="w-full min-h-screen bg-neutral">
  <section
    id="contact"
    class="flex min-h-screen w-full items-start justify-center px-6 pt-28 pb-8 lg:items-center lg:px-6 lg:py-28"
  >
    <div
      class="relative z-10 grid w-full max-w-7xl min-w-0 gap-6 lg:gap-14 lg:grid-cols-2 lg:items-center"
    >
      <div class="flex min-w-0 flex-col gap-4">
        <h1 class="uppercase text-base-100 text-5xl md:text-6xl">
          Roof took a hit?<br>
          <span class="text-accent">Get A Free Inspection</span>
        </h1>

        <p class="text-base-100/90 text-base md:text-lg">
          We document the damage, work directly with your insurance adjuster,
          and get your roof restored. Backed by a 10-year workmanship warranty.
        </p>
      </div>

      <LandingForm />
    </div>
  </section>
</main>
