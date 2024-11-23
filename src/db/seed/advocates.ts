const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const firstNames = [
  "John", "Jane", "Alice", "Michael", "Emily", "Chris",
  "Jessica", "David", "Laura", "Daniel", "Sarah", "James",
  "Megan", "Joshua", "Amanda"
];

const lastNames = [
  "Doe", "Smith", "Johnson", "Brown", "Davis", "Martinez",
  "Taylor", "Harris", "Clark", "Lewis", "Lee", "King",
  "Green", "Walker", "Hall"
];

const degrees = ["MD", "PhD", "MSW"];
const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "San Francisco", "Columbus", "Fort Worth"
];

const randomSpecialty = (): string[] => {
  const random1 = Math.floor(Math.random() * specialties.length);
  const random2 = Math.floor(Math.random() * (specialties.length - random1)) + random1 + 1;
  return specialties.slice(random1, random2);
};

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateAdvocates = (count: number) => {
  const advocates = [];
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const city = getRandomElement(cities);
    const degree = getRandomElement(degrees);
    const yearsOfExperience = Math.floor(Math.random() * 20) + 1; 
    const phoneNumber = Math.floor(1000000000 + Math.random() * 9000000000); 
    const specialtiesList = randomSpecialty();

    advocates.push({
      firstName,
      lastName,
      city,
      degree,
      yearsOfExperience,
      phoneNumber,
      specialties: specialtiesList,
    });
  }
  return advocates;
};

export { generateAdvocates };
