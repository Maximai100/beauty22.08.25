
import type { LandingPageData, Theme, Testimonial } from './types';

export const INITIAL_DATA: LandingPageData = {
  hero: {
    title: "Студия красоты Анны",
    subtitle: "Эксперт по макияжу и нейл-арту",
    cta: "Записаться",
  },
  about: "Имея более 10 лет опыта в индустрии красоты, я посвящаю себя предоставлению высококачественных услуг, которые помогут вам почувствовать себя красивыми и уверенными. Моя студия — это место релаксации и преображения. Я специализируюсь на свадебном макияже, креативном нейл-арте и персональных консультациях по уходу за кожей.",
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
};

export const THEME_PRESETS: { name: string, theme: Theme }[] = [
    { name: 'Сияние фуксии', theme: { primary: '#D946EF', background: '#FFFFFF', text: '#1F2937', card: '#F9FAFB' } },
    { name: 'Лепесток розы', theme: { primary: '#F472B6', background: '#FEF2F2', text: '#881337', card: '#FFFFFF' } },
    { name: 'Мятная свежесть', theme: { primary: '#10B981', background: '#F0FDFA', text: '#064E3B', card: '#FFFFFF' } },
    { name: 'Лавандовая мечта', theme: { primary: '#8B5CF6', background: '#F5F3FF', text: '#4C1D95', card: '#FFFFFF' } },
    { name: 'Золотой час', theme: { primary: '#F59E0B', background: '#FFFBEB', text: '#78350F', card: '#FFFFFF' } },
    { name: 'Океанский бриз', theme: { primary: '#3B82F6', background: '#EFF6FF', text: '#1E3A8A', card: '#FFFFFF' } },
];