import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const heroImg =
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=800&fit=crop";
const aiModelImg =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop";
const classroomImg =
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=800&fit=crop";
const teachersImg =
  "https://images.unsplash.com/photo-1523580494863-6f3031224cbe?w=1200&h=800&fit=crop";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8 },
};

const Donate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 md:pt-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden glass"
          >
            <img
              src={heroImg}
              alt="Classroom"
              className="w-full h-[360px] md:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="p-6 md:p-12">
                <motion.h1
                  {...fadeUp}
                  className="font-display text-3xl md:text-5xl font-bold text-white"
                >
                  Donate to Handbook Nigeria
                </motion.h1>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="mt-4 max-w-2xl text-white/90 font-body"
                >
                  Your support helps us deliver better AI tutors for Nigerian
                  students, build a full school suite, and create packages for
                  teachers. Every contribution directly upgrades learning.
                </motion.p>
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.9, delay: 0.35 }}
                  className="mt-6"
                >
                  <a href="/#pricing" className="btn-primary">
                    Get Involved
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block font-body">
              Why Donate
            </span>
            <h2 className="section-title">
              Power Better <span className="italic-accent text-primary">AI</span>{" "}
              Learning
            </h2>
            <p className="section-subtitle mx-auto font-body">
              Donations fund improved AI models, reliable infrastructure, and
              teacher-focused tools to reach more learners.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              {...fadeUp}
              className="glass rounded-2xl overflow-hidden"
            >
              <img
                src={aiModelImg}
                alt="AI Model"
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg">
                  Improved AI Models
                </h3>
                <p className="text-muted-foreground font-body mt-2">
                  More accurate answers, better explanations, and safer
                  learning—funded by your support.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <img
                src={classroomImg}
                alt="Classroom"
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg">
                  School Suite
                </h3>
                <p className="text-muted-foreground font-body mt-2">
                  Build attendance, assignments, analytics, and a full
                  classroom experience for schools.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <img
                src={teachersImg}
                alt="Teachers"
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg">
                  Teacher Packages
                </h3>
                <p className="text-muted-foreground font-body mt-2">
                  Tools for lesson plans, quizzes, and personalized learning
                  paths for every classroom.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="glass rounded-3xl p-8 md:p-12 text-center"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold">
              Help Us Reach More Students
            </h3>
            <p className="text-muted-foreground mt-3 font-body max-w-2xl mx-auto">
              Every donation expands content, speeds up the AI tutor, and gets
              us closer to a modern school platform. Thank you for supporting
              education.
            </p>
            <div className="mt-6">
              <a href="/#pricing" className="btn-primary">
                Donate Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Donate;
