export default function ContactForm() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
      <h2 className="text-2xl font-bold text-stone-900 mb-2">Send us a message</h2>
      <p className="text-stone-500 mb-8">Do you have a question or want to book a table for a group?</p>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              className="w-full rounded-lg border-stone-200 border p-3 text-stone-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
              placeholder="Jordi"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              className="w-full rounded-lg border-stone-200 border p-3 text-stone-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
              placeholder="Font"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
          <input 
            type="email" 
            id="email" 
            className="w-full rounded-lg border-stone-200 border p-3 text-stone-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
            placeholder="jordi@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Message</label>
          <textarea 
            id="message" 
            rows={4}
            className="w-full rounded-lg border-stone-200 border p-3 text-stone-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
            placeholder="Tell us about your favorite coffee..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}