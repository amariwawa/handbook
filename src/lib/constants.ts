
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
}

export type Category = "junior" | "sciences" | "arts" | "commercial" | "ai_learning";

export const categories: { id: Category; name: string; description: string }[] = [
  { id: "junior", name: "Junior Secondary", description: "JS1 - JS3 Curriculum" },
  { id: "sciences", name: "Sciences", description: "SS1 - SS3 Science Track" },
  { id: "arts", name: "Arts", description: "SS1 - SS3 Arts Track" },
  { id: "commercial", name: "Commercial", description: "SS1 - SS3 Commercial Track" },
  { id: "ai_learning", name: "AI Learning", description: "AI & Computing Focus" },
];

export const subjectData: Record<Category, { name: string; image: string; description: string }[]> = {
  junior: [
    { name: "Basic Science", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", description: "Explore the fundamentals of science" },
    { name: "Basic Technology", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop", description: "Learn technical skills & innovation" },
    { name: "Mathematics", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop", description: "Junior-level numbers and problem-solving" },
    { name: "English Language", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop", description: "Junior communication and reading skills" },
    { name: "Business Studies", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop", description: "Understand commerce and trade" },
    { name: "Social Studies", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop", description: "Learn about society and culture" },
    { name: "CRK/IRK", image: "https://images.unsplash.com/photo-1548625361-9877196a090a?w=400&h=300&fit=crop", description: "Religious knowledge and values" },
    { name: "Civic Education", image: "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=400&h=300&fit=crop", description: "Citizenship and governance" },
    { name: "French", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", description: "Learn the French language" },
    { name: "Music", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop", description: "Explore rhythm and melody" }
  ],
  sciences: [
    { name: "Mathematics", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", description: "Advanced mathematical concepts" },
    { name: "English Language", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop", description: "Master language and literature" },
    { name: "Physics", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop", description: "Laws of the universe" },
    { name: "Chemistry", image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop", description: "Study of matter and reactions" },
    { name: "Biology", image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop", description: "Science of living organisms" },
    { name: "Further Mathematics", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop", description: "Advanced calculus & algebra" },
    { name: "Agricultural Science", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop", description: "Modern farming techniques" },
    { name: "Computer Science", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", description: "Programming and systems" },
    { name: "Technical Drawing", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop", description: "Engineering graphics" },
    { name: "Health Education", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop", description: "Wellness and healthcare" },
  ],
  arts: [
    { name: "Mathematics", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", description: "Essential mathematical skills" },
    { name: "English Language", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop", description: "Language and communication" },
    { name: "Literature in English", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop", description: "Explore great literary works" },
    { name: "Government", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=300&fit=crop", description: "Political systems & governance" },
    { name: "History", image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Thomas_Jefferson_by_Rembrandt_Peale%2C_1800.jpg", description: "Understanding our past" },
    { name: "CRK/IRK", image: "https://images.unsplash.com/photo-1548625361-9877196a090a?w=400&h=300&fit=crop&v=3", description: "Religious knowledge" },
    { name: "Geography", image: "https://images.unsplash.com/photo-1476973422084-e0fa66ff9456?w=400&h=300&fit=crop", description: "Study of Earth and places" },
    { name: "Civic Education", image: "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=400&h=300&fit=crop", description: "Rights and responsibilities" },
    { name: "French", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", description: "French language mastery" },
    { name: "Music", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop", description: "Theory and performance" },
    { name: "Fine Arts", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop", description: "Creative expression" },
    { name: "Yoruba/Igbo/Hausa", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop", description: "Nigerian languages" },
  ],
  commercial: [
    { name: "Mathematics", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", description: "Business mathematics" },
    { name: "English Language", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop", description: "Commercial communication" },
    { name: "Economics", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop", description: "Markets and economies" },
    { name: "Commerce", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", description: "Trade and business" },
    { name: "Accounting", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop", description: "Financial record keeping" },
    { name: "Government", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=300&fit=crop", description: "Political economy" },
    { name: "Business Studies", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop", description: "Management principles" },
    { name: "Office Practice", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop", description: "Administrative skills" },
    { name: "Insurance", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop", description: "Risk management" },
    { name: "Computer Studies", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", description: "Digital literacy" },
  ],
  ai_learning: [
    { name: "AI & Computing", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop", description: "Digital skills for the future" },
  ],
};
