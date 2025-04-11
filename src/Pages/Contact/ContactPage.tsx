import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import Swal from 'sweetalert2';
import apiBaseUrl from "../../config/axiosConfig";


const ContactSection = () => {
  const [confirmSendMessage, setConfirmSendMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await apiBaseUrl.post(`/users/contact`, formData);
      console.log(response);
      setConfirmSendMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      Swal.fire({
        title: `${confirmSendMessage}`,
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <section id="contact" className="py-16 dark:bg-gray-900">
      {/* Section Title */}
      <div className="w-[90%] mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Contact
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Connect, Collaborate, and Shape the Future of Community-Driven Insights
        </p>
      </div>

      {/* Contact Content */}
      <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-8">
          {/* Address Card */}
          <div className="bg-white dark:bg-gray-800 shadow-lg px-6 py-12 rounded-lg flex flex-col justify-center items-center">
            <FaMapMarkerAlt className="text-4xl text-sky-500 dark:text-sky-400 mb-4" />
            <h3 className="text-lg font-bold dark:text-white">Address</h3>
            <p className="text-gray-400 dark:text-gray-300">Egypt, Fayoum Governorate</p>
          </div>

          {/* Phone and Email Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Phone Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg p-8 rounded-lg flex flex-col justify-center items-center">
              <FaPhoneAlt className="text-4xl text-sky-500 dark:text-sky-400 mb-4" />
              <h3 className="text-lg font-bold dark:text-white">Call Us</h3>
              <p className="text-gray-400 dark:text-gray-300">+20 11 18354929</p>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-gray-800 shadow-lg p-8 rounded-lg flex flex-col justify-center items-center overflow-x-auto sm:overflow-clip">
              <FaEnvelope className="text-4xl text-sky-500 dark:text-sky-400 mb-4" />
              <h3 className="text-lg font-bold dark:text-white">Email Us</h3>
              <p className="text-gray-400 dark:text-gray-300">osama20111984@yahoo.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control border-2 border-[#CDCDCD] dark:border-gray-600 w-full p-3 rounded placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-0 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control border-2 border-[#CDCDCD] dark:border-gray-600 w-full p-3 rounded placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-0 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your Email"
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-control border-2 border-[#CDCDCD] dark:border-gray-600 w-full p-3 rounded placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-0 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Subject"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control border-2 border-[#CDCDCD] dark:border-gray-600 w-full p-3 rounded placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-0 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Message"
              required
            ></textarea>
            <div className="text-center pb-6">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-bold py-3 px-10 rounded-full transition-all duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;