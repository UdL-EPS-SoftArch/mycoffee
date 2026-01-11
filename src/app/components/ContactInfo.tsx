import { MapPin, Phone, Mail, Clock } from "lucide-react"; // Assegura't de tenir lucide-react instal·lat

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Find Us in Lleida</h2>
        <p className="text-stone-600 mb-8">
          Located in the heart of the city, just a few steps from the Ricard Viñes square. 
          The perfect spot to stop by before heading to La Seu Vella.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Address</h3>
              <p className="text-stone-600">Avinguda de Rovira Roure, 4<br />25006 Lleida, Spain</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Opening Hours</h3>
              <p className="text-stone-600">Mon - Fri: 07:30 - 20:00</p>
              <p className="text-stone-600">Sat - Sun: 09:00 - 21:00</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Contact</h3>
              <p className="text-stone-600">+34 973 00 00 00</p>
              <p className="text-stone-600">hello@lleidacoffee.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa Embed de Google Maps (Centrat a Lleida) */}
      <div className="w-full h-64 bg-stone-200 rounded-2xl overflow-hidden shadow-inner">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2983.856980486745!2d0.6206193766645366!3d41.61862497127045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a6e06385f91855%3A0x6d9a930156972061!2sPla%C3%A7a%20de%20Ricard%20Vi%C3%B1es%2C%2025006%20Lleida!5e0!3m2!1sen!2ses!4v1709220000000!5m2!1sen!2ses" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}