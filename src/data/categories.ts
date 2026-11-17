import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing Service',
    hindiName: 'प्लंबिंग सेवा',
    tagline: 'Tap leaks, pipe repair, water tank & bathroom fittings',
    iconName: 'Wrench',
    startingPrice: 199,
    description: 'Expert plumbing for tap replacement, leakage repair, blockage clearing, and sanitaryware fitting.',
    popularServices: [
      'Tap & Shower Repair',
      'Pipe Leakage Detection',
      'Drain & Blockage Clearing',
      'Water Tank Connection',
      'Washbasin & Sink Fitting'
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Repair',
    hindiName: 'इलेक्ट्रिकल रिपेयर',
    tagline: 'Switchboards, MCB tripping, fan, lighting & rewiring',
    iconName: 'Zap',
    startingPrice: 199,
    description: 'Certified electrical repairs for home switches, tripping breakers, lights, fans, and wiring issues.',
    popularServices: [
      'Switchboard & Socket Repair',
      'MCB Fuse & Tripping Fix',
      'Ceiling Fan Installation & Repair',
      'Tubelight & Chandelier Fitting',
      'Complete House Inspection'
    ],
    safetyNotice: 'SAFETY WARNING: Electrical faults can be life-threatening. Do not touch sparking switches or wet wires. Turn off the main MCB breaker and allow a qualified technician to inspect.'
  },
  {
    id: 'ac-repair',
    name: 'AC Servicing & Repair',
    hindiName: 'एसी सर्विसिंग और रिपेयर',
    tagline: 'Deep foam jet service, cooling issues, gas refill & installation',
    iconName: 'Wind',
    startingPrice: 499,
    description: 'Comprehensive AC maintenance including jet clean, copper coil inspection, refrigerant top-up, and cooling troubleshooting.',
    popularServices: [
      'Power Jet Chemical Cleaning',
      'Low Cooling / Gas Leak Check',
      'Water Dropping / Drainage Issue',
      'Split & Window AC Installation',
      'Compressor & PCB Diagnostics'
    ]
  },
  {
    id: 'appliance-repair',
    name: 'Appliance Repair',
    hindiName: 'उपकरण रिपेयर',
    tagline: 'Washing machine, refrigerator, microwave & water purifier',
    iconName: 'Cpu',
    startingPrice: 249,
    description: 'Multi-brand doorstep diagnostics and repair for essential kitchen and laundry home appliances.',
    popularServices: [
      'Washing Machine Drum & Motor Repair',
      'Refrigerator Not Cooling Fix',
      'Microwave Magnetron & Heating',
      'RO Water Purifier Filter Change',
      'Mixer Grinder & Induction Plate'
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Woodwork',
    hindiName: 'बढ़ई काम',
    tagline: 'Cupboard hinges, door locks, furniture repair & drill work',
    iconName: 'Hammer',
    startingPrice: 199,
    description: 'Skilled woodwork, hinge alignment, main door locks, modular kitchen adjustments, and general drill & hang.',
    popularServices: [
      'Door Lock & Latch Replacement',
      'Cabinet & Wardrobe Hinge Repair',
      'Bed & Sofa Frame Restoration',
      'Wall Shelf & Curtain Rod Drill',
      'Custom Wood Trimming & Polishing'
    ]
  },
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    hindiName: 'घर की सफाई',
    tagline: 'Deep bathroom clean, sofa shampooing & kitchen degreasing',
    iconName: 'Sparkles',
    startingPrice: 299,
    description: 'Intense mechanical cleaning, hard water stain removal, upholstery foam extraction, and kitchen sanitation.',
    popularServices: [
      'Intense Bathroom Stain Removal',
      'Fabric Sofa Foam Shampooing',
      'Modular Kitchen Degreasing',
      'Full Home Deep Sanitation',
      'Balcony & Floor Scrubbing'
    ]
  }
];

export const getCategoryById = (id: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find(c => c.id === id);
};
