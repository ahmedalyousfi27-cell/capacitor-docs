import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

const SplashPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen animated-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-white/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300/30 rounded-full blur-2xl float"></div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="relative z-10 mb-8"
      >
        <div className="w-28 h-28 glass rounded-3xl flex items-center justify-center shadow-2xl pulse-glow">
          <ShoppingBag className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Brand name */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center relative z-10 mb-6"
      >
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
          وصول
        </h1>
        <p className="text-2xl font-medium text-white/90">Wo6ol</p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg text-white/95 text-center mb-12 max-w-xs leading-relaxed relative z-10"
      >
        من علي إكسبريس إلى باب بيتك بكل سهولة
      </motion.p>

      {/* Features */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex gap-6 mb-12 relative z-10"
      >
        {[
          { icon: "🛒", text: "تسوق" },
          { icon: "💳", text: "ادفع" },
          { icon: "📦", text: "استلم" },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, y: -5 }}
            className="glass rounded-2xl px-5 py-3 text-center"
          >
            <span className="text-2xl mb-1 block">{item.icon}</span>
            <span className="text-white text-sm font-medium">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="relative z-10 w-full max-w-xs"
      >
        <Button
          data-testid="start-now-btn"
          onClick={() => navigate("/login")}
          className="w-full h-14 bg-white text-blue-600 hover:bg-white/90 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          ابدأ الآن
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-8 text-white/60 text-sm"
      >
        تجربة تسوق يمنية مميزة
      </motion.div>
    </motion.div>
  );
};

export default SplashPage;
