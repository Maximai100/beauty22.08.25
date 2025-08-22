
import React, { useState, useCallback, useEffect } from 'react';
import { BuilderSidebar } from './components/BuilderSidebar';
import { LivePreview } from './components/LivePreview';
import type { LandingPageData, Service, PortfolioImage, Appointment, Client, ContactData, SocialData, Testimonial } from './types';
import { INITIAL_DATA } from './constants';
import { ToastContainer, Toast } from './components/Toast';

const APP_STORAGE_KEY = 'beauty-landing-builder-data';

const loadStateFromLocalStorage = (): LandingPageData | null => {
  try {
    const serializedState = localStorage.getItem(APP_STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    const storedData = JSON.parse(serializedState);
    return {
      ...INITIAL_DATA,
      ...storedData,
      hero: { ...INITIAL_DATA.hero, ...storedData.hero },
      theme: { ...INITIAL_DATA.theme, ...storedData.theme },
      contact: { ...INITIAL_DATA.contact, ...storedData.contact },
      socials: { ...INITIAL_DATA.socials, ...storedData.socials },
    };
  } catch (err) {
    console.warn("Could not load state from localStorage:", err);
    return null;
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  
  // Effect for initial data loading
  useEffect(() => {
    const localData = loadStateFromLocalStorage();
    if (localData) {
      setData(localData);
    } else {
      // Fetch from backend if no local data
      fetch('http://localhost:3001/api/initial-data')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(initialDataFromServer => {
          setData(initialDataFromServer);
        })
        .catch(error => {
          console.error("Failed to fetch initial data from server, using local constants:", error);
          setData(INITIAL_DATA); // Fallback to local constants
        });
    }
  }, []);

  // Effect for saving data to localStorage
  useEffect(() => {
    if (data) {
        try {
          const serializedState = JSON.stringify(data);
          localStorage.setItem(APP_STORAGE_KEY, serializedState);
        } catch(err) {
          console.error("Could not save state to localStorage:", err);
        }
    }
  }, [data]);

  const addToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);
  
  if (!data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-fuchsia-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Загрузка конструктора...</h2>
        </div>
      </div>
    );
  }

  const updateData = <K extends keyof LandingPageData,>(key: K, value: LandingPageData[K]) => {
    setData(prevData => prevData ? { ...prevData, [key]: value } : null);
  };

  const updateHero = (field: 'title' | 'subtitle' | 'cta', value: string) => {
    if (!data) return;
    updateData('hero', { ...data.hero, [field]: value });
  };

  const updateAbout = (value: string) => {
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

  const handleResetData = () => {
    if(window.confirm("Вы уверены, что хотите сбросить все настройки? Это действие нельзя будет отменить.")) {
      localStorage.removeItem(APP_STORAGE_KEY);
      setData(INITIAL_DATA); // Reset to constant data
      addToast("Все настройки сброшены к начальным.");
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
    
    addToast("Новая запись создана!");
  };


  return (
    <div className="flex h-screen bg-gray-100 font-sans">
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
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-8 bg-gray-200 h-full">
            <LivePreview data={data} onBookAppointment={handleBookAppointment} />
        </div>
      </main>
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} onClose={() => setToasts(t => t.filter(t => t.id !== toast.id))} />
        ))}
      </ToastContainer>
    </div>
  );
};

export default App;
