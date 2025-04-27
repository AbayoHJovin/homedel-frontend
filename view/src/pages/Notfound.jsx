import { ArrowUpRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center px-6 md:px-12">
        <h1 className="text-7xl md:text-9xl font-bold text-gray-800 dark:text-gray-200">
          404
        </h1>
        <p className="text-xl md:text-2xl font-light leading-normal text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn&apos;t find this page.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-300"
        >
          <span>Back to home</span>
          <ArrowUpRight className="ml-2" />
        </a>
      </div>
    </div>
  );
};

export default NotFound;
