
import { format } from 'date-fns';
import lameiImg from '/src/asset/plants/lamei.png';
import purpleWisteriaImg from '/src/asset/plants/purple_wisteria.png';

export interface PlantMemory {
  id: string;
  text: string;
  date: Date;
  photoUrl: string;
  weather: string;
  location: string;
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

export let dummyPlants: Plant[] = [
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
        photoUrl: '/lovable-uploads/97a5196c-3fd0-4c16-963e-fb004a6b0e24.png',
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
      {
        id: '2-1',
        text: 'Purple cascades in the garden, a symphony of fragrance and color.',
        date: new Date(2024, 12, 3),
        photoUrl: '/lovable-uploads/61ab6b64-c04b-46f2-9c1d-69b1681e14de.png',
        weather: 'Sunny',
        location: 'Botanical Garden'
      }
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
  {
    id: '4',
    name: 'Lily',
    scientificName: 'Lilium candidum',
    dateCollected: new Date(2024, 11, 20),
    imageUrl: '/lovable-uploads/c3fea6cd-54a5-4d11-a8c7-2a343cd77b1c.png',
    description: 'Pure white petals with golden center, found in the botanical garden on a sunny afternoon.',
    hasMemory: true,
    memories: [
      {
        id: '4-1',
        text: 'Sunlight touched petals, gentle and peaceful.',
        date: new Date(2024, 11, 20),
        photoUrl: '/lovable-uploads/03167071-a082-4f56-a327-69e53cd14816.png',
        weather: 'Sunny',
        location: 'Botanical Garden'
      }
    ],
    category: 'Flower'
  },
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

// 添加更新植物的函数
export const updatePlantWithMemory = (plantId: string, memory: Omit<PlantMemory, 'id'>) => {
  const memoryWithId: PlantMemory = {
    ...memory,
    id: `${plantId}-${Date.now()}`
  };
  
  dummyPlants = dummyPlants.map(plant => {
    if (plant.id === plantId) {
      return {
        ...plant,
        hasMemory: true,
        memories: [...plant.memories, memoryWithId]
      };
    }
    return plant;
  });
  
  return memoryWithId;
};

// 获取植物的函数
export const getPlantById = (id: string): Plant | undefined => {
  return dummyPlants.find(plant => plant.id === id);
};

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
