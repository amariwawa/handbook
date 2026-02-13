import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₦2,000",
    period: "/month",
    description: "Perfect for getting started with AI-powered learning",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
    features: [
      "Access to all subjects",
      "500 AI explanations/month",
      "Basic practice questions",
      "Progress tracking",
      "Mobile app access",
    ],
    cta: "Start Basic",
    popular: false,
  },
  {
    name: "Premium",
    price: "₦4,000",
    period: "/month",
    description: "Unlimited learning with personalized AI tutoring",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    features: [
      "Everything in Basic",
      "Unlimited AI explanations",
      "Past questions (WAEC, NECO, JAMB)",
      "Personalized study plans",
      "Performance analytics",
      "Priority support",
      "Offline mode",
    ],
    cta: "Go Premium",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₦20,000",
    period: "/month",
    description: "Complete solution for schools and institutions",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
    features: [
      "Everything in Premium",
      "Up to 100 student accounts",
      "Teacher dashboard",
      "Custom question uploads",
      "Class performance reports",
      "Dedicated support",
      "API access",
      "White-label option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block font-body">
            Pricing Plans
          </span>
          <h2 className="section-title mb-6">
            Invest in Your <span className="italic-accent text-primary">Future</span>
          </h2>
          <p className="section-subtitle mx-auto font-body">
            Choose the plan that fits your learning goals. All plans include 
            access to our AI tutor and comprehensive question bank.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl overflow-hidden ${
                plan.popular
                  ? "border-2 border-primary/30"
                  : "border border-border"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full font-body">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              {/* Plan Content */}
              <div className="p-8 bg-card">
                {/* Plan Name */}
                <h3 className="font-display text-2xl font-semibold mb-2">{plan.name}</h3>
                
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  <span className="text-muted-foreground font-body">{plan.period}</span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-8 font-body">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <span className="text-sm font-body">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full py-4 rounded-xl font-medium transition-all duration-300 font-body ${
                  plan.popular
                    ? "btn-primary"
                    : "glass hover:bg-white/10"
                }`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm mt-12 font-body"
        >
          All plans include a 7-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </section>
  );
};
