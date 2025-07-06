
import { format } from 'date-fns';
import lameiImg from '/src/asset/plants/lamei.png';
import purpleWisteriaImg from '/src/asset/plants/purple_wisteria.png';
export interface PlantMemory {
  id: string;
  text?: string;
  date: Date;
  photoUrl?: string;
  weather?: string;
  location?: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  dateCollected: Date;
  imageUrl: string;
  description: string;
  hasMemory: boolean;
  memories: PlantMemory[];
  category: string;
}

export const dummyPlants: Plant[] = [
  {
    id: '1',
    name: 'Wintersweet',
    scientificName: 'Chimonanthus praecox',
    dateCollected: new Date(2024, 12, 28),
    imageUrl: lameiImg,
    description: 'Stumbled upon this delicate yellow bloom on a chilly morning walk. Its sweet fragrance stood out amidst the bare branches.',
    hasMemory: true,
    memories: [
      {
        id: '1-1',
        text: 'Cold wind, quiet path—then this little bloom. Winter suddenly felt softer.',
        date: new Date(2024, 12, 28),
        photoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
        weather: 'Cold & Clear',
        location: 'Campus Lake'
      }
    ],
    category: 'Flower'
  },
  {
    id: '2',
    name: 'Purple Wisteria',
    scientificName: 'Wisteria sinensis',
    dateCollected: new Date(2024, 12, 3),
    imageUrl: purpleWisteriaImg,
    description: 'A cascading cluster of fragrant flowers,often seen hanging from garden trellises.',
    hasMemory: true,
    memories: [
    ],
    category: 'Flower'
  },
  {
    id: '3',
    name: 'Fern',
    scientificName: 'Dryopteris filix-mas',
    dateCollected: new Date(2023, 5, 10),
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    description: 'A woodland fern with feathery fronds that curl outward from the center.',
    hasMemory: false,
    memories: [],
    category: 'Fern'
  },
 /* {
    id: '4',
    name: 'White Daisy',
    scientificName: 'Leucanthemum vulgare',
    dateCollected: new Date(2023, 4, 5),
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    description: 'A classic daisy with white petals and a yellow center.',
    hasMemory: false,
    memories: [
      {
        id: '4-1',
        text: 'Found these growing wild by the lake on our camping trip.',
        date: new Date(2023, 4, 5),
        photoUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
        weather: 'Partly cloudy',
        location: 'Lake Serenity'
      }
    ],
    category: 'Flower'
  },*/
  {
    id: '5',
    name: 'Pine Needle',
    scientificName: 'Pinus sylvestris',
    dateCollected: new Date(2023, 11, 12),
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    description: 'Needle-like leaves from a common pine tree.',
    hasMemory: false,
    memories: [],
    category: 'Tree'
  }
];

export const formatDateString = (date: Date) => {
  return format(date, 'MMM d, yyyy');
};

export const getRecentlyCollected = (): Plant[] => {
  return [...dummyPlants].filter(x=>x.hasMemory).sort((a, b) =>
    b.dateCollected.getTime() - a.dateCollected.getTime()
  ).slice(0, 3);
};

export const getPlantsByCategory = (): Record<string, Plant[]> => {
  const categories: Record<string, Plant[]> = {};
  
  dummyPlants.forEach(plant => {
    if (!categories[plant.category]) {
      categories[plant.category] = [];
    }
    categories[plant.category].push(plant);
  });
  
  return categories;
};

export const getCollectionStats = () => {
  const totalPlants = dummyPlants.length;
  const plantsWithMemories = dummyPlants.filter(p => p.hasMemory).length;
  const categories = Object.keys(getPlantsByCategory()).length;
  
  return {
    totalPlants,
    plantsWithMemories,
    categories,
    completionRate: Math.round((plantsWithMemories / totalPlants) * 100)
  };
};
