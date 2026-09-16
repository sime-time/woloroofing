// Use home size as the base range:
export function getBaseRange(homeSize: string): [number, number] {
  switch (homeSize) {
    case "Under 1,200 sq ft":
      return [8000, 14000];
    case "1,200-1,800 sq ft":
      return [10000, 18000];
    case "1,800-2,500 sq ft":
      return [13000, 24000];
    case "2,500-3,500 sq ft":
      return [18000, 34000];
    case "3,500+ sq ft":
      return [28000, 55000];
    default:
      return [12000, 28000];
  }
}

// Apply multipliers based on quiz answers
export function getRoofTypeMultiplier(roofType: string): [number, number] {
  switch (roofType) {
    case "Asphalt shingles":
      return [1, 1];
    case "Metal roof":
      return [1.6, 2.2];
    case "Flat or low-slope roof":
      return [1.2, 1.6];
    case "Tile, slate, or specialty roof":
      return [2, 3];
    default:
      return [0.9, 1.2];
  }
}

export function getStoryMultiplier(stories: string): [number, number] {
  switch (stories) {
    case "1 story":
      return [1, 1];
    case "2 stories":
      return [1.08, 1.15];
    case "3+ stories":
      return [1.18, 1.3];
    default:
      return [0.95, 1.1];
  }
}

export function getComplexityMultiplier(complexity: string): [number, number] {
  switch (complexity) {
    case "Simple roof":
      return [1, 1];
    case "A few peaks and valleys":
      return [1.08, 1.15];
    case "Lots of peaks, valleys, or dormers":
      return [1.18, 1.35];
    case "Very steep roof":
      return [1.2, 1.4];
    default:
      return [0.9, 1.15];
  }
}

export function getConditionMultiplier(condition: string): [number, number] {
  switch (condition) {
    case "Just old or worn":
      return [1, 1];
    case "Missing shingles":
      return [1.05, 1.15];
    case "Hail or wind damage":
      return [1.05, 1.2];
    case "Leak or ceiling stains":
      return [1.1, 1.25];
    case "Major visible damage":
      return [1.2, 1.4];
    default:
      return [0.95, 1.1];
  }
}
