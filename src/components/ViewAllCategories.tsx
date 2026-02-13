import React from "react";
import { motion } from "framer-motion";

export const ViewAllCategories = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-20 pt-12 border-t border-white/5"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 glass p-8 rounded-3xl">
        <div className="text-left">
          <h3 className="text-2xl font-display font-bold mb-2">Explore All Categories</h3>
          <p className="text-muted-foreground font-body">Access our full curriculum across all secondary levels.</p>
        </div>
        <a 
          href="/all-categories" 
          className="btn-primary whitespace-nowrap group flex items-center gap-3 px-8"
        >
          View All Categories
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </a>
      </div>
    </motion.div>
  );
};
