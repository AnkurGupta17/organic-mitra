export enum Screen {
  DASHBOARD = 'DASHBOARD',
  CROP_SELECTION = 'CROP_SELECTION',
  FARMING_GUIDE = 'FARMING_GUIDE',
  STEP_DETAIL = 'STEP_DETAIL',
  PEST_IDENTIFIER = 'PEST_IDENTIFIER',
  CALCULATOR = 'CALCULATOR',
  MARKET_CERT = 'MARKET_CERT',
  EXPERT_CONNECT = 'EXPERT_CONNECT',
  LEARNING_HUB = 'LEARNING_HUB',
  NATURAL_FARMING = 'NATURAL_FARMING',
  SOIL_TRACKER = 'SOIL_TRACKER'
}

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  soilType: string[];
}

export interface GuideStep {
  title: string;
  hindiTitle: string;
  description: string;
  hindiDescription: string;
  image?: string;
  videoUrl?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  hindiCondition: string;
  location: string;
}
