export interface AppEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  isSaved: boolean;
  isFavorite: boolean;
  lat: number;
  lng: number;
  timestamp:number;
}

export const mockEvents: AppEvent[] = [
  {
    id: 1,
    title: "Rock for People 2026",
    description: "Lorem ipsum...",
    location: "Park 360, Hradec Králové",
    imageUrl: "https://picsum.photos/seed/rock/400/250",
    isSaved: true,
    isFavorite: false,
    lat: 50.245, lng: 15.840,
    timestamp: new Date(2026, 3, 18).getTime() 
  },
  {
    id: 2,
    title: "Divadelní představení Hamlet",
    description: "Lorem ipsum...",
    location: "Národní divadlo, Praha",
    imageUrl: "https://picsum.photos/seed/divadlo/400/250",
    isSaved: true,
    isFavorite: true,
    lat: 50.081, lng: 14.413,
    timestamp: new Date(2026, 3, 18).getTime()
  },
  {
    id: 3,
    title: "Jazzový večer v Brně",
    description: "Lorem ipsum...",
    location: "Metro Music Bar, Brno",
    imageUrl: "https://picsum.photos/seed/jazz/400/250",
    isSaved: true,
    isFavorite: true,
    lat: 49.195, lng: 16.606,
    timestamp: new Date(2026, 3, 18).getTime() 
  }
];