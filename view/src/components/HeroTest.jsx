import React from "react";
import { useLanguageContext } from "../context/LanguageProvider";

const HeroTest = () => {
  const { t } = useLanguageContext();

  return (
    <div className="bg-gray-100 p-8">
      <h1>{t("hero.mainHeading.part1")}</h1>
      <p>{t("hero.description")}</p>
    </div>
  );
};

export default HeroTest;
