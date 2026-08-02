import { Screen, Crop } from './types';

export const COLORS = {
  primary: '#2D5A27', // Deep Organic Green
  secondary: '#8B4513', // Earthy Brown
  accent: '#F4D03F', // Soft Harvest Yellow
  background: '#F9F7F2', // Warm Paper/Soil White
  text: '#1A1A1A',
  muted: '#666666',
  white: '#FFFFFF',
};

export const CROPS: Crop[] = [
  { id: 'wheat', name: 'Wheat', hindiName: 'गेहूं', icon: '🌾', season: 'Rabi', soilType: ['Loamy', 'Clayey'] },
  { id: 'paddy', name: 'Paddy', hindiName: 'धान', icon: '🍚', season: 'Kharif', soilType: ['Clayey'] },
  { id: 'maize', name: 'Maize', hindiName: 'मक्का', icon: '🌽', season: 'Kharif', soilType: ['Loamy'] },
  { id: 'soybean', name: 'Soybean', hindiName: 'सोयाबीन', icon: '🌱', season: 'Kharif', soilType: ['Black Soil'] },
  { id: 'mustard', name: 'Mustard', hindiName: 'सरसों', icon: '🌼', season: 'Rabi', soilType: ['Sandy Loam'] },
];

export const CROP_GUIDES: Record<string, any[]> = {
  wheat: [
    { 
      title: 'Soil Preparation', hindi: 'मिट्टी की तैयारी', icon: '🚜',
      content: 'Deep plowing in summer. Apply 10 tons of FYM or Vermicompost per hectare. Ensure field is well-leveled for wheat.',
      hindiContent: 'गर्मियों में गहरी जुताई करें। प्रति हेक्टेयर 10 टन गोबर की खाद या वर्मीकम्पोस्ट डालें। गेहूं के लिए खेत को अच्छी तरह समतल करें।'
    },
    { 
      title: 'Seed Treatment', hindi: 'बीज उपचार', icon: '🧪',
      content: 'Treat wheat seeds with Beejamrit or Azotobacter (250g/10kg seed) to boost germination and prevent diseases.',
      hindiContent: 'अंकुरण बढ़ाने और रोगों को रोकने के लिए गेहूं के बीजों को बीजामृत या एज़ोटोबैक्टर (250 ग्राम/10 किलो बीज) से उपचारित करें।'
    },
    { 
      title: 'Sowing Method', hindi: 'बुवाई की विधि', icon: '🌱',
      content: 'Sow wheat in rows with 22.5 cm spacing. Use seed drill for uniform depth of 4-5 cm.',
      hindiContent: 'गेहूं की बुवाई 22.5 सेमी की दूरी पर कतारों में करें। 4-5 सेमी की समान गहराई के लिए सीड ड्रिल का उपयोग करें।'
    },
    { 
      title: 'Organic Fertilizers', hindi: 'जैविक खाद', icon: '💩',
      content: 'Apply Jeevamrit with irrigation at 21 days (CRI stage) and 45 days. Use Ghan-Jeevamrit during sowing.',
      hindiContent: '21 दिन (CRI अवस्था) और 45 दिन पर सिंचाई के साथ जीवामृत डालें। बुवाई के समय घन-जीवामृत का प्रयोग करें।'
    }
  ],
  paddy: [
    { 
      title: 'Nursery Preparation', hindi: 'नर्सरी की तैयारी', icon: '🌱',
      content: 'Prepare raised beds for nursery. Use 500kg Vermicompost for 1/10th hectare nursery area.',
      hindiContent: 'नर्सरी के लिए उठी हुई क्यारियाँ तैयार करें। 1/10 हेक्टेयर नर्सरी क्षेत्र के लिए 500 किग्रा वर्मीकम्पोस्ट का उपयोग करें।'
    },
    { 
      title: 'Transplanting', hindi: 'रोपाई', icon: '🌾',
      content: 'Transplant 21-25 days old seedlings. Maintain 20x15 cm spacing. Dip roots in Beejamrit for 30 mins before planting.',
      hindiContent: '21-25 दिन पुराने पौधों की रोपाई करें। 20x15 सेमी की दूरी बनाए रखें। रोपण से पहले जड़ों को 30 मिनट के लिए बीजामृत में डुबोएं।'
    },
    { 
      title: 'Water Management', hindi: 'जल प्रबंधन', icon: '💧',
      content: 'Keep 2-5 cm water level in the field. Use Alternate Wetting and Drying (AWD) to save water and reduce methane.',
      hindiContent: 'खेत में 2-5 सेमी जल स्तर रखें। पानी बचाने और मीथेन कम करने के लिए अल्टरनेट वेटिंग एंड ड्राइंग (AWD) का उपयोग करें।'
    },
    { 
      title: 'Pest Control', hindi: 'कीट नियंत्रण', icon: '🐛',
      content: 'Use Pheromone traps for Stem Borer. Spray Dashparni Ark or Neem oil for Leaf Folder control.',
      hindiContent: 'तना छेदक के लिए फेरोमोन ट्रैप का प्रयोग करें। लीफ फोल्डर नियंत्रण के लिए दशपर्णी अर्क या नीम के तेल का छिड़काव करें।'
    }
  ],
  maize: [
    { 
      title: 'Field Preparation', hindi: 'खेत की तैयारी', icon: '🚜',
      content: 'Maize requires well-drained soil. Apply 12-15 tons of FYM during last plowing.',
      hindiContent: 'मक्के के लिए अच्छी जल निकासी वाली मिट्टी की आवश्यकता होती है। अंतिम जुताई के दौरान 12-15 टन गोबर की खाद डालें।'
    },
    { 
      title: 'Sowing', hindi: 'बुवाई', icon: '🌽',
      content: 'Maintain 60cm row spacing and 20cm plant spacing. Sow at 3-5 cm depth.',
      hindiContent: '60 सेमी कतार की दूरी और 20 सेमी पौधे की दूरी बनाए रखें। 3-5 सेमी गहराई पर बोएं।'
    },
    { 
      title: 'Nutrient Management', hindi: 'पोषक तत्व प्रबंधन', icon: '💩',
      content: 'Apply Jeevamrit at knee-high stage and silking stage. Use intercropping with legumes for nitrogen.',
      hindiContent: 'घुटने तक की ऊंचाई और सिल्किंग अवस्था में जीवामृत डालें। नाइट्रोजन के लिए दलहन के साथ अंतःफसल का प्रयोग करें।'
    }
  ],
  soybean: [
    { 
      title: 'Seed Treatment', hindi: 'बीज उपचार', icon: '🧪',
      content: 'Treat with Rhizobium culture (5g/kg seed). Avoid deep sowing (not more than 3cm).',
      hindiContent: 'राइजोबियम कल्चर (5 ग्राम/किग्रा बीज) से उपचारित करें। गहरी बुवाई से बचें (3 सेमी से अधिक नहीं)।'
    },
    { 
      title: 'Weed Management', hindi: 'खरपतवार प्रबंधन', icon: '🌿',
      content: 'First weeding at 20-25 days. Use hand hoeing to improve soil aeration.',
      hindiContent: '20-25 दिनों में पहली निराई। मिट्टी के वातन में सुधार के लिए हैंड होइंग का उपयोग करें।'
    }
  ],
  mustard: [
    { 
      title: 'Soil Prep', hindi: 'मिट्टी की तैयारी', icon: '🚜',
      content: 'Requires fine tilth. Apply sulfur-rich organic matter like Gypsum if needed.',
      hindiContent: 'महीन जुताई की आवश्यकता होती है। यदि आवश्यक हो तो जिप्सम जैसे सल्फर युक्त जैविक पदार्थ डालें।'
    },
    { 
      title: 'Aphid Control', hindi: 'एफिड नियंत्रण', icon: '🐛',
      content: 'Spray Garlic-Chilli extract or Neem oil to control mustard aphids naturally.',
      hindiContent: 'सरसों के एफिड्स को प्राकृतिक रूप से नियंत्रित करने के लिए लहसुन-मिर्च के अर्क या नीम के तेल का छिड़काव करें।'
    }
  ]
};

export const ATTRIBUTION = {
  concept: "Anjna Gupta",
  role: "Program Assistant",
  organization: "Krishi Vigyan Kendra, Jabalpur (M.P.)",
  ownership: "Concept & Intellectual Ownership: Anjna Gupta, Program Assistant, Krishi Vigyan Kendra, Jabalpur (M.P.)"
};

/**
 * CENTRAL VIDEO REPOSITORY
 * Replace these YouTube IDs with your own video IDs.
 * To get the ID, look at the YouTube URL: 
 * https://www.youtube.com/watch?v=VIDEO_ID
 * or https://youtu.be/VIDEO_ID
 */
export const YOUTUBE_VIDEOS = {
  // Training Videos (Learning Hub)
  JEEVAMRIT_GUIDE: '_V-wMGVQw9A',
  PEST_CONTROL_ORGANIC: 'QOf3zzLeXZQ',
  VERMICOMPOST_UNIT: 'GQBYp6_RHdA',
  
  // Crop Specific Guides
  WHEAT_GUIDE: 'vAxjZ1q-Yuk',
  PADDY_GUIDE: 'HTNAG57k2To',
  MAIZE_GUIDE: 'ZvHJTlbfS38',
  SOYBEAN_GUIDE: 'hyvQcXHc3xU',
  MUSTARD_GUIDE: 'MtePOJ7iT0M',
};
