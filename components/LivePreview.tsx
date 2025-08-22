
import React, { useState } from 'react';
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
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            {icons[network]}
        </a>
    );
};

export const LivePreview: React.FC<LivePreviewProps> = ({ data, onBookAppointment }) => {
  const { hero, about, services, portfolio, theme, contact, socials, testimonials } = data;
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    service: services[0]?.id || '',
    date: '',
    time: ''
  });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

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
    setBookingDetails({ name: '', service: services[0]?.id || '', date: '', time: '' });
    setIsBookingSuccess(true);
    setTimeout(() => setIsBookingSuccess(false), 5000); // Hide message after 5s
  };


  const style = {
    '--primary-color': theme.primary,
    '--background-color': theme.background,
    '--text-color': theme.text,
    '--card-color': theme.card,
  } as React.CSSProperties;

  const primaryTextColor = `text-[var(--primary-color)]`;
  const primaryBgColor = `bg-[var(--primary-color)]`;

  return (
    <div className="h-full w-full rounded-xl shadow-2xl overflow-hidden bg-white">
      <div 
        className="h-full w-full overflow-y-auto"
        style={style}
      >
        <div className="text-[var(--text-color)] bg-[var(--background-color)]">
          {/* Hero Section */}
          <header className="relative text-center py-24 sm:py-32 px-4" style={{
              backgroundImage: 'url(https://picsum.photos/seed/bg/1200/800)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
             <div className="relative z-10">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">{hero.title}</h1>
                <p className="mt-4 text-lg sm:text-xl text-gray-200">{hero.subtitle}</p>
                <a href="#booking" className={`mt-8 inline-block px-8 py-3 rounded-full text-white font-bold transition-transform transform hover:scale-105 shadow-lg ${primaryBgColor} hover:bg-opacity-90`}>
                  {hero.cta}
                </a>
             </div>
          </header>

          <main>
            {/* About Section */}
            <section id="about" className="py-16 sm:py-24 px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${primaryTextColor}`}>Обо мне</h2>
                <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{hero.title}</p>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">{about}</p>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 sm:py-24 px-6 lg:px-8 bg-[var(--card-color)]">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                   <h2 className={`text-sm font-semibold uppercase tracking-wider ${primaryTextColor}`}>Мои Услуги</h2>
                   <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">Что я предлагаю</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {services.map(service => (
                    <div key={service.id} className="p-6 rounded-lg bg-[var(--background-color)] shadow-md transition-transform transform hover:-translate-y-1">
                      <div className="flex justify-between items-start">
                         <h3 className="text-xl font-bold">{service.name}</h3>
                         <p className={`text-xl font-bold ${primaryTextColor}`}>{service.price} ₽</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{service.duration} мин</p>
                      <p className="mt-4 text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Portfolio Section */}
            <section id="portfolio" className="py-16 sm:py-24 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                   <div className="text-center mb-12">
                       <h2 className={`text-sm font-semibold uppercase tracking-wider ${primaryTextColor}`}>Портфолио</h2>
                       <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">Мои работы</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {portfolio.map(image => (
                            <div key={image.id} className="overflow-hidden rounded-lg shadow-lg group">
                               <img src={image.url} alt={image.alt} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            {testimonials && testimonials.length > 0 && (
            <section id="testimonials" className="py-16 sm:py-24 px-6 lg:px-8 bg-[var(--card-color)]">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                   <h2 className={`text-sm font-semibold uppercase tracking-wider ${primaryTextColor}`}>Отзывы</h2>
                   <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">Что говорят клиенты</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="p-8 rounded-lg bg-[var(--background-color)] shadow-md flex flex-col">
                      <div className="flex-grow">
                          <p className="text-gray-600 italic">"{testimonial.text}"</p>
                      </div>
                      <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0">
                             <StarRatingDisplay rating={testimonial.rating} />
                             <p className="font-bold mt-2">{testimonial.clientName}</p>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            )}


            {/* Booking Section */}
            <section id="booking" className="py-16 sm:py-24 px-6 lg:px-8">
                <div className="max-w-lg mx-auto">
                   <div className="text-center mb-12">
                       <h2 className={`text-sm font-semibold uppercase tracking-wider ${primaryTextColor}`}>Запись</h2>
                       <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">Запланируйте ваш визит</p>
                    </div>
                    <div className="bg-[var(--background-color)] p-8 rounded-lg shadow-xl border">
                      {isBookingSuccess ? (
                        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
                           <h3 className="text-2xl font-bold text-green-800">Спасибо за запись!</h3>
                           <p className="mt-2 text-green-600">Мы скоро свяжемся с вами для подтверждения деталей.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleBookingSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">Ваше имя</label>
                                <input type="text" id="name" value={bookingDetails.name} onChange={handleBookingChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]" />
                            </div>
                            <div>
                                <label htmlFor="service" className="block text-sm font-medium">Выберите услугу</label>
                                <select id="service" value={bookingDetails.service} onChange={handleBookingChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] bg-white">
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="flex space-x-4">
                               <div className="w-1/2">
                                  <label htmlFor="date" className="block text-sm font-medium">Дата</label>
                                  <input type="date" id="date" value={bookingDetails.date} onChange={handleBookingChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]" />
                               </div>
                               <div className="w-1/2">
                                  <label htmlFor="time" className="block text-sm font-medium">Время</label>
                                  <input type="time" id="time" value={bookingDetails.time} onChange={handleBookingChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]" />
                               </div>
                            </div>
                            <button type="submit" className={`w-full py-3 px-4 rounded-md text-white font-bold shadow-md transition-colors ${primaryBgColor} hover:bg-opacity-90`}>
                               {hero.cta}
                            </button>
                        </form>
                      )}
                    </div>
                </div>
            </section>
            
             {/* Contact Section */}
            <section id="contact" className="py-16 sm:py-24 px-6 lg:px-8 bg-[var(--card-color)]">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${primaryTextColor}`}>Контакты</h2>
                <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">Свяжитесь со мной</p>
                <div className="mt-8 text-lg text-gray-600 space-y-4">
                    <p><strong>Адрес:</strong> {contact.address}</p>
                    <p><strong>Телефон:</strong> <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-[var(--primary-color)]">{contact.phone}</a></p>
                    <p><strong>Email:</strong> <a href={`mailto:${contact.email}`} className="hover:text-[var(--primary-color)]">{contact.email}</a></p>
                </div>
              </div>
            </section>
          </main>

          <footer className="py-8 bg-gray-800 text-center text-gray-400">
            <div className="flex justify-center space-x-6 mb-4">
                {socials.instagram && <SocialIcon network="instagram" href={socials.instagram} />}
                {socials.telegram && <SocialIcon network="telegram" href={socials.telegram} />}
                {socials.vk && <SocialIcon network="vk" href={socials.vk} />}
            </div>
            <p>&copy; {new Date().getFullYear()} {hero.title}. Все права защищены.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};