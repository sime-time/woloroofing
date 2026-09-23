import { z } from "zod";

export const estimateQuizAnswersSchema = z.object({
  helpWith: z.string().trim().min(1),
  decisionMaker: z.string().trim().min(1),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code."),
  roofAge: z.string().trim().min(1),
  roofType: z.string().trim().min(1),
  homeSize: z.string().trim().min(1),
  stories: z.string().trim().min(1),
  roofComplexity: z.string().trim().min(1),
  roofCondition: z.string().trim().min(1),
  insurance: z.string().trim().min(1),
  timeline: z.string().trim().min(1),
});

export type EstimateQuizAnswers = z.infer<typeof estimateQuizAnswersSchema>;
export type EstimateQuizAnswerId = keyof EstimateQuizAnswers;

export type EstimateQuizChoiceQuestion = {
  id: Exclude<EstimateQuizAnswerId, "zipCode">;
  type: "choice";
  text: string;
  options: string[];
};

export type EstimateQuizZipQuestion = {
  id: "zipCode";
  type: "zip";
  text: string;
  placeholder: string;
};

export type EstimateQuizQuestion =
  | EstimateQuizChoiceQuestion
  | EstimateQuizZipQuestion;

export const estimateQuizQuestions: EstimateQuizQuestion[] = [
  {
    id: "helpWith",
    type: "choice",
    text: "What do you need help with?",
    options: [
      "Full roof replacement",
      "Storm, wind, or hail damage",
      "Roof leak",
      "Missing or damaged shingles",
      "Gutters, siding, or exterior damage",
      "Not sure yet",
    ],
  },
  {
    id: "decisionMaker",
    type: "choice",
    text: "Are you the homeowner or decision maker?",
    options: [
      "Yes, I own the home",
      "I help make decisions",
      "No, I'm just researching",
    ],
  },
  {
    id: "zipCode",
    type: "zip",
    text: "What is the property's ZIP code?",
    placeholder: "46220",
  },
  {
    id: "roofAge",
    type: "choice",
    text: "How old is the roof?",
    options: [
      "0-5 years",
      "6-10 years",
      "11-15 years",
      "16-20 years",
      "20+ years",
      "Not sure",
    ],
  },
  {
    id: "roofType",
    type: "choice",
    text: "What type of roof do you have?",
    options: [
      "Asphalt shingles",
      "Metal roof",
      "Flat or low-slope roof",
      "Tile, slate, or specialty roof",
      "Not sure",
    ],
  },
  {
    id: "homeSize",
    type: "choice",
    text: "About how big is the home?",
    options: [
      "Under 1,200 sq ft",
      "1,200-1,800 sq ft",
      "1,800-2,500 sq ft",
      "2,500-3,500 sq ft",
      "3,500+ sq ft",
      "Not sure",
    ],
  },
  {
    id: "stories",
    type: "choice",
    text: "How many stories is the home?",
    options: ["1 story", "2 stories", "3+ stories", "Not sure"],
  },
  {
    id: "roofComplexity",
    type: "choice",
    text: "How complex is the roof shape?",
    options: [
      "Simple roof",
      "A few peaks and valleys",
      "Lots of peaks, valleys, or dormers",
      "Very steep roof",
      "Not sure",
    ],
  },
  {
    id: "roofCondition",
    type: "choice",
    text: "What condition is the roof in?",
    options: [
      "Just old or worn",
      "Missing shingles",
      "Hail or wind damage",
      "Leak or ceiling stains",
      "Major visible damage",
      "Not sure",
    ],
  },
  {
    id: "insurance",
    type: "choice",
    text: "Do you have homeowners insurance?",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "timeline",
    type: "choice",
    text: "How soon do you want someone to look at it?",
    options: [
      "ASAP",
      "This week",
      "This month",
      "Just checking price for now",
    ],
  },
];
