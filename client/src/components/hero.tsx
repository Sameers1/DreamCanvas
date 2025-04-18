import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-gradient-to-r from-mysticViolet to-dreamPurple text-transparent bg-clip-text"
          >
            Sameers1 Presents
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            DreamCanvas AI
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-starlight/80 mb-8"
        >
          Transform your dreams into stunning visual masterpieces
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="https://github.com/Sameers1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-mysticViolet to-dreamPurple text-white px-8 py-3 rounded-full font-medium text-lg hover:shadow-glow transition-all duration-300"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-starlight via-mysticViolet to-starlight bg-[length:200%_auto]"
              >
                Visit Creator&apos;s Profile
              </motion.span>
            </motion.div>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
} 