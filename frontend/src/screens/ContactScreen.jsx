import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactScreen = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message. Try again.");
      }
    } catch (error) {
      setStatus("Error occurred. Please try later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 animate-fade-in">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800 animate-slide-down">
        Contact Us
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6 animate-fade-in-left">
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-blue-500 text-2xl" />
            <span className="text-gray-700 text-lg">123 Learning St, Education City</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaPhone className="text-blue-500 text-2xl" />
            <span className="text-gray-700 text-lg">+1 234 567 890</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-blue-500 text-2xl" />
            <span className="text-gray-700 text-lg">support@elearning.com</span>
          </div>
        </div>
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-fade-in-right"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
      {status && (
        <p
          className={`text-center mt-4 ${
            status.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          } animate-fade-in`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default ContactScreen;