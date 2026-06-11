<script>
  import Icon from "@iconify/svelte";

  const serviceOptions = [
    "Roofing",
    "Storm Damage / Insurance Claim",
    "Commercial Roofing",
    "Siding",
    "Gutters",
    "Exterior Repairs",
    "Options",
  ];
</script>

<form
  name="woloroofing-contact"
  method="POST"
  data-netlify={true}
  class="card bg-base-200 w-full border border-neutral/10 shadow-sm"
>
  <div class="card-body text-base-content">
    <h3 class="card-title uppercase text-3xl font-semibold tracking-wide mb-2">
      Request an Inspection
    </h3>

    <div class="grid grid-cols-2 gap-3">
      <fieldset class="fieldset">
        <legend class="fieldset-legend uppercase">Name</legend>
        <input
          name="name"
          id="name"
          type="text"
          class="input w-full"
          placeholder="Your name"
        >
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend uppercase">Phone</legend>
        <input
          name="phone"
          id="phone"
          type="tel"
          autocomplete="tel"
          class="input w-full "
          placeholder="Your phone"
        >
      </fieldset>
    </div>

    <fieldset class="fieldset">
      <legend class="fieldset-legend uppercase">Email</legend>
      <input
        name="email"
        id="email"
        type="email"
        class="input w-full "
        placeholder="your@email.com"
      >
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend uppercase">How Can We Help?</legend>
      <select name="service[]" class="select w-full">
        {#each serviceOptions as service}
          <option value={service}>{service}</option>
        {/each}
      </select>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend uppercase">Message</legend>
      <textarea
        name="message"
        class="textarea w-full "
        placeholder="Tell us about your roof or project..."
      ></textarea>
    </fieldset>

    <button type="submit" class="btn btn-primary btn-lg mt-3">
      Send My Request <Icon icon="lucide:arrow-right" />
    </button>
  </div>
</form>
