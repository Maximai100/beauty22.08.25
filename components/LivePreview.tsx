import React, { useState, useEffect } from 'react';
import type { LandingPageData } from '../types';

interface LivePreviewProps {
  data: LandingPageData;
  onBookAppointment: (details: { name: string; serviceName: string; date: string; time: string; }) => void;
}

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const SocialIcon: React.FC<{ network: 'instagram' | 'telegram' | 'vk', href: string }> = ({ network, href }) => {
    const icons = {
        instagram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
        telegram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13L2 9L22 2zM13 22L11 13"></path></svg>,
        vk: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M22.45,6.21c0.16,-0.41 0,-0.7 -0.66,-0.7h-2.5a1,1 0 0,0 -0.9,0.58c-0.5,1 -0.9,1.86 -1.4,1.86c-0.3,0 -0.5,-0.3 -0.5,-0.92V6.21c0,-0.8 -0.32,-1.21 -0.91,-1.21h-4c-0.4,0 -0.7,0.3 -0.7,0.6v3.2c0,0.7 0.1,0.8 0.5,0.8c0.5,0 1.2,-1.2 2.1,-2.5c0.32,-0.5 0.6,-0.7 1,-0.7h1.4c0.4,0 0.5,0.2 0.5,0.6v3c0,0.7 -0.1,0.8 -0.5,0.8c-0.7,0 -1.5,-0.5 -1.7,-1.5c-0.2,-0.7 -0.4,-1 -0.8,-1.2c-0.4,-0.2 -1,-0.2 -1.4,0.2c-0.3,0.3 -0.5,0.7 -0.5,1.5v1c0,0.5 0.2,0.9 0.6,1.2c0.4,0.3 1,0.5 1.7,0.5h1.5c1.6,0 1.8,-0.9 2.7,-2.4c0.4,-0.6 0.8,-1.2 1.6,-1.2c0.4,0 0.7,0.2 0.9,0.7c0.3,0.5 0.2,1.2 0,1.8c-0.6,1.5 -2.1,2.8 -2.1,2.8c-0.4,0.3 -0.6,0.5 -0.6,0.9c0,0.3 0.2,0.5 0.6,0.5h2.8c0.8,0 1.2,-0.4 1,-1.2c-0.2,-0.8 -0.8,-1.9 -0.8,-1.9c-0.2,-0.4 0,-0.6 0.4,-0.8c0.7,-0.3 1.5,-1.4 1.8,-2.3C22.65,7.11 22.25,6.71 22.45,6.21z"></path></svg>
    };

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
            {icons[network]}
        </a>
    );
};

export const LivePreview: React.FC<LivePreviewProps> = ({ data, onBookAppointment }) => {
  const { hero, about, services = [], portfolio = [], theme, contact, socials, testimonials = [] } = data;
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    service: services[0]?.id || '',
    date: '',
    time: ''
  });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  useEffect(() => {
    // This effect handles the initialization and refreshing of the AOS library.
    // It runs whenever the 'data' prop changes, ensuring that animations
    // are correctly applied after the component re-renders with new content.
    // @ts-ignore
    if (window.AOS) {
        // @ts-ignore
        window.AOS.init({
            duration: 800,
            once: true, // Animations happen only once
            offset: 50, // trigger animations a little bit early
        });
        // A short delay before refreshing allows React to complete its render cycle,
        // ensuring AOS sees the final positions of all elements.
        setTimeout(() => {
            // @ts-ignore
            window.AOS.refresh();
        }, 150);
    }
  }, [data]); // Depend on `data` to re-trigger on content changes.

  useEffect(() => {
      // This effect ensures the selected service in the form is valid if the services list changes.
      const serviceExists = services.some(s => s.id === bookingDetails.service);
      if (!serviceExists) {
          setBookingDetails(prev => ({ ...prev, service: services[0]?.id || '' }));
      }
  }, [services, bookingDetails.service]);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails.name || !bookingDetails.service || !bookingDetails.date || !bookingDetails.time) {
        alert("Пожалуйста, заполните все поля для записи.");
        return;
    }
    const selectedService = services.find(s => s.id === bookingDetails.service);
    if (!selectedService) return;

    onBookAppointment({
        name: bookingDetails.name,
        serviceName: selectedService.name,
        date: bookingDetails.date,
        time: bookingDetails.time,
    });
    setIsBookingSuccess(true);
    setTimeout(() => {
        setIsBookingSuccess(false);
        setBookingDetails({
            name: '',
            service: services[0]?.id || '',
            date: '',
            time: ''
        });
    }, 3000);
  };
  
  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-component overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <style>{`
            :root {
                --theme-primary: ${theme.primary};
                --theme-background: ${theme.background};
                --theme-text: ${theme.text};
                --theme-card: ${theme.card};
            }
            html { scroll-behavior: smooth; }
            .live-preview-body {
                font-family: var(--font-body);
                color: var(--theme-text);
                background-color: var(--theme-background);
            }
            .live-preview-body h1, .live-preview-body h2, .live-preview-body h3, .live-preview-body h4 {
                font-family: var(--font-heading);
            }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: hsl(var(--border-hsl)); }
            ::-webkit-scrollbar-thumb { background: hsl(var(--border-hsl) / 0.5); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: hsl(var(--border-hsl) / 0.7); }
        `}</style>
        <div className="live-preview-body">
            <header
              id="home"
              className="relative h-screen min-h-[600px] flex items-center justify-center text-center text-white p-4 bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${hero.backgroundImage}')`,
              }}
            >
              <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-400/20 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

              <div className="container mx-auto px-4 z-10" data-aos="fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{hero.title}</h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md font-light">{hero.subtitle}</p>
                <a
                  href="#booking"
                  className="py-3 px-10 text-lg font-semibold rounded-full transition-all duration-500 ease-bounce hover:scale-105 shadow-elegant hover:shadow-glow inline-block"
                  style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}
                >
                  {hero.cta}
                </a>
              </div>
            </header>

            <section id="about" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }} className="py-20 sm:py-32 relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-70"></div>
              <div className="container mx-auto px-4 z-10 relative">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center" data-aos="fade-up">
                  <div>
                    <img src={about.imageUrl} alt="Мастер" className="rounded-card shadow-card-hover w-full h-auto object-cover aspect-[4/5]" />
                  </div>
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-8" style={{ color: 'var(--theme-primary)' }}>Обо мне</h2>
                    <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-text-secondary">{about.text}</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="services" style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-text)' }} className="py-20 sm:py-32">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16" style={{ color: 'var(--theme-primary)' }} data-aos="fade-up">Услуги</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {services.map((service, index) => (
                            <div key={service.id} className="p-8 rounded-card shadow-card transition-all duration-500 ease-smooth hover:shadow-card-hover hover:-translate-y-2" style={{ backgroundColor: 'var(--theme-background)' }} data-aos="fade-up" data-aos-delay={index * 100}>
                                <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                                <p className="text-text-secondary mb-5">{service.description}</p>
                                <div className="flex justify-between items-center text-xl font-semibold">
                                    <span style={{ color: 'var(--theme-primary)' }}>{service.price} ₽</span>
                                    <span className="text-gray-500 text-base font-medium">{service.duration} мин.</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="portfolio" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }} className="py-20 sm:py-32">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16" style={{ color: 'var(--theme-primary)' }} data-aos="fade-up">Портфолио</h2>
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                  {portfolio.map((image, index) => (
                     <div key={image.id} className="break-inside-avoid overflow-hidden rounded-card shadow-card" data-aos="fade-up" data-aos-delay={index * 50}>
                      <img className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" src={image.url} alt={image.alt} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="testimonials" style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-text)' }} className="py-20 sm:py-32">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16" style={{ color: 'var(--theme-primary)' }} data-aos="fade-up">Что говорят клиенты</h2>
                     {testimonials.length > 0 && (
                        <div className="relative max-w-3xl mx-auto" data-aos="fade-up">
                            <div className="overflow-hidden relative h-64">
                                {testimonials.map((t, index) => (
                                    <div 
                                      key={t.id} 
                                      className="absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col items-center justify-center text-center p-6"
                                      style={{ opacity: index === currentTestimonial ? 1 : 0 }}
                                    >
                                       <StarRatingDisplay rating={t.rating} />
                                       <p className="text-lg sm:text-xl my-6 flex-grow italic text-text-secondary">"{t.text}"</p>
                                       <p className="font-bold text-lg">- {t.clientName}</p>
                                    </div>
                                ))}
                            </div>
                            {testimonials.length > 1 && (
                                <>
                                    <button onClick={prevTestimonial} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12 p-2 rounded-full bg-background/50 hover:bg-background transition-all duration-300 ease-smooth shadow-card hidden sm:block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button onClick={nextTestimonial} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 p-2 rounded-full bg-background/50 hover:bg-background transition-all duration-300 ease-smooth shadow-card hidden sm:block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
            
            <section id="booking" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }} className="py-20 sm:py-32">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16" style={{ color: 'var(--theme-primary)' }} data-aos="fade-up">Записаться онлайн</h2>
                    <div data-aos="fade-up">
                        {isBookingSuccess ? (
                            <div className="text-center p-8 bg-success/10 text-success rounded-card shadow-elegant">
                                <h3 className="text-3xl font-semibold">Спасибо за запись!</h3>
                                <p className="mt-3 text-lg">Мы скоро свяжемся с вами для подтверждения.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBookingSubmit} className="space-y-6 p-8 sm:p-10 rounded-card shadow-card-hover" style={{backgroundColor: 'var(--theme-card)'}}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Ваше имя</label>
                                    <input type="text" id="name" value={bookingDetails.name} onChange={handleBookingChange} className="w-full px-4 py-3 bg-background border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary text-base transition-all duration-300 ease-smooth" required />
                                </div>
                                <div>
                                    <label htmlFor="service" className="block text-sm font-medium text-text-secondary mb-1">Выберите услугу</label>
                                    <select id="service" value={bookingDetails.service} onChange={handleBookingChange} className="w-full px-4 py-3 bg-background border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary text-base transition-all duration-300 ease-smooth" required>
                                        <option value="" disabled={services.length > 0}>Выберите услугу</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price} ₽)</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                   <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Дата</label>
                                        <input type="date" id="date" value={bookingDetails.date} onChange={handleBookingChange} className="w-full px-4 py-3 bg-background border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary text-base transition-all duration-300 ease-smooth" required />
                                    </div>
                                    <div>
                                        <label htmlFor="time" className="block text-sm font-medium text-text-secondary mb-1">Время</label>
                                        <input type="time" id="time" value={bookingDetails.time} onChange={handleBookingChange} className="w-full px-4 py-3 bg-background border border-border rounded-input shadow-input focus:ring-2 focus:ring-primary/50 focus:border-primary text-base transition-all duration-300 ease-smooth" required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 px-4 text-lg font-semibold rounded-component text-white transition-all duration-500 ease-bounce shadow-elegant hover:scale-105 hover:shadow-glow" style={{ backgroundColor: 'var(--theme-primary)' }}>
                                    Записаться
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <footer style={{ backgroundColor: 'var(--theme-text)', color: '#E5E7EB' }} className="py-16">
                <div className="container mx-auto px-4 text-center">
                     <p className="font-semibold text-lg mb-3">{contact.address}</p>
                     <p className="mb-2"><a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">{contact.phone}</a></p>
                     <p className="mb-6"><a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a></p>
                     <div className="flex justify-center space-x-6">
                        {socials.instagram && <SocialIcon network="instagram" href={socials.instagram} />}
                        {socials.telegram && <SocialIcon network="telegram" href={socials.telegram} />}
                        {socials.vk && <SocialIcon network="vk" href={socials.vk} />}
                     </div>
                     <p className="text-xs text-gray-400 mt-10">&copy; {new Date().getFullYear()} | Создано с помощью Конструктора сайтов</p>
                </div>
            </footer>
        </div>
    </div>
  );
};