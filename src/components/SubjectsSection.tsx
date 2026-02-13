import { useState } from "react";
import { motion } from "framer-motion";
import { ViewAllCategories } from "./ViewAllCategories";

type Category = "junior" | "sciences" | "arts" | "commercial" | "ai";

const categories: { id: Category; name: string; description: string }[] = [
  { id: "junior", name: "Junior Secondary", description: "JS1 - JS3 Curriculum" },
  { id: "sciences", name: "Sciences", description: "SS1 - SS3 Science Track" },
  { id: "arts", name: "Arts", description: "SS1 - SS3 Arts Track" },
  { id: "commercial", name: "Commercial", description: "SS1 - SS3 Commercial Track" },
  { id: "ai", name: "AI Learning", description: "Future Skills & Tech" },
];

const subjectData: Record<Category, { name: string; image: string; description: string }[]> = {
  junior: [
    { name: "Basic Science", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", description: "Explore the fundamentals of science" },
    { name: "Basic Technology", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop", description: "Learn technical skills & innovation" },
    { name: "Mathematics", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", description: "Master numbers and problem-solving" },
    { name: "English Language", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop", description: "Perfect your communication skills" },
    { name: "Business Studies", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop", description: "Understand commerce and trade" },
    { name: "Social Studies", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop", description: "Learn about society and culture" },
  ],
  sciences: [
    { name: "Physics", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop", description: "Laws of the universe" },
    { name: "Chemistry", image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop", description: "Study of matter and reactions" },
    { name: "Biology", image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop", description: "Science of living organisms" },
    { name: "Further Mathematics", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop", description: "Advanced calculus & algebra" },
    { name: "Agricultural Science", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop", description: "Modern farming techniques" },
    { name: "Computer Science", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", description: "Programming and systems" },
  ],
  arts: [
    { name: "Literature in English", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop", description: "Explore great literary works" },
    { name: "Government", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=300&fit=crop", description: "Political systems & governance" },
    { name: "History", image: "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=300&fit=crop", description: "Understanding our past" },
    { name: "Geography", image: "https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=400&h=300&fit=crop", description: "Study of Earth and places" },
    { name: "Civic Education", image: "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=400&h=300&fit=crop", description: "Rights and responsibilities" },
    { name: "French", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", description: "French language mastery" },
  ],
  commercial: [
    { name: "Economics", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop", description: "Markets and economies" },
    { name: "Commerce", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", description: "Trade and business" },
    { name: "Accounting", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop", description: "Financial record keeping" },
    { name: "Government", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=300&fit=crop", description: "Political economy" },
    { name: "Business Studies", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop", description: "Management principles" },
    { name: "Office Practice", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop", description: "Administrative skills" },
  ],
  ai: [
    { name: "Prompt Engineering", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop", description: "Mastering AI interaction" },
    { name: "AI Ethics", image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=400&h=300&fit=crop", description: "Social impacts of AI" },
    { name: "Data Science", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", description: "Learning from information" },
    { name: "Machine Learning", image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&h=300&fit=crop", description: "How algorithms learn" },
    { name: "Creative AI", image: "https://images.unsplash.com/photo-1547891299-219574ef0605?w=400&h=300&fit=crop", description: "AI in art and music" },
    { name: "Future of Work", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", description: "Adapting to tech shifts" },
  ],
};

export const SubjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("junior");
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  return (
    <section id="subjects" className="pt-24 pb-12 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Vertical Scroll Animation Component (Side Indicator) */}
      {activeCategory !== "ai" && (
        <motion.div 
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          <a 
            href="/all-categories"
            className="group flex flex-col items-center gap-4"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/50 vertical-text font-medium group-hover:text-primary transition-colors">
              View All Categories
            </span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </a>
        </motion.div>
      )}

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block font-body">
            Explore Subjects
          </span>
          <h2 className="section-title mb-6">
            Choose Your <span className="italic-accent text-primary">Path</span>
          </h2>
          <p className="section-subtitle mx-auto font-body">
            From Junior Secondary to Senior Secondary, we cover every subject 
            you need to excel in BECE, WAEC, NECO, and JAMB examinations.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 font-body ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "glass hover:bg-white/10"
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Subject Grid - Limited to 6 (2 per line on mobile, 3 per line on md+) */}
        <div className="relative">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {subjectData[activeCategory].map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[16/9]"
                onMouseEnter={() => setHoveredSubject(subject.name)}
                onMouseLeave={() => setHoveredSubject(null)}
              >
                {/* Background Image */}
                <img
                  src={subject.image}
                  alt={subject.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-display font-semibold text-xl text-white mb-1 group-hover:text-primary transition-colors duration-300">
                    {subject.name}
                  </h3>
                  
                  {/* Description on hover */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredSubject === subject.name ? 1 : 0,
                      y: hoveredSubject === subject.name ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-300 font-body"
                  >
                    {subject.description}
                  </motion.p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View More for Sciences */}
          {activeCategory === "sciences" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8"
            >
              <button className="text-primary font-medium hover:underline flex items-center gap-2 mx-auto transition-all">
                View more sciences <span className="text-xl">→</span>
              </button>
            </motion.div>
          )}
        </div>
  
        {/* View all categories horizontal component */}
        <ViewAllCategories />
      </div>
    </section>
  );
};
