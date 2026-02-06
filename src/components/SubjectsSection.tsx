import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories, subjectData, Category } from "@/lib/constants";

export const SubjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("junior");
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const navigate = useNavigate();
  const viewMoreImageJunior = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop";
  const viewMoreImageDefault = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop";
  const viewAllCategoriesImage = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop";

  return (
    <section id="subjects" className="py-32 relative">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

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
          className="flex flex-wrap justify-center gap-3 mb-12"
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

        {/* Subject Grid - No description text, just the grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {subjectData[activeCategory].map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3]"
              onMouseEnter={() => setHoveredSubject(subject.name)}
              onMouseLeave={() => setHoveredSubject(null)}
              onClick={() => navigate(`/subject/${encodeURIComponent(subject.name)}`)}
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
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors duration-300">
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
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
          
          {activeCategory !== "junior" && (
            <>
              {/* View More (Category) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3]"
                onClick={() => navigate(`/category/${activeCategory}`)}
              >
                <img
                  src={viewMoreImageDefault}
                  alt="View more"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors duration-300">
                    View More — {categories.find(c => c.id === activeCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-300 font-body">See all subjects in this category</p>
                </div>
              </motion.div>

              {/* Explore All Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3]"
                onClick={() => navigate(`/categories`)}
              >
                <img
                  src={viewAllCategoriesImage}
                  alt="Explore all"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors duration-300">
                    View More — All Categories
                  </h3>
                  <p className="text-sm text-gray-300 font-body">Browse every category and subject</p>
                </div>
              </motion.div>
            </>
          )}

          {activeCategory === "junior" && (
            <>
              {/* Insert View More and View All in third row positions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3]"
                onClick={() => navigate(`/category/${activeCategory}`)}
              >
                <img
                  src={viewMoreImageJunior}
                  alt="View more"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors duration-300">
                    View More — {categories.find(c => c.id === activeCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-300 font-body">See all subjects in this category</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3]"
                onClick={() => navigate(`/categories`)}
              >
                <img
                  src={viewAllCategoriesImage}
                  alt="Explore all"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors duration-300">
                    View More — All Categories
                  </h3>
                  <p className="text-sm text-gray-300 font-body">Browse every category and subject</p>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};
