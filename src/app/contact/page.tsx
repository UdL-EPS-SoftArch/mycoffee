import ContactInfo from "@/app/components/ContactInfo";
import ContactForm from "@/app/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header simple per la pàgina de contacte */}
      <div className="bg-stone-900 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
        <p className="mt-4 text-stone-300 text-lg">We'd love to hear from you. Come say hi!</p>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Grid: Esquerra Info, Dreta Formulari */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Esquerra: Info & Mapa */}
          <ContactInfo />

          {/* Columna Dreta: Formulari */}
          <ContactForm />

        </div>
      </main>

      {/* Footer (Reutilitzat o el mateix que al home) */}
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm mt-12">
        <p>© 2024 Coffee Lleida. Made with ☕ and code.</p>
      </footer>
    </div>
  );
}