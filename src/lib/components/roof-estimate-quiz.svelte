<script lang="ts">
  import Icon from "@iconify/svelte";
  import { z } from "zod";
  import { SMS_CONSENT_TEXT } from "$lib/contact-info";
  import {
    estimateQuizAnswersSchema,
    estimateQuizQuestions,
  } from "$lib/estimate-quiz";

  type PreferredContact = "sms" | "email";

  type ContactOption = {
    value: PreferredContact;
    label: string;
    icon: string;
  };

  const contactOptions: ContactOption[] = [
    {
      value: "sms",
      label: "Text message",
      icon: "lucide:message-square-text",
    },
    {
      value: "email",
      label: "Email",
      icon: "lucide:mail",
    },
  ];

  const questions = estimateQuizQuestions;

  const estimateSchema = z.discriminatedUnion("preferredContact", [
    z.object({
      preferredContact: z.literal("sms"),
      name: z.string().trim().min(1, "Please enter your name."),
      phone: z
        .string()
        .trim()
        .min(7, "Please enter a phone number we can text."),
      smsConsent: z.literal(true, {
        error: "Please agree to receive texts so we can send your estimate.",
      }),
      answers: estimateQuizAnswersSchema,
    }),
    z.object({
      preferredContact: z.literal("email"),
      name: z.string().trim().min(1, "Please enter your name."),
      email: z.email("Please enter a valid email address.").trim(),
      answers: estimateQuizAnswersSchema,
    }),
  ]);

  let currentStep = $state(0);
  let answers = $state<Record<string, string>>({});
  let preferredContact = $state<PreferredContact | undefined>();
  let name = $state("");
  let phone = $state("");
  let email = $state("");
  let smsConsent = $state(false);
  let error = $state("");
  let success = $state(false);
  let isSubmitting = $state(false);

  const currentQuestion = $derived(questions[currentStep]);
  const contactStep = $derived(questions.length);
  const formStep = $derived(questions.length + 1);
  const isContactStep = $derived(currentStep === contactStep);
  const isFormStep = $derived(currentStep === formStep);
  const selectedAnswer = $derived(
    currentQuestion ? answers[currentQuestion.id] : undefined,
  );
  const isFirstStep = $derived(currentStep === 0);
  const canContinue = $derived(
    currentQuestion
      ? currentQuestion.type === "zip"
        ? /^\d{5}$/.test(selectedAnswer ?? "")
        : Boolean(selectedAnswer)
      : isContactStep
        ? Boolean(preferredContact)
        : false,
  );

  function selectAnswer(option: string) {
    if (!currentQuestion) return;

    answers = {
      ...answers,
      [currentQuestion.id]: option,
    };
  }

  function updateZipCode(value: string) {
    if (!currentQuestion || currentQuestion.type !== "zip") return;

    answers = {
      ...answers,
      [currentQuestion.id]: value.replace(/\D/g, "").slice(0, 5),
    };
  }

  function goBack() {
    if (currentStep > 0) {
      currentStep -= 1;
    }
  }

  function goNext() {
    if (!canContinue) return;

    if (currentStep < formStep) {
      currentStep += 1;
    }
  }

  async function submitEstimate(event: SubmitEvent) {
    event.preventDefault();

    if (!preferredContact) {
      error = "Please choose how you want to receive your estimate.";
      return;
    }

    const payload =
      preferredContact === "sms"
        ? {
            preferredContact,
            name,
            phone,
            smsConsent,
            answers,
          }
        : {
            preferredContact,
            name,
            email,
            answers,
          };

    const validation = estimateSchema.safeParse(payload);

    if (!validation.success) {
      error =
        validation.error.issues[0]?.message ?? "Please check your information.";
      return;
    }

    isSubmitting = true;
    error = "";

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        error =
          result.errors?.[0]?.message ?? "Your estimate could not be sent.";
        return;
      }

      success = true;
      window.dataLayer.push({
        event: "generate_lead",
        lead_source: "estimate_quiz",
        form_name: "roof_estimate_quiz",
        preferred_contact: preferredContact,
      });
    } catch {
      error =
        "Your estimate could not be sent. Please refresh the page and try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section
  class="flex min-h-dvh items-center bg-base-100 px-6 pt-28 pb-32 text-neutral sm:px-10 sm:pb-16 lg:px-24"
>
  <div class="mx-auto w-full max-w-4xl">
    {#if currentQuestion}
      <h1
        class="mb-12 max-w-3xl text-4xl font-normal leading-tight tracking-normal"
      >
        {currentQuestion.text}
      </h1>

      {#if currentQuestion.type === "choice"}
        <div class="flex max-w-3xl flex-col gap-4">
          {#each currentQuestion.options as option}
            <label class="cursor-pointer">
              <input
                class="peer sr-only"
                type="radio"
                name={currentQuestion.id}
                value={option}
                checked={selectedAnswer === option}
                onchange={() => selectAnswer(option)}
              >

              <span
                class={[
                  "btn btn-lg border border-neutral w-full sm:w-1/2 justify-start font-sans tracking-normal font-medium normal-case peer-focus-visible:outline peer-focus-visible:outline-offset-2",
                  selectedAnswer === option ? "btn-primary border-primary" : "btn-soft ",
                ]}
              >
                <span class="flex-1 text-left">{option}</span>
                {#if selectedAnswer === option}
                  <Icon icon="lucide:check" class="size-5" />
                {/if}
              </span>
            </label>
          {/each}
        </div>
      {:else}
        <div class="max-w-md">
          <label for="estimate-zip" class="sr-only">ZIP code</label>
          <input
            id="estimate-zip"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="5"
            class="input input-lg h-20 w-full border-2 border-neutral bg-base-200 px-8 text-3xl font-medium text-neutral"
            placeholder={currentQuestion.placeholder}
            value={selectedAnswer ?? ""}
            oninput={(event) => updateZipCode(event.currentTarget.value)}
          >
        </div>
      {/if}

      <div class="mt-14 hidden gap-4 sm:flex">
        {#if !isFirstStep}
          <button
            type="button"
            class="btn btn-primary btn-lg px-8"
            onclick={goBack}
          >
            <Icon icon="lucide:arrow-left" class="size-7" />
          </button>
        {/if}

        <button
          type="button"
          class="btn btn-primary btn-lg px-9 text-2xl"
          disabled={!canContinue}
          onclick={goNext}
        >
          Next
        </button>
      </div>
    {:else if isContactStep}
      <h1
        class="mb-12 max-w-3xl text-4xl font-normal leading-tight tracking-normal"
      >
        How do you want to receive your estimate?
      </h1>

      <div class="flex max-w-3xl flex-col gap-4">
        {#each contactOptions as option}
          <label class="cursor-pointer">
            <input
              class="peer sr-only"
              type="radio"
              name="preferredContact"
              value={option.value}
              checked={preferredContact === option.value}
              onchange={() => (preferredContact = option.value)}
            >

            <span
              class={[
                "btn btn-lg border border-neutral w-full sm:w-1/2 justify-start gap-3 font-sans tracking-normal font-medium normal-case peer-focus-visible:outline peer-focus-visible:outline-offset-2",
                preferredContact === option.value ? "btn-primary border-primary" : "btn-soft",
              ]}
            >
              <Icon icon={option.icon} class="size-5" />
              <span class="flex-1 text-left">{option.label}</span>
              {#if preferredContact === option.value}
                <Icon icon="lucide:check" class="size-5" />
              {/if}
            </span>
          </label>
        {/each}
      </div>

      <div class="mt-14 hidden gap-4 sm:flex">
        <button
          type="button"
          class="btn btn-primary btn-lg px-8"
          onclick={goBack}
        >
          <Icon icon="lucide:arrow-left" class="size-7" />
        </button>

        <button
          type="button"
          class="btn btn-primary btn-lg px-9 text-2xl"
          disabled={!canContinue}
          onclick={goNext}
        >
          Next
        </button>
      </div>
    {:else if isFormStep}
      {#if success}
        <div class="max-w-3xl rounded-box bg-base-200 p-8 shadow-sm">
          <Icon icon="lucide:check-circle" class="mb-5 size-12 text-success" />
          <h1 class="mb-4 text-4xl font-normal leading-tight tracking-normal">
            Your estimate is on the way.
          </h1>
          <p class="text-lg text-base-content/80">
            We sent your roofing estimate by
            {preferredContact === "sms" ? "text message" : "email"}.
          </p>
        </div>
      {:else}
        <form
          class="card max-w-3xl bg-base-200 shadow-sm"
          onsubmit={submitEstimate}
        >
          <div class="card-body gap-5 text-base-content">
            <h1
              class="card-title text-4xl font-normal leading-tight tracking-normal"
            >
              Where should we send it?
            </h1>

            <fieldset class="fieldset">
              <label for="estimate-name" class="fieldset-label uppercase"
                >Name</label
              >
              <input
                id="estimate-name"
                name="name"
                type="text"
                class="input input-lg w-full"
                placeholder="Your name"
                autocomplete="name"
                bind:value={name}
              >
            </fieldset>

            {#if preferredContact === "sms"}
              <fieldset class="fieldset">
                <label for="estimate-phone" class="fieldset-label uppercase"
                  >Phone Number</label
                >
                <input
                  id="estimate-phone"
                  name="phone"
                  type="tel"
                  class="input input-lg w-full"
                  placeholder="317-555-1234"
                  autocomplete="tel"
                  bind:value={phone}
                >
              </fieldset>

              <label
                class="flex w-full cursor-pointer items-center gap-3 text-left"
              >
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary mt-1 shrink-0"
                  bind:checked={smsConsent}
                >
                <span
                  class="min-w-0 flex-1 whitespace-normal text-xs font-sans normal-case leading-relaxed tracking-normal"
                  >{SMS_CONSENT_TEXT}</span
                >
              </label>
            {:else}
              <fieldset class="fieldset">
                <label for="estimate-email" class="fieldset-label uppercase"
                  >Email</label
                >
                <input
                  id="estimate-email"
                  name="email"
                  type="email"
                  class="input input-lg w-full"
                  placeholder="you@example.com"
                  autocomplete="email"
                  bind:value={email}
                >
              </fieldset>
            {/if}

            {#if error}
              <p class="text-error">{error}</p>
            {/if}

            <div class="mt-4 flex gap-4">
              <button
                type="button"
                class="btn btn-primary btn-lg h-16 min-w-28 rounded-lg px-8"
                onclick={goBack}
                aria-label="Go back"
              >
                <Icon icon="lucide:arrow-left" class="size-7" />
              </button>

              <button
                type="submit"
                class="btn btn-primary btn-lg h-16 flex-1 rounded-lg text-2xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </form>
      {/if}
    {/if}
  </div>

  {#if !isFormStep && !success}
    <div
      class="fixed inset-x-0 bottom-0 z-40 flex gap-4 bg-base-100/70 px-6 py-4 shadow-2xl backdrop-blur sm:hidden"
    >
      <button
        type="button"
        class="btn btn-primary h-16 min-w-28 rounded-lg"
        disabled={isFirstStep}
        onclick={goBack}
        aria-label="Go back"
      >
        <Icon icon="lucide:arrow-left" class="size-10" />
      </button>

      <button
        type="button"
        class="btn btn-primary h-16 flex-1 rounded-lg text-3xl"
        disabled={!canContinue}
        onclick={goNext}
      >
        Next
      </button>
    </div>
  {/if}
</section>
