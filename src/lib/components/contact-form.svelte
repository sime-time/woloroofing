<script lang="ts">
  import Icon from "@iconify/svelte";
  import { PUBLIC_CF_TURNSTILE_SITE_KEY } from "$env/static/public";

  const serviceOptions = [
    "Roofing",
    "Storm Damage / Insurance Claim",
    "Commercial Roofing",
    "Siding",
    "Gutters",
    "Exterior Repairs",
    "Options",
  ];

  let error = $state("");
  let success = $state(false);

  async function submitContact(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      error = result.errors[0].message;
      return;
    }

    error = "";
    success = true;
    form.reset();
  }
</script>

<form
  method="POST"
  onsubmit={submitContact}
  class="card bg-base-200 w-full border border-neutral/10 shadow-sm"
>
  <div class="card-body text-base-content">
    <h3 class="card-title uppercase text-3xl font-semibold tracking-wide mb-2">
      Request an Inspection
    </h3>

    <fieldset class="fieldset">
      <label for="name" class="fieldset-label uppercase">Name</label>
      <input
        name="name"
        id="name"
        type="text"
        class="input w-full"
        placeholder="Your name"
      >
    </fieldset>

    <fieldset class="fieldset">
      <label for="email" class="fieldset-label uppercase">Email</label>
      <input
        name="email"
        id="email"
        type="email"
        class="input w-full "
        placeholder="your@email.com"
      >
    </fieldset>

    <fieldset class="fieldset">
      <label for="service" class="fieldset-label uppercase">
        How Can We Help?
      </label>
      <select name="service" id="service" class="select w-full">
        {#each serviceOptions as service}
          <option value={service}>{service}</option>
        {/each}
      </select>
    </fieldset>

    <fieldset class="fieldset">
      <label for="message" class="fieldset-label uppercase">Message</label>
      <textarea
        name="message"
        class="textarea w-full "
        placeholder="Tell us about your roof or project..."
      ></textarea>
    </fieldset>

    <div class="cf-turnstile" data-sitekey={PUBLIC_CF_TURNSTILE_SITE_KEY}></div>

    {#if error}
      <p class="text-error">{error}</p>
    {/if}

    {#if success}
      <p class="text-success text-lg font-semibold">
        Form submitted - Thank you!
      </p>
    {:else}
      <button type="submit" class="btn btn-primary btn-lg mt-3">
        Send My Request <Icon icon="lucide:arrow-right" />
      </button>

      <a class="link text-primary text-center mt-2" href="/schedule-inspection">
        Schedule an inspection now? Click here
      </a>
    {/if}
  </div>
</form>
