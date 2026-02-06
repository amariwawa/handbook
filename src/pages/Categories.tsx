import { Navbar } from "@/components/Navbar";
import { categories, subjectData } from "@/lib/constants";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          All Categories
        </motion.h1>

        <div className="space-y-10">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{cat.name}</h2>
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/category/${cat.id}`)}
                >
                  View All {cat.name} Subjects
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {subjectData[cat.id].map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative glass rounded-2xl overflow-hidden cursor-pointer card-hover aspect-[4/3]"
                    onClick={() => navigate(`/subject/${encodeURIComponent(subject.name)}`)}
                  >
                    <img
                      src={subject.image}
                      alt={subject.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary transition-colors duration-300">
                        {subject.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
