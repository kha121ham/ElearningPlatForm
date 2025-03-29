import { FaChalkboardTeacher, FaUsers, FaBookOpen } from "react-icons/fa";

const AboutScreen = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white shadow-lg rounded-lg mt-10 animate-fade-in">
      <h2 className="text-5xl font-extrabold text-center mb-8 text-gray-800 animate-slide-down">
        About Us
      </h2>
      <p className="text-gray-700 text-lg text-center mb-12 max-w-4xl mx-auto animate-fade-in">
        Welcome to our E-Learning platform! Our mission is to provide high-quality education
        accessible to everyone, anywhere in the world. We offer a variety of courses designed by
        industry experts to help you learn and grow.
      </p>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-8 border rounded-lg shadow-md hover:shadow-xl transition duration-300 animate-fade-in-left">
          <FaChalkboardTeacher className="text-blue-500 text-5xl mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Expert Instructors</h3>
          <p className="text-gray-600">
            Learn from industry professionals with real-world experience.
          </p>
        </div>

        <div className="p-8 border rounded-lg shadow-md hover:shadow-xl transition duration-300 animate-fade-in">
          <FaUsers className="text-blue-500 text-5xl mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Community Learning</h3>
          <p className="text-gray-600">
            Join a vibrant community of learners and collaborate with peers.
          </p>
        </div>

        <div className="p-8 border rounded-lg shadow-md hover:shadow-xl transition duration-300 animate-fade-in-right">
          <FaBookOpen className="text-blue-500 text-5xl mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Diverse Courses</h3>
          <p className="text-gray-600">
            Explore a wide range of subjects to enhance your skills.
          </p>
        </div>
      </div>

      <div className="text-center mt-16">
        <h3 className="text-3xl font-extrabold mb-6 text-gray-800 animate-slide-up">
          Our Vision
        </h3>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto animate-fade-in">
          We believe that education should be accessible to everyone. Our goal is to empower
          students, professionals, and lifelong learners with high-quality courses designed to fit
          their needs.
        </p>
      </div>
    </div>
  );
};

export default AboutScreen;