<script lang="ts">
  import Icon from "@iconify/svelte";
  import { PUBLIC_CF_TURNSTILE_SITE_KEY } from "$env/static/public";
  import { SMS_CONSENT_TEXT } from "$lib/contact-info";

  let { idPrefix = "lead", formLocation = "unknown" } = $props<{
    idPrefix?: string;
    formLocation?: string;
  }>();

  let error = $state("");
  let success = $state(false);
  let loading = $state(false);

  async function submitLanding(event: SubmitEvent) {
    event.preventDefault();
    loading = true;

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const response = await fetch("/api/landing", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      error = result.errors[0].message;
      loading = false;
      return;
    }

    error = "";
    success = true;
    loading = false;
    window.dataLayer.push({
      event: "generate_lead",
      lead_source: "home_page",
      form_name: "lead_form",
      form_location: formLocation,
    });
  }
</script>

<form
  id={`${idPrefix}-form`}
  method="POST"
  onsubmit={submitLanding}
  class="card bg-base-200 w-full max-w-screen border border-neutral/10 shadow-sm"
>
  <div class="card-body text-base-content">
    <h2 class="card-title uppercase text-xl font-semibold tracking-wide ">
      We'll reach out to you
    </h2>

    <fieldset class="fieldset">
      <label for={`${idPrefix}-name`} class="fieldset-label uppercase">Name</label>
      <input
        name="name"
        id={`${idPrefix}-name`}
        type="text"
        required
        class="input w-full"
        placeholder="Your name"
        disabled={success}
      >
    </fieldset>

    <fieldset class="fieldset">
      <label for={`${idPrefix}-phone`} class="fieldset-label uppercase">Phone</label>
      <input
        name="phone"
        id={`${idPrefix}-phone`}
        type="tel"
        required
        autocomplete="tel"
        class="input w-full"
        placeholder="Your phone number"
        disabled={success}
      >
    </fieldset>

    <fieldset class="fieldset">
      <label for={`${idPrefix}-message`} class="fieldset-label uppercase"
        >What Happened?</label
      >
      <textarea
        id={`${idPrefix}-message`}
        name="message"
        required
        minlength="5"
        maxlength="500"
        class="textarea w-full "
        placeholder="Example: Missing shingles, leak in kitchen, hail damage, gutters loose"
        disabled={success}
      ></textarea>
    </fieldset>

    <fieldset class="fieldset my-2">
      <label
        for={`${idPrefix}-consent`}
        class="font-sans text-wrap text-xs font-light flex gap-2"
      >
        <input
          id={`${idPrefix}-consent`}
          name="consent"
          checked={false}
          type="checkbox"
          required
          class="checkbox checkbox-primary"
          disabled={success}
        >
        <span>{SMS_CONSENT_TEXT}</span>
      </label>
    </fieldset>

    <div class="cf-turnstile" data-sitekey={PUBLIC_CF_TURNSTILE_SITE_KEY}></div>

    {#if success}
      <p class="text-success text-lg font-semibold">
        Thank you! We'll reach out to you shortly.
      </p>
    {:else}
      <button type="submit" class="btn btn-primary btn-lg" disabled={loading}>
        Get Free Inspection
        {#if loading}
          <span class="loading loading-spinner loading-lg"></span>
        {:else}
          <Icon icon="lucide:arrow-right" />
        {/if}
      </button>
    {/if}

    {#if error}
      <p class="text-error">{error}</p>
    {/if}
  </div>
</form>
