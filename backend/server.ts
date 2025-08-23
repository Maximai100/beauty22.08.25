import express from 'express';
import cors from 'cors';
import * as crypto from 'crypto';

// --- Type Definitions (from frontend/types.ts) ---
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface PortfolioImage {
  id: string;
  url: string;
  alt: string;
}

export interface Theme {
  primary: string;
  background: string;
  text: string;
  card: string;
}

export interface HeroData {
    title: string;
    subtitle: string;
    cta: string;
    backgroundImage: string;
}

export interface AboutData {
    text: string;
    imageUrl: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  visitHistory: Date[];
}

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: string; // ISO string
  time: string; // HH:mm
}

export interface SocialData {
    instagram: string;
    telegram: string;
    vk: string;
}

export interface ContactData {
    address: string;
    phone: string;
    email: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  text: string;
  rating: number; // 1 to 5
}

export interface LandingPageData {
  hero: HeroData;
  about: AboutData;
  services: Service[];
  portfolio: PortfolioImage[];
  theme: Theme;
  appointments: Appointment[];
  clients: Client[];
  contact: ContactData;
  socials: SocialData;
  testimonials: Testimonial[];
}

// --- Initial Data (from frontend/constants.ts) ---
const getInitialData = (): LandingPageData => ({
  hero: {
    title: "Студия красоты Анны",
    subtitle: "Эксперт по макияжу и нейл-арту",
    cta: "Записаться",
    backgroundImage: 'https://picsum.photos/seed/bg/1200/800',
  },
  about: {
    text: "Имея более 10 лет опыта в индустрии красоты, я посвящаю себя предоставлению высококачественных услуг, которые помогут вам почувствовать себя красивыми и уверенными. Моя студия — это место релаксации и преображения. Я специализируюсь на свадебном макияже, креативном нейл-арте и персональных консультациях по уходу за кожей.",
    imageUrl: 'https://picsum.photos/seed/master/400/400',
  },
  services: [
    { id: '1', name: 'Классический маникюр', description: 'Вечная классика для красивых ногтей.', price: 1500, duration: 60 },
    { id: '2', name: 'Гелевый педикюр', description: 'Долговечный цвет и блеск для ваших ногтей.', price: 2500, duration: 75 },
    { id: '3', name: 'Свадебный макияж', description: 'Выглядите сногсшибательно в ваш особенный день.', price: 5000, duration: 120 },
    { id: '4', name: "Ламинирование ресниц", description: "Подчеркните красоту ваших натуральных ресниц.", price: 2000, duration: 60 },
  ],
  portfolio: [
    { id: '1', url: 'https://picsum.photos/seed/makeup1/600/400', alt: 'Элегантный макияж' },
    { id: '2', url: 'https://picsum.photos/seed/nails1/600/400', alt: 'Сложный нейл-арт' },
    { id: '3', url: 'https://picsum.photos/seed/bride/600/400', alt: 'Свадебный образ' },
    { id: '4', url: 'https://picsum.photos/seed/nails2/600/400', alt: 'Гелевый дизайн ногтей' },
  ],
  theme: {
    primary: '#D946EF', // fuchsia-500
    background: '#FFFFFF', // white
    text: '#1F2937', // gray-800
    card: '#F9FAFB' // gray-50
  },
  appointments: [
    { id: '1', clientName: 'Анна Иванова', serviceName: 'Классический маникюр', date: new Date().toISOString().split('T')[0], time: '10:00' },
    { id: '2', clientName: 'Елена Смирнова', serviceName: 'Свадебный макияж', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '14:30' },
  ],
  clients: [
    { id: '1', name: 'Анна Иванова', phone: '+7-912-345-67-89', email: 'anna.i@example.com', notes: 'Предпочитает светло-розовый лак.', visitHistory: [new Date()] },
    { id: '2', name: 'Елена Смирнова', phone: '+7-923-456-78-90', email: 'elena.s@example.com', notes: 'Аллергия на латекс.', visitHistory: [new Date(Date.now() - 86400000 * 10)] },
  ],
  contact: {
    address: 'г. Москва, ул. Красивая, д. 15',
    phone: '+7 (495) 123-45-67',
    email: 'hello@annabeauty.com'
  },
  socials: {
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    vk: 'https://vk.com'
  },
  testimonials: [
    { id: 't1', clientName: 'Мария К.', text: 'Анна - настоящий профессионал! Мой свадебный макияж был безупречен и держался весь день. Огромное спасибо!', rating: 5 },
    { id: 't2', clientName: 'Светлана В.', text: 'Всегда делаю маникюр только здесь. Ногти выглядят идеально, а атмосфера в студии очень расслабляет.', rating: 5 },
    { id: 't3', clientName: 'Екатерина П.', text: 'Очень довольна ламинированием ресниц. Эффект потрясающий, взгляд стал более открытым и выразительным.', rating: 4 },
  ]
});


const app: express.Express = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images

// In-memory "database"
let siteData: LandingPageData = getInitialData();

// --- API Endpoints ---

// GET /api/data - Retrieve current site data
app.get('/api/data', (req: express.Request, res: express.Response) => {
  res.json(siteData);
});

// PUT /api/data - Update site data
app.put('/api/data', (req: express.Request, res: express.Response) => {
  const newData = req.body as LandingPageData;
  // Basic validation could be added here
  if (!newData || !newData.hero || !newData.services) {
    return res.status(400).json({ message: 'Invalid data format provided.' });
  }
  siteData = newData;
  console.log('Data updated successfully.');
  res.status(200).json({ message: 'Data updated successfully' });
});

// POST /api/reset - Reset data to initial state
app.post('/api/reset', (req: express.Request, res: express.Response) => {
  siteData = getInitialData();
  console.log('Data has been reset to initial state.');
  res.json(siteData);
});


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});