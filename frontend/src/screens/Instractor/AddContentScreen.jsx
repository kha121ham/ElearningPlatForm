import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddContentMutation } from "../../slices/coursesApiSlice";

const AddContentScreen = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State for section form
  const [sectionName, setSectionName] = useState("");

  // State for video form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [addContent, { isLoading }] = useAddContentMutation();

  // Validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!sectionName || !videoTitle || !videoDescription || !videoUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    // Prepare data to submit
    const contentData = {
      sectionName,
      title: videoTitle,
      description: videoDescription,
      videoUrl,
    };

    try {
      // Call the mutation with the content data
      await addContent({ courseId, data: contentData }).unwrap();
      toast.success("Content added successfully");

      // Clear form fields after submission
      setSectionName("");
      setVideoTitle("");
      setVideoDescription("");
      setVideoUrl("");
      navigate(-1);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add content");
      console.error(err);
    }
  };
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      {/* Page Title */}
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>Add Content</h1>

      {/* Add Section Form */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Add a New Section
        </h2>
        <form>
          {/* Section Name Input */}
          <div className='mb-4'>
            <label className='block text-gray-700 font-semibold mb-2'>
              Section Name
            </label>
            <input
              type='text'
              placeholder='Enter section name'
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </form>
      </div>

      {/* Add Video Form */}
      <div>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Add a New Video
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Video Title Input */}
          <div className='mb-4'>
            <label className='block text-gray-700 font-semibold mb-2'>
              Video Title
            </label>
            <input
              type='text'
              placeholder='Enter video title'
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Video Description Input */}
          <div className='mb-4'>
            <label className='block text-gray-700 font-semibold mb-2'>
              Video Description
            </label>
            <textarea
              placeholder='Enter video description'
              rows='4'
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            ></textarea>
          </div>

          {/* Video URL Input */}
          <div className='mb-4'>
            <label className='block text-gray-700 font-semibold mb-2'>
              Video URL
            </label>
            <input
              type='text'
              placeholder='Enter video URL'
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300'
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContentScreen;
