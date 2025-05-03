import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguageContext } from "../context/LanguageProvider";

const Review = () => {
  const { t } = useLanguageContext();
  const scrollContainerRef = useRef(null);

  // Get testimonials from translations
  const getTestimonials = () => {
    return [
      {
        info: t("testimonials.reviews.0.text"),
        Name: t("testimonials.reviews.0.name"),
        role: t("testimonials.reviews.0.role"),
        rating: 4,
      },
      {
        info: t("testimonials.reviews.1.text"),
        Name: t("testimonials.reviews.1.name"),
        role: t("testimonials.reviews.1.role"),
        rating: 5,
      },
      {
        info: t("testimonials.reviews.2.text"),
        Name: t("testimonials.reviews.2.name"),
        role: t("testimonials.reviews.2.role"),
        rating: 5,
      },
      {
        info: t("testimonials.reviews.3.text"),
        Name: t("testimonials.reviews.3.name"),
        role: t("testimonials.reviews.3.role"),
        rating: 4,
      },
      {
        info: t("testimonials.reviews.4.text"),
        Name: t("testimonials.reviews.4.name"),
        role: t("testimonials.reviews.4.role"),
        rating: 5,
      },
    ];
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount =
        direction === "left" ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:block"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:block"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {getTestimonials().map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Quote className="w-10 h-10 text-green-500 mb-4" />

                  <p className="text-gray-700 dark:text-gray-300 mb-6 min-h-[80px]">
                    "{testimonial.info}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.Name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                            i < testimonial.rating
                              ? "bg-green-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
