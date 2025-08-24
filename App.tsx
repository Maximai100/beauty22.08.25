import React, { useState, useCallback, useEffect } from 'react';
import { BuilderSidebar } from './components/BuilderSidebar';
import { LivePreview } from './components/LivePreview';
import type { LandingPageData, Service, PortfolioImage, Appointment, Client, ContactData, SocialData, Testimonial, HeroData, AboutData } from './types';
import { INITIAL_DATA } from './constants';
import { ToastContainer, Toast } from './components/Toast';

const BACKEND_URL = 'http://localhost:3001'; // URL for the backend server

type ToastType = 'success' | 'error';

const App: React.FC = () => {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 5000); // Увеличено время отображения для ошибок
  }, []);

  // Effect for initial data loading from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/data`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const serverData = await response.json();
        setData(serverData);
      } catch (error) {
        console.error("Could not fetch data from server, using initial data.", error);
        setData(INITIAL_DATA);
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная сетевая ошибка.';
        addToast(`Ошибка загрузки: ${errorMessage} Используются данные по умолчанию.`, 'error');
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchData();
  }, [addToast]);

  // Effect for saving data to server
  useEffect(() => {
    if (isInitialLoad || !data) {
        return;
    }
    
    const handler = setTimeout(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/data`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`Server responded with an error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
          console.error("Could not save data to server:", error);
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная сетевая ошибка.';
          addToast(`Ошибка сохранения: ${errorMessage}`, 'error');
      }
    }, 1000); // Debounce save requests

    return () => {
        clearTimeout(handler);
    };
  }, [data, isInitialLoad, addToast]);

  
  if (!data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <h2 className="mt-4 text-xl font-semibold text-text-primary font-heading">Загрузка конструктора...</h2>
        </div>
      </div>
    );
  }

  const updateData = <K extends keyof LandingPageData,>(key: K, value: LandingPageData[K]) => {
    setData(prevData => prevData ? { ...prevData, [key]: value } : null);
  };

  const updateHero = (field: keyof HeroData, value: string) => {
    if (!data) return;
    updateData('hero', { ...data.hero, [field]: value });
  };

  const updateAbout = (value: AboutData) => {
    updateData('about', value);
  };
  
  const updateServices = (services: Service[]) => {
    updateData('services', services);
  };

  const updatePortfolio = (images: PortfolioImage[]) => {
    updateData('portfolio', images);
  };

  const updateTheme = (primary: string, background: string, text: string, card: string) => {
    updateData('theme', { primary, background, text, card });
  };

  const updateAppointments = (appointments: Appointment[]) => {
    updateData('appointments', appointments);
  };

  const updateClients = (clients: Client[]) => {
    updateData('clients', clients);
  };
  
  const updateContactAndSocials = (contact: ContactData, socials: SocialData) => {
    setData(prevData => prevData ? { ...prevData, contact, socials } : null);
  };

  const updateTestimonials = (testimonials: Testimonial[]) => {
    updateData('testimonials', testimonials);
  };

  const handleResetData = async () => {
    if(window.confirm("Вы уверены, что хотите сбросить все настройки? Это действие нельзя будет отменить.")) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/reset`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to reset data on server');
        const freshData = await response.json();
        setData(freshData);
        addToast("Все настройки сброшены к начальным.", 'success');
      } catch (error) {
        console.error("Error resetting data:", error);
        addToast("Ошибка: Не удалось сбросить настройки.", 'error');
      }
    }
  };

  const handleBookAppointment = (details: { name: string; serviceName: string; date: string; time: string; }) => {
    if (!data) return;
    const newAppointment: Appointment = {
        id: Date.now().toString(),
        clientName: details.name,
        serviceName: details.serviceName,
        date: details.date,
        time: details.time,
    };

    let updatedClients = [...data.clients];
    const clientIndex = data.clients.findIndex(client => client.name.toLowerCase().trim() === details.name.toLowerCase().trim());

    if (clientIndex > -1) {
        const existingClient = updatedClients[clientIndex];
        updatedClients[clientIndex] = {
            ...existingClient,
            visitHistory: [...existingClient.visitHistory, new Date(details.date)]
        };
    } else {
        const newClient: Client = {
            id: `client-${Date.now()}`,
            name: details.name.trim(),
            phone: '',
            email: '',
            notes: 'Создан автоматически через форму записи.',
            visitHistory: [new Date(details.date)],
        };
        updatedClients.push(newClient);
    }
    
    setData(prevData => prevData ? {
        ...prevData,
        appointments: [...prevData.appointments, newAppointment],
        clients: updatedClients,
    } : null);
    
    addToast("Новая запись создана!", 'success');
  };


  return (
    <div className="flex h-screen bg-background text-text-primary font-body">
      <BuilderSidebar 
        data={data}
        onUpdateHero={updateHero}
        onUpdateAbout={updateAbout}
        onUpdateServices={updateServices}
        onUpdatePortfolio={updatePortfolio}
        onUpdateTheme={updateTheme}
        onUpdateAppointments={updateAppointments}
        onUpdateClients={updateClients}
        onUpdateContactAndSocials={updateContactAndSocials}
        onUpdateTestimonials={updateTestimonials}
        onReset={handleResetData}
        addToast={addToast}
      />
      <main className="flex-1 overflow-x-auto">
        <div className="p-4 sm:p-6 bg-background h-full" style={{minWidth: '420px'}}>
            <LivePreview data={data} onBookAppointment={handleBookAppointment} />
        </div>
      </main>
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(t => t.filter(t => t.id !== toast.id))} />
        ))}
      </ToastContainer>
    </div>
  );
};

export default App;