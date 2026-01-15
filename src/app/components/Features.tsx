export default function Features() {
  const features = [
    {
      title: "Specialty Coffee",
      desc: "We work with local farmers to bring you the best beans possible.",
      icon: "☕"
    },
    {
      title: "Coworking Space",
      desc: "High-speed Wi-Fi and power outlets at every table to work comfortably.",
      icon: "💻"
    },
    {
      title: "Homemade Pastry",
      desc: "Freshly baked croissants and cakes made every morning in our kitchen.",
      icon: "🥐"
    }
  ];

  return (
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Why Choose Us?</h2>
            <div className="h-1 w-20 bg-amber-600 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 text-center">
                  <div className="text-4xl mb-6 bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-stone-800">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}