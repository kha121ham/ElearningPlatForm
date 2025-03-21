import { useParams } from "react-router-dom";
import { useGetCourseContentsQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const VideoScreen = () => {
  const { id: courseId, videoId } = useParams();
  const { data: content, isLoading } = useGetCourseContentsQuery(courseId);

  const video = content?.find((item) => item._id === videoId);

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      {/* Back Button */}
      <Link
        to={`/courses/${courseId}`}
        className='mb-4 text-blue-600 hover:text-blue-800 transition duration-300'
      >
        &larr; Back to Course
      </Link>

      {isLoading ? (
        <Loader />
      ) : video ? (
        <div>
          {/* Video Title */}
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            {video.title}
          </h1>

          {/* Video Embed */}
          <div className='aspect-video rounded-lg overflow-hidden shadow-md'>
            <iframe
              src={video.videoUrl}
              title={video.title}
              className='w-full h-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Description */}
          <p className='text-gray-600 mt-4'>{video.description}</p>
        </div>
      ) : (
        <p className='text-red-600'>Video not found.</p>
      )}
    </div>
  );
};

export default VideoScreen;