import { useParams } from "react-router-dom";
import { useGetCourseContentsQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const VideoScreen = () => {
  const { id: courseId, videoId } = useParams();
  const { data: content, isLoading } = useGetCourseContentsQuery(courseId);

  // Find the section containing the video
  const section = content?.find((section) =>
    section.videos.some((video) => video._id === videoId)
  );

  // Find the specific video within the section
  const video = section?.videos.find((video) => video._id === videoId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Back Button */}
        <Link
          to={`/courses/${courseId}`}
          className="mb-4 inline-block text-blue-600 hover:text-blue-800 transition duration-300"
        >
          &larr; Back to Course
        </Link>

        {isLoading ? (
          <Loader />
        ) : video ? (
          <div>
            {/* Section Name */}
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Section: {section?.sectionName}
            </h2>

            {/* Video Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {video.title}
            </h1>

            {/* Video Player */}
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-6">
              <video
                src={video.videoUrl}
                controls
                className="w-full h-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {video.description}
            </p>
          </div>
        ) : (
          <p className="text-red-600 text-center text-lg font-semibold">
            Video not found.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoScreen;