import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const canvasRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const mailto = t("notFound.mailto");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < -10) p.y = canvas.height + 10;

        ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-16 text-center hover:scale-[1.01] transition-all duration-700">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 leading-none mb-8 tracking-tighter font-BBHBogle">
            404
          </h1>

          <h2 className="text-5xl font-bold text-white mb-6 font-BBHBogle">
            {t("notFound.title")}
          </h2>

          <p className="text-xl text-blue-200 mb-12 max-w-lg mx-auto leading-relaxed opacity-90">
            {t("notFound.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Home className="w-6 h-6 group-hover:translate-x-1 transition" />
              {t("notFound.primaryCta")}
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 border-2 border-white/30 text-white text-lg font-medium rounded-full hover:bg-white/20 backdrop-blur-md transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6" />
              {t("notFound.secondaryCta")}
            </button>
          </div>

          <p className="mt-12 text-blue-300 text-sm">
            {t("notFound.helpText")}{" "}
            <a
              href={`mailto:${mailto}`}
              className="underline hover:text-cyan-300 transition"
            >
              {t("notFound.helpLink")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
