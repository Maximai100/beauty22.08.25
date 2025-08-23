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