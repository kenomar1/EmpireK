import { useTranslation } from "react-i18next";

function Card({ title, emoji }) {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-8 rounded-2xl shadow-lg border border-border transition-all hover:scale-105 hover:shadow-2xl">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <p className="mt-2 opacity-75">
        {t("demoCard.body")}
      </p>
    </div>
  );
}

export default Card;
