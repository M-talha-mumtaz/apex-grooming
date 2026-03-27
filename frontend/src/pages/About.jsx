import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-serif text-gold mb-12">{t('about')}</h1>
      <div className="space-y-8 text-zinc-300 font-light leading-relaxed text-lg text-left bg-zinc-900/40 p-10 border border-zinc-800">
        <p>
          Founded on the principles of precision and luxury, Lumina Grooming represents the ultimate sanctuary for modern gentlemen and individuals who appreciate high-end personal care.
        </p>
        <p>
          Our master barbers bring decades of combined experience, utilizing both timeless traditional techniques and contemporary styling to craft the perfect look tailored specifically to your features, lifestyle, and preferences.
        </p>
        <p>
          Every visit to Lumina is designed to be an experience of absolute relaxation—from our complimentary premium beverages to the soothing hot towel treatments and the immaculate aesthetic of our Scandinavian-inspired black and gold salon.
        </p>
      </div>
    </div>
  );
};

export default About;
