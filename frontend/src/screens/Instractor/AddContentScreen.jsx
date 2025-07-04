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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-300 font-medium group"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Course</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-800 mb-2 leading-tight">
            Add Course Content
          </h1>
          <p className="text-slate-600 font-light">Create new sections and upload video content for your course</p>
        </div>

        <div className="space-y-8">
          {/* Section Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-slate-800">Course Section</h2>
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/40">
              <label className="block text-slate-700 font-medium mb-3 text-sm">
                Section Name
              </label>
              <input
                type="text"
                placeholder="Enter section name (e.g., Introduction, Advanced Topics)"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                required
              />
              <p className="text-slate-500 text-xs font-light mt-2">
                This will organize your videos into logical sections for better learning flow
              </p>
            </div>
          </div>

          {/* Video Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-slate-800">Video Content</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Title */}
              <div>
                <label className="block text-slate-700 font-medium mb-3 text-sm">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive title for your video"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                  required
                />
              </div>

              {/* Video Description */}
              <div>
                <label className="block text-slate-700 font-medium mb-3 text-sm">
                  Video Description
                </label>
                <textarea
                  placeholder="Provide a detailed description of what students will learn in this video..."
                  rows="4"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400 resize-none"
                  required
                />
              </div>

              {/* Video File Upload */}
              <div>
                <label className="block text-slate-700 font-medium mb-3 text-sm">
                  Upload Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-300"
                    required
                  />
                  {videoFile && (
                    <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200/40">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-700 text-sm font-medium">{videoFile.name}</p>
                          <p className="text-blue-600 text-xs font-light">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-xs font-light mt-2">
                  Supported formats: MP4, AVI, MOV, WMV. Maximum file size: 500MB
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200/40">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader />
                      <span>Uploading Content...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Content</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50/50 backdrop-blur-sm rounded-3xl border border-blue-200/40 p-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-blue-800 font-medium mb-2">Content Guidelines</h3>
                <ul className="text-blue-700 text-sm font-light space-y-1">
                  <li>• Use clear, descriptive titles that indicate what students will learn</li>
                  <li>• Write detailed descriptions to help students understand the video content</li>
                  <li>• Organize videos into logical sections for better course structure</li>
                  <li>• Ensure video quality is clear and audio is audible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContentScreen;