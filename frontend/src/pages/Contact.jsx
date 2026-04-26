import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-5xl font-serif text-gold text-center mb-16">{t('contact')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10 bg-zinc-900/30 p-10 border border-zinc-800">
          <h2 className="text-3xl font-serif text-zinc-200 border-b border-gold/20 pb-4">Get In Touch</h2>
          
          <div className="flex items-start space-x-6">
            <MapPin className="text-gold mt-1 flex-shrink-0" size={28} />
            <div>
              <h3 className="text-gold uppercase tracking-wider text-sm font-semibold mb-2">Location</h3>
              <p className="text-zinc-300 font-light leading-relaxed">
                123 5th Ave<br />
                New York, NY 10003<br />
                USA
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <Phone className="text-gold mt-1 flex-shrink-0" size={28} />
            <div>
              <h3 className="text-gold uppercase tracking-wider text-sm font-semibold mb-2">Phone</h3>
              <p className="text-zinc-300 font-light leading-relaxed">+1 212 555 0198</p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <Mail className="text-gold mt-1 flex-shrink-0" size={28} />
            <div>
              <h3 className="text-gold uppercase tracking-wider text-sm font-semibold mb-2">Email</h3>
              <p className="text-zinc-300 font-light leading-relaxed">appointments@apexgrooming.com</p>
            </div>
          </div>

          <div className="pt-8 border-t border-gold/20">
            <h3 className="text-gold uppercase tracking-wider text-sm font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-zinc-300 font-light">
              <li className="flex justify-between"><span>Mon - Fri</span> <span>10:00 - 19:00</span></li>
              <li className="flex justify-between"><span>Saturday</span> <span>09:00 - 17:00</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span className="text-zinc-500">Closed</span></li>
            </ul>
          </div>
        </div>

        {/* Interactive VIP Map */}
        <div className="h-[600px] border border-neutral-800 relative bg-neutral-950 overflow-hidden group">
          <iframe 
            src="https://maps.google.com/maps?q=123%205th%20Ave,%20New%20York,%20NY%2010003,%20USA&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full grayscale invert-[0.95] contrast-125 opacity-70 group-hover:opacity-100 transition-opacity duration-700"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            title="Apex Grooming Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
