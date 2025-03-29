import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddContentMutation } from "../../slices/coursesApiSlice";
import Loader from "../../components/Loader";

const AddContentScreen = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State for section form
  const [sectionName, setSectionName] = useState("");

  // State for video form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [addContent, { isLoading }] = useAddContentMutation();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!sectionName || !videoTitle || !videoDescription || !videoFile) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Upload video file to the backend
      const formData = new FormData();
      formData.append("video", videoFile);

      const uploadResponse = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload video");
      }

      const uploadData = await uploadResponse.json();
      console.log(uploadData.message);
      const videoUrl = uploadData.videoPath;

      // Prepare content data
      const contentData = {
        sectionName,
        title: videoTitle,
        description: videoDescription,
        videoUrl,
      };

      // Submit content data
      await addContent({ courseId, data: contentData }).unwrap();
      toast.success("Content added successfully");

      // Clear form fields after submission
      setSectionName("");
      setVideoTitle("");
      setVideoDescription("");
      setVideoFile(null);
      navigate(-1);
    } catch (err) {
      toast.error(err?.message || "Failed to add content");
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

          {/* Video File Input */}
          <div className='mb-4'>
            <label className='block text-gray-700 font-semibold mb-2'>
              Upload Video
            </label>
            <input
              type='file'
              accept='video/*'
              onChange={(e) => setVideoFile(e.target.files[0])}
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
            {isLoading ? "Submitting..." && <Loader /> : "Submit Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContentScreen;