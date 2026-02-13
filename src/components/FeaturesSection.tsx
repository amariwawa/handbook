import { motion } from "framer-motion";

const features = [
  {
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    title: "AI-Powered Explanations",
    description: "Get detailed, personalized explanations for every question. Our AI tutor adapts to your learning style.",
  },
  {
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    title: "Exam-Focused Content",
    description: "Practice with real BECE, WAEC, NECO, and JAMB past questions organized by topic and difficulty.",
  },
  {
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop",
    title: "Interactive Tutoring",
    description: "Chat with your AI tutor anytime. Ask follow-up questions and get instant clarifications.",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    title: "Progress Analytics",
    description: "Track your improvement over time with detailed performance insights and recommendations.",
  },
  {
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    title: "Learn Anytime",
    description: "Access your lessons 24/7 on any device. Continue where you left off seamlessly.",
  },
  {
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    title: "Safe & Secure",
    description: "Age-appropriate content with strict safety measures. Perfect for young learners.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="about" className="pt-0 pb-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block font-body">
            Why HANDBOOK?
          </span>
          <h2 className="section-title mb-6">
            Why <span className="italic-accent text-primary">Handbook?</span>
          </h2>
          <p className="section-subtitle mx-auto font-body">
            Experience the future of education with features designed specifically 
            for Nigerian secondary school students.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group glass rounded-2xl overflow-hidden card-hover"
            >
              {/* Feature Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-body">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
