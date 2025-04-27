import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import emailjs from "emailjs-com";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        "service_nfzpwcs",
        "template_slisiu4",
        {
          from_name: formData.name,
          email_id: formData.email,
          message: formData.message,
        },
        "2JC1ozQGy_9hgSnHX"
      );
      
      toast.success("Message sent successfully! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "homedel.rw@gmail.com",
      link: "mailto:homedel.rw@gmail.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+250798509561",
      link: "tel:+250798509561",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      value: "123 Main St, Kigali, Rwanda",
      link: "https://maps.google.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 font-poppins">
      <Navbar />
      <ToastContainer />
      
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-24 right-0 w-96 h-96 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message
              and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.title}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

            
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 resize-none"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
