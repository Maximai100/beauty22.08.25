import React, { useState, useRef } from 'react';
import type { LandingPageData, Service, PortfolioImage, Theme, Appointment, Client, ContactData, SocialData, Testimonial, HeroData, AboutData } from '../types';
import { THEME_PRESETS } from '../constants';
import { GoogleGenAI } from "@google/genai";

// AI Initialization
let ai: GoogleGenAI | null = null;
try {
  // Ensure the environment variable is handled by the execution environment.
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI:", e);
}


// Icons as components
const ContentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const PortfolioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const DesignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 2L4 14h12V4z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const CrmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 4.077a4.5 4.5 0 00-4.884 0C.636 10.932 0 12.146 0 13.5V15h9v-1.5c0-1.354-.636-2.568-1.558-3.423zM15.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17 10a4.5 4.5 0 00-4.5-4.5 1 1 0 000 2A2.5 2.5 0 0115 10a1 1 0 002 0zm-3.5 1.5a1 1 0 00-1 1V15h4v-2.5c0-1.354-.636-2.568-1.558-3.423a4.502 4.502 0 00-1.442.923z" /></svg>;
const ContactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const TestimonialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const MagicWandIcon = ({className = "h-4 w-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M11.94 2.06c-.28-.56-1.03-.56-1.3 0L9.42 4.4c-.1.2-.27.34-.47.42l-2.6.98c-.6.22-.84.98-.42 1.4L7.8 8.8c.16.16.22.39.16.6l-.97 2.62c-.22.6.54.96 1.1.56l2.3-1.58c.18-.12.4-.12.58 0l2.3 1.58c.57.4 1.32.04 1.1-.56l-.97-2.62a.74.74 0 01.16-.6l1.87-1.6c.42-.42.18-1.18-.42-1.4l-2.6-.98a.74.74 0 01-.47-.42L11.94 2.06zM5 14a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg>;
const Spinner = ({className = "h-4 w-4"}) => <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.004 9.057a1 1 0 011.272.728A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.728-1.272z" clipRule="evenodd" /></svg>;
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }: { filled: boolean; onClick?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; }) => (
    <svg onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


type Tab = 'content' | 'services' | 'portfolio' | 'design' | 'bookings' | 'crm' | 'contact' | 'testimonials';

interface BuilderSidebarProps {
  data: LandingPageData;
  onUpdateHero: (field: keyof HeroData, value: string) => void;
  onUpdateAbout: (value: AboutData) => void;
  onUpdateServices: (services: Service[]) => void;
  onUpdatePortfolio: (images: PortfolioImage[]) => void;
  onUpdateTheme: (primary: string, background: string, text: string, card: string) => void;
  onUpdateAppointments: (appointments: Appointment[]) => void;
  onUpdateClients: (clients: Client[]) => void;
  onUpdateContactAndSocials: (contact: ContactData, socials: SocialData) => void;
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  onReset: () => void;
  addToast: (message: string, type?: 'success' | 'error') => void;
}

interface TabButtonProps {
    tab: Tab;
    icon: React.ReactNode;
    children: React.ReactNode;
    activeTab: Tab;
    onClick: (tab: Tab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, icon, children, activeTab, onClick }) => (
    <button
        onClick={() => onClick(tab)}
        className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-component transition-all duration-300 ease-smooth ${
        activeTab === tab ? 'bg-primary/10 text-primary-focus font-semibold' : 'text-text-secondary hover:bg-primary/5 hover:text-text-primary'
        }`}
    >
        {icon}
        <span className="font-medium">{children}</span>
    </button>
);

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  data, onUpdateHero, onUpdateAbout, onUpdateServices, onUpdatePortfolio, onUpdateTheme, onUpdateAppointments, onUpdateClients, onUpdateContactAndSocials, onUpdateTestimonials, onReset, addToast
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [isGeneratingAbout, setIsGeneratingAbout] = useState(false);
  const [generatingServiceIndex, setGeneratingServiceIndex] = useState<number | null>(null);

  const handleGenerateAbout = async () => {
    if (!ai) {
      addToast("Ошибка: AI сервис не доступен.", 'error');
      return;
    }
    setIsGeneratingAbout(true);
    try {
      const prompt = `Ты — профессиональный копирайтер для бьюти-индустрии. Напиши привлекательный и теплый текст для раздела "Обо мне" для бьюти-мастера, основываясь на этом тексте: "${data.about.text}". Улучши стиль, сделай его более личным и профессиональным. Ответ должен быть только текстом для раздела, без лишних вступлений. Язык: русский.`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });

      onUpdateAbout({ ...data.about, text: response.text.trim() });
      addToast("Текст 'Обо мне' обновлен с помощью AI!", 'success');
    } catch (error) {
      console.error("Error generating 'about' text:", error);
      addToast("Не удалось сгенерировать текст.", 'error');
    } finally {
      setIsGeneratingAbout(false);
    }
  };
  
  const handleGenerateServiceDescription = async (index: number, serviceName: string) => {
      if (!ai) {
        addToast("Ошибка: AI сервис не доступен.", 'error');
        return;
      }
      setGeneratingServiceIndex(index);
      try {
          const prompt = `Ты — профессиональный копирайтер для бьюти-индустрии. Напиши короткое (1-2 предложения) и привлекательное описание для услуги "${serviceName}". Описание должно быть на русском языке. Ответ должен содержать только текст описания.`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
          });
  
          const newServices = [...data.services];
          newServices[index].description = response.text.trim();
          onUpdateServices(newServices);
          addToast(`Описание для "${serviceName}" обновлено!`, 'success');
  
      } catch (error) {
          console.error("Error generating service description:", error);
          addToast("Не удалось сгенерировать описание.", 'error');
      } finally {
          setGeneratingServiceIndex(null);
      }
    };


  return (
    <aside className="w-96 bg-card h-screen flex flex-col shadow-lg border-r border-border">
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-text-primary font-heading">Конструктор сайта</h1>
        <p className="text-sm text-text-secondary">Настройте вашу страницу</p>
      </div>
      <nav className="p-4 space-y-1">
        <TabButton tab="content" icon={<ContentIcon />} activeTab={activeTab} onClick={setActiveTab}>Контент</TabButton>
        <TabButton tab="services" icon={<ServicesIcon />} activeTab={activeTab} onClick={setActiveTab}>Услуги</TabButton>
        <TabButton tab="portfolio" icon={<PortfolioIcon />} activeTab={activeTab} onClick={setActiveTab}>Портфолио</TabButton>
        <TabButton tab="testimonials" icon={<TestimonialIcon />} activeTab={activeTab} onClick={setActiveTab}>Отзывы</TabButton>
        <TabButton tab="design" icon={<DesignIcon />} activeTab={activeTab} onClick={setActiveTab}>Дизайн</TabButton>
        <TabButton tab="contact" icon={<ContactIcon />} activeTab={activeTab} onClick={setActiveTab}>Контакты</TabButton>
        <TabButton tab="bookings" icon={<CalendarIcon />} activeTab={activeTab} onClick={setActiveTab}>Записи</TabButton>
        <TabButton tab="crm" icon={<CrmIcon />} activeTab={activeTab} onClick={setActiveTab}>Клиенты (CRM)</TabButton>
      </nav>
      <div className="flex-1 p-6 overflow-y-auto bg-background">
        {activeTab === 'content' && <ContentEditor data={data} onUpdateHero={onUpdateHero} onUpdateAbout={onUpdateAbout} onGenerateAbout={handleGenerateAbout} isGenerating={isGeneratingAbout} addToast={addToast} />}
        {activeTab === 'services' && <ServiceEditor services={data.services} onUpdateServices={onUpdateServices} onGenerateDescription={handleGenerateServiceDescription} generatingIndex={generatingServiceIndex} />}
        {activeTab === 'portfolio' && <PortfolioEditor portfolio={data.portfolio} onUpdatePortfolio={onUpdatePortfolio} addToast={addToast} />}
        {activeTab === 'testimonials' && <TestimonialEditor testimonials={data.testimonials} onUpdateTestimonials={onUpdateTestimonials} addToast={addToast} />}
        {activeTab === 'design' && <DesignEditor currentTheme={data.theme} onUpdateTheme={onUpdateTheme} />}
        {activeTab === 'contact' && <ContactEditor contact={data.contact} socials={data.socials} onUpdate={onUpdateContactAndSocials} />}
        {activeTab === 'bookings' && <BookingManager appointments={data.appointments} onUpdateAppointments={onUpdateAppointments} services={data.services} addToast={addToast} />}
        {activeTab === 'crm' && <CrmManager clients={data.clients} onUpdateClients={onUpdateClients} addToast={addToast} />}
      </div>
       <div className="p-4 border-t border-border text-xs text-text-secondary bg-card">
        <button onClick={onReset} className="w-full mb-2 flex items-center justify-center py-2 px-4 border border-border rounded-component text-sm font-medium text-text-secondary hover:bg-background hover:text-text-primary transition-all duration-300 ease-smooth">
            <ResetIcon />
            Сбросить настройки
        </button>
        <p className="text-center">Конструктор сайтов v1.5 (Elegant UI)</p>
      </div>
    </aside>
  );
};

// Sub-components for each tab
const InputGroup: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; type?: string; placeholder?: string; }> = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <input id={name} name={name} {...props} className="w-full px-3 py-2 bg-card border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ease-smooth" />
  </div>
);

const TextareaGroup: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string; rows?: number }> = ({ label, name, rows = 5, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <textarea id={name} name={name} {...props} rows={rows} className="w-full px-3 py-2 bg-card border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ease-smooth" />
  </div>
);

const ContentEditor: React.FC<{ data: LandingPageData, onUpdateHero: (field: keyof HeroData, value: string) => void; onUpdateAbout: (value: AboutData) => void; onGenerateAbout: () => void; isGenerating: boolean; addToast: (message: string, type?: 'success' | 'error') => void; }> = ({ data, onUpdateHero, onUpdateAbout, onGenerateAbout, isGenerating, addToast }) => {
    const heroBgInputRef = useRef<HTMLInputElement>(null);
    const aboutImgInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result as string);
            addToast("Изображение обновлено!", 'success');
        };
        reader.readAsDataURL(file);
        event.target.value = ''; // Reset file input
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 font-heading">Главный экран</h3>
                <div className="p-4 border border-border rounded-card bg-card space-y-4">
                    <InputGroup label="Основной заголовок" name="title" value={data.hero.title} onChange={e => onUpdateHero('title', e.target.value)} />
                    <InputGroup label="Подзаголовок" name="subtitle" value={data.hero.subtitle} onChange={e => onUpdateHero('subtitle', e.target.value)} />
                    <InputGroup label="Текст на кнопке" name="cta" value={data.hero.cta} onChange={e => onUpdateHero('cta', e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Фоновое изображение</label>
                        <input type="file" accept="image/*" ref={heroBgInputRef} className="hidden" onChange={e => handleFileChange(e, url => onUpdateHero('backgroundImage', url))} />
                        <div className="mt-1 flex items-center gap-x-3">
                           <img src={data.hero.backgroundImage} alt="Фон" className="h-16 w-16 object-cover rounded-component bg-background border border-border" />
                           <button type="button" onClick={() => heroBgInputRef.current?.click()} className="rounded-component bg-card px-2.5 py-1.5 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-border hover:bg-background transition-all duration-300 ease-smooth">Изменить фон</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text-primary font-heading">Секция "Обо мне"</h3>
                    {ai && (
                        <button onClick={onGenerateAbout} disabled={isGenerating} className="group flex items-center space-x-1.5 px-2 py-1 rounded-component bg-primary/10 hover:bg-primary/20 transition-all duration-300 ease-smooth disabled:bg-background disabled:cursor-wait">
                            {isGenerating ? <Spinner className="h-4 w-4 text-primary" /> : <MagicWandIcon className="h-4 w-4 text-primary" />}
                            <span className="text-xs font-semibold text-primary-focus">{isGenerating ? 'Генерация...' : 'Улучшить текст'}</span>
                        </button>
                    )}
                </div>
                <div className="p-4 border border-border rounded-card bg-card space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Фотография</label>
                        <input type="file" accept="image/*" ref={aboutImgInputRef} className="hidden" onChange={e => handleFileChange(e, url => onUpdateAbout({ ...data.about, imageUrl: url }))} />
                        <div className="mt-1 flex items-center gap-x-3">
                           <img src={data.about.imageUrl} alt="Мастер" className="h-16 w-16 object-cover rounded-full bg-background border border-border" />
                           <button type="button" onClick={() => aboutImgInputRef.current?.click()} className="rounded-component bg-card px-2.5 py-1.5 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-border hover:bg-background transition-all duration-300 ease-smooth">Изменить фото</button>
                        </div>
                    </div>
                    <TextareaGroup label="Описание" name="about" value={data.about.text} onChange={e => onUpdateAbout({ ...data.about, text: e.target.value })} />
                </div>
            </div>
        </div>
    );
};

const ServiceEditor: React.FC<{ services: Service[], onUpdateServices: (services: Service[]) => void, onGenerateDescription: (index: number, name: string) => void; generatingIndex: number | null; }> = ({ services, onUpdateServices, onGenerateDescription, generatingIndex }) => {
  const handleUpdate = (index: number, field: keyof Service, value: string | number) => {
    const newServices = [...services];
    // @ts-ignore
    newServices[index][field] = value;
    onUpdateServices(newServices);
  };
  
  const addService = () => {
      const newService: Service = { id: Date.now().toString(), name: "Новая услуга", description: "Описание услуги", price: 0, duration: 30 };
      onUpdateServices([...services, newService]);
  };

  const removeService = (index: number) => {
      onUpdateServices(services.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary font-heading">Управление услугами</h3>
      {services.map((service, index) => (
        <div key={service.id} className="p-4 border border-border rounded-card space-y-3 bg-card relative">
           <button onClick={() => removeService(index)} className="absolute top-2 right-2 text-text-secondary/50 hover:text-error transition-colors duration-300 ease-smooth">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
           </button>
          <InputGroup label="Название услуги" name={`s_name_${index}`} value={service.name} onChange={e => handleUpdate(index, 'name', e.target.value)} />
          <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={`s_desc_${index}`} className="block text-sm font-medium text-text-secondary">Описание</label>
                {ai && (
                    <button onClick={() => onGenerateDescription(index, service.name)} disabled={generatingIndex === index} className="group flex items-center space-x-1 text-xs font-medium text-primary hover:text-primary-focus disabled:opacity-50 disabled:cursor-wait transition-all duration-300 ease-smooth">
                        {generatingIndex === index ? <Spinner className="h-3 w-3" /> : <MagicWandIcon className="h-3 w-3" />}
                        <span>Сгенерировать</span>
                    </button>
                )}
            </div>
            <textarea id={`s_desc_${index}`} name={`s_desc_${index}`} value={service.description} onChange={e => handleUpdate(index, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-card border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ease-smooth" />
          </div>

          <div className="flex space-x-2">
            <InputGroup label="Цена (₽)" name={`s_price_${index}`} type="number" value={String(service.price)} onChange={e => handleUpdate(index, 'price', Number(e.target.value))} />
            <InputGroup label="Длительность (мин)" name={`s_dur_${index}`} type="number" value={String(service.duration)} onChange={e => handleUpdate(index, 'duration', Number(e.target.value))} />
          </div>
        </div>
      ))}
      <button onClick={addService} className="w-full py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus transition-all duration-300 ease-smooth shadow-elegant">Добавить услугу</button>
    </div>
  );
};

const PortfolioEditor: React.FC<{ portfolio: PortfolioImage[], onUpdatePortfolio: (images: PortfolioImage[]) => void, addToast: (message: string, type?: 'success' | 'error') => void }> = ({ portfolio, onUpdatePortfolio, addToast }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newImage: PortfolioImage = {
                id: Date.now().toString(),
                url: reader.result as string,
                alt: file.name
            };
            onUpdatePortfolio([...portfolio, newImage]);
            addToast("Изображение добавлено!", 'success');
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (id: string) => {
        onUpdatePortfolio(portfolio.filter(img => img.id !== id));
        addToast("Изображение удалено.", 'success');
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary font-heading">Изображения портфолио</h3>
            <div className="grid grid-cols-2 gap-4">
                {portfolio.map(image => (
                    <div key={image.id} className="relative group">
                        <img src={image.url} alt={image.alt} className="rounded-card object-cover aspect-square border border-border" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-smooth rounded-card">
                             <button onClick={() => removeImage(image.id)} className="text-white p-2 bg-error/80 rounded-full hover:bg-error transition-all duration-300 ease-smooth">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                             </button>
                        </div>
                    </div>
                ))}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            <button onClick={() => fileInputRef.current?.click()} className="w-full mt-4 py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus transition-all duration-300 ease-smooth shadow-elegant">
                Добавить изображение
            </button>
        </div>
    );
};

const DesignEditor: React.FC<{ currentTheme: Theme, onUpdateTheme: (primary: string, background: string, text: string, card: string) => void }> = ({ currentTheme, onUpdateTheme }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary font-heading">Цветовая схема</h3>
            <p className="text-sm text-text-secondary">Выберите готовый шаблон или настройте цвета.</p>
            <div className="grid grid-cols-2 gap-4">
                {THEME_PRESETS.map(preset => (
                    <button key={preset.name} onClick={() => onUpdateTheme(preset.theme.primary, preset.theme.background, preset.theme.text, preset.theme.card)} className="p-2 border border-border rounded-card text-left hover:shadow-card-hover hover:border-primary/50 transition-all duration-300 ease-smooth bg-card">
                        <div className="flex items-center space-x-2">
                           <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.theme.primary }}></div>
                           <span className="text-sm font-medium text-text-primary">{preset.name}</span>
                        </div>
                        <div className="flex space-x-1 mt-2">
                           <div className="w-1/4 h-3 rounded-full" style={{ backgroundColor: preset.theme.primary }}></div>
                           <div className="w-1/4 h-3 rounded-full" style={{ backgroundColor: preset.theme.background }}></div>
                           <div className="w-1/4 h-3 rounded-full" style={{ backgroundColor: preset.theme.text }}></div>
                           <div className="w-1/4 h-3 rounded-full" style={{ backgroundColor: preset.theme.card }}></div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const ContactEditor: React.FC<{ contact: ContactData, socials: SocialData, onUpdate: (contact: ContactData, socials: SocialData) => void }> = ({ contact, socials, onUpdate }) => {
    
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...contact, [e.target.name]: e.target.value }, socials);
    };

    const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(contact, { ...socials, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 font-heading">Контактная информация</h3>
                <div className="space-y-4">
                    <InputGroup label="Адрес" name="address" value={contact.address} onChange={handleContactChange} />
                    <InputGroup label="Телефон" name="phone" type="tel" value={contact.phone} onChange={handleContactChange} />
                    <InputGroup label="Email" name="email" type="email" value={contact.email} onChange={handleContactChange} />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 font-heading">Социальные сети</h3>
                <div className="space-y-4">
                    <InputGroup label="Instagram" name="instagram" placeholder="https://instagram.com/yourprofile" value={socials.instagram} onChange={handleSocialsChange} />
                    <InputGroup label="Telegram" name="telegram" placeholder="https://t.me/yourchannel" value={socials.telegram} onChange={handleSocialsChange} />
                    <InputGroup label="VK" name="vk" placeholder="https://vk.com/yourpage" value={socials.vk} onChange={handleSocialsChange} />
                </div>
            </div>
        </div>
    );
};

const BookingManager: React.FC<{ appointments: Appointment[], onUpdateAppointments: (appointments: Appointment[]) => void, services: Service[], addToast: (message: string, type?: 'success' | 'error') => void }> = ({ appointments, onUpdateAppointments, services, addToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initialFormState = {
        clientName: '',
        serviceName: services[0]?.name || '',
        date: '',
        time: '',
    };
    const [newAppointment, setNewAppointment] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAppointment.clientName || !newAppointment.date || !newAppointment.time) {
            addToast("Пожалуйста, заполните все поля.", 'error');
            return;
        }
        const newBooking: Appointment = {
            id: Date.now().toString(),
            ...newAppointment,
        };
        onUpdateAppointments([...appointments, newBooking]);
        addToast("Новая запись успешно создана!", 'success');
        setIsModalOpen(false);
        setNewAppointment(initialFormState);
    };
    
    const handleDelete = (id: string) => {
        onUpdateAppointments(appointments.filter(app => app.id !== id));
        addToast("Запись удалена.", 'success');
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary font-heading">Предстоящие записи</h3>
                <button onClick={() => setIsModalOpen(true)} className="py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus transition-all duration-300 ease-smooth text-sm font-medium shadow-elegant">
                    Добавить запись
                </button>
            </div>
            {appointments.length > 0 ? (
                <ul className="space-y-3">
                    {appointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(app => (
                        <li key={app.id} className="p-3 bg-card border border-border rounded-card flex justify-between items-start">
                           <div>
                                <p className="font-semibold text-text-primary">{app.clientName}</p>
                                <p className="text-sm text-text-secondary">{app.serviceName}</p>
                                <p className="text-sm text-text-secondary/70 mt-1">{new Date(app.date).toLocaleDateString('ru-RU')} в {app.time}</p>
                           </div>
                           <button onClick={() => handleDelete(app.id)} className="text-text-secondary/50 hover:text-error p-1 transition-colors duration-300 ease-smooth">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                           </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-card text-text-secondary">
                    <CalendarIcon />
                    <p className="mt-2 text-sm font-medium text-text-primary">Нет предстоящих записей</p>
                    <p className="mt-1 text-xs">Нажмите "Добавить запись", чтобы создать новую.</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-card shadow-xl w-full max-w-md border border-border">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                               <h3 className="text-xl font-semibold text-text-primary font-heading mb-4">Новая запись</h3>
                               <div className="space-y-4">
                                   <InputGroup label="Имя клиента" name="clientName" value={newAppointment.clientName} onChange={handleInputChange} />
                                   <div>
                                       <label htmlFor="serviceName" className="block text-sm font-medium text-text-secondary mb-1">Услуга</label>
                                       <select id="serviceName" name="serviceName" value={newAppointment.serviceName} onChange={handleInputChange} className="w-full px-3 py-2 bg-card border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ease-smooth">
                                           {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                       </select>
                                   </div>
                                   <div className="flex space-x-2">
                                       <InputGroup label="Дата" name="date" type="date" value={newAppointment.date} onChange={handleInputChange} />
                                       <InputGroup label="Время" name="time" type="time" value={newAppointment.time} onChange={handleInputChange} />
                                   </div>
                               </div>
                            </div>
                            <div className="bg-background px-6 py-3 flex justify-end space-x-3 rounded-b-card border-t border-border">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 bg-card border border-border rounded-component text-sm font-medium text-text-secondary hover:bg-background hover:border-border transition-all duration-300 ease-smooth">Отмена</button>
                                <button type="submit" className="py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus text-sm font-medium transition-all duration-300 ease-smooth">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const CrmManager: React.FC<{ clients: Client[], onUpdateClients: (clients: Client[]) => void, addToast: (message: string, type?: 'success' | 'error') => void }> = ({ clients, onUpdateClients, addToast }) => {
    const emptyClient: Omit<Client, 'id' | 'visitHistory'> = { name: '', phone: '', email: '', notes: '' };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | Omit<Client, 'id' | 'visitHistory'>>(emptyClient);
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenModal = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setIsEditing(true);
        } else {
            setEditingClient(emptyClient);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(emptyClient);
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditingClient(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient.name) {
            addToast("Имя клиента не может быть пустым.", 'error');
            return;
        }

        if (isEditing && 'id' in editingClient) {
            const updatedClients = clients.map(c => c.id === editingClient.id ? editingClient as Client : c);
            onUpdateClients(updatedClients);
            addToast("Данные клиента обновлены!", 'success');
        } else {
            const newClient: Client = {
                id: Date.now().toString(),
                visitHistory: [],
                ...editingClient
            };
            onUpdateClients([...clients, newClient]);
            addToast("Новый клиент добавлен!", 'success');
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        onUpdateClients(clients.filter(c => c.id !== id));
        addToast("Клиент удален.", 'success');
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary font-heading">База клиентов</h3>
                <button onClick={() => handleOpenModal()} className="py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus transition-all duration-300 ease-smooth text-sm font-medium shadow-elegant">
                    Добавить клиента
                </button>
            </div>
            {clients.length > 0 ? (
                <ul className="space-y-3">
                    {clients.map(client => (
                        <li key={client.id} className="p-3 bg-card border border-border rounded-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-text-primary">{client.name}</p>
                                    <p className="text-sm text-text-secondary">{client.email} | {client.phone}</p>
                                    <p className="text-sm text-text-secondary/70 mt-1 italic">Заметки: {client.notes}</p>
                                    <p className="text-xs text-text-secondary/50 mt-1">Посещений: {client.visitHistory.length}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleOpenModal(client)} className="text-text-secondary/50 hover:text-primary p-1 transition-colors duration-300 ease-smooth">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(client.id)} className="text-text-secondary/50 hover:text-error p-1 transition-colors duration-300 ease-smooth">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                 <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-card text-text-secondary">
                    <CrmIcon />
                    <p className="mt-2 text-sm font-medium text-text-primary">Клиентская база пуста</p>
                    <p className="mt-1 text-xs">Нажмите "Добавить клиента", чтобы создать карточку.</p>
                </div>
            )}

             {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-card shadow-xl w-full max-w-md border border-border">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                               <h3 className="text-xl font-semibold text-text-primary font-heading mb-4">{isEditing ? 'Редактировать клиента' : 'Новый клиент'}</h3>
                               <div className="space-y-4">
                                   <InputGroup label="Имя" name="name" value={editingClient.name} onChange={handleInputChange} />
                                   <InputGroup label="Телефон" name="phone" type="tel" value={editingClient.phone} onChange={handleInputChange} />
                                   <InputGroup label="Email" name="email" type="email" value={editingClient.email} onChange={handleInputChange} />
                                   <TextareaGroup label="Заметки" name="notes" value={editingClient.notes} onChange={handleInputChange} rows={3} />
                               </div>
                            </div>
                            <div className="bg-background px-6 py-3 flex justify-end space-x-3 rounded-b-card border-t border-border">
                                <button type="button" onClick={handleCloseModal} className="py-2 px-4 bg-card border border-border rounded-component text-sm font-medium text-text-secondary hover:bg-background hover:border-border transition-all duration-300 ease-smooth">Отмена</button>
                                <button type="submit" className="py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus text-sm font-medium transition-all duration-300 ease-smooth">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const TestimonialEditor: React.FC<{ testimonials: Testimonial[], onUpdateTestimonials: (testimonials: Testimonial[]) => void, addToast: (message: string, type?: 'success' | 'error') => void }> = ({ testimonials, onUpdateTestimonials, addToast }) => {
    const emptyTestimonial: Omit<Testimonial, 'id'> = { clientName: '', text: '', rating: 5 };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | Omit<Testimonial, 'id'>>(emptyTestimonial);
    const [isEditing, setIsEditing] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleOpenModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            setIsEditing(true);
        } else {
            setEditingTestimonial(emptyTestimonial);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTestimonial(emptyTestimonial);
        setIsEditing(false);
        setHoverRating(0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditingTestimonial(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (newRating: number) => {
        setEditingTestimonial(prev => ({ ...prev, rating: newRating }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTestimonial.clientName || !editingTestimonial.text) {
            addToast("Имя клиента и текст отзыва не могут быть пустыми.", 'error');
            return;
        }

        if (isEditing && 'id' in editingTestimonial) {
            const updated = testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial as Testimonial : t);
            onUpdateTestimonials(updated);
            addToast("Отзыв обновлен!", 'success');
        } else {
            const newTestimonial: Testimonial = {
                id: Date.now().toString(),
                ...editingTestimonial,
            };
            onUpdateTestimonials([...testimonials, newTestimonial]);
            addToast("Новый отзыв добавлен!", 'success');
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        onUpdateTestimonials(testimonials.filter(t => t.id !== id));
        addToast("Отзыв удален.", 'success');
    };

    const currentRating = editingTestimonial.rating;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary font-heading">Управление отзывами</h3>
                <button onClick={() => handleOpenModal()} className="py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus transition-all duration-300 ease-smooth text-sm font-medium shadow-elegant">
                    Добавить отзыв
                </button>
            </div>
            {testimonials.length > 0 ? (
                <ul className="space-y-3">
                    {testimonials.map(testimonial => (
                        <li key={testimonial.id} className="p-3 bg-card border border-border rounded-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-text-primary">{testimonial.clientName}</p>
                                    <div className="flex my-1">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < testimonial.rating} />)}
                                    </div>
                                    <p className="text-sm text-text-secondary italic">"{testimonial.text}"</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleOpenModal(testimonial)} className="text-text-secondary/50 hover:text-primary p-1 transition-colors duration-300 ease-smooth">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(testimonial.id)} className="text-text-secondary/50 hover:text-error p-1 transition-colors duration-300 ease-smooth">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                 <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-card text-text-secondary">
                    <TestimonialIcon />
                    <p className="mt-2 text-sm font-medium text-text-primary">Отзывов пока нет</p>
                    <p className="mt-1 text-xs">Нажмите "Добавить отзыв", чтобы создать первый.</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-card shadow-xl w-full max-w-md border border-border">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                               <h3 className="text-xl font-semibold text-text-primary font-heading mb-4">{isEditing ? 'Редактировать отзыв' : 'Новый отзыв'}</h3>
                               <div className="space-y-4">
                                   <InputGroup label="Имя клиента" name="clientName" value={editingTestimonial.clientName} onChange={handleInputChange} />
                                   <TextareaGroup label="Текст отзыва" name="text" value={editingTestimonial.text} onChange={handleInputChange} rows={4} />
                                   <div>
                                       <label className="block text-sm font-medium text-text-secondary mb-1">Рейтинг</label>
                                       <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                                           {[...Array(5)].map((_, i) => (
                                               <StarIcon 
                                                  key={i} 
                                                  filled={i < (hoverRating || currentRating)}
                                                  onClick={() => handleRatingChange(i + 1)}
                                                  onMouseEnter={() => setHoverRating(i + 1)}
                                               />
                                            ))}
                                       </div>
                                   </div>
                               </div>
                            </div>
                            <div className="bg-background px-6 py-3 flex justify-end space-x-3 rounded-b-card border-t border-border">
                                <button type="button" onClick={handleCloseModal} className="py-2 px-4 bg-card border border-border rounded-component text-sm font-medium text-text-secondary hover:bg-background hover:border-border transition-all duration-300 ease-smooth">Отмена</button>
                                <button type="submit" className="py-2 px-4 bg-primary text-white rounded-component hover:bg-primary-focus text-sm font-medium transition-all duration-300 ease-smooth">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};