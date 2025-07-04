import { useParams } from "react-router-dom";
import { useGetCourseContentsQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const VideoScreen = () => {
  const { id: courseId, videoId } = useParams();
  const { data: content, isLoading } = useGetCourseContentsQuery(courseId);
  const videoRef = useRef(null);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Find the section containing the video
  const section = content?.find((section) =>
    section.videos.some((video) => video._id === videoId)
  );

  // Find the specific video within the section
  const video = section?.videos.find((video) => video._id === videoId);

  // Get all videos for navigation
  const allVideos = content?.flatMap(section =>
    section.videos.map(video => ({
      ...video,
      sectionName: section.sectionName
    }))
  ) || [];

  const currentVideoIndex = allVideos.findIndex(v => v._id === videoId);
  const previousVideo = currentVideoIndex > 0 ? allVideos[currentVideoIndex - 1] : null;
  const nextVideo = currentVideoIndex < allVideos.length - 1 ? allVideos[currentVideoIndex + 1] : null;

  // Video event handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show/hide controls on hover
  useEffect(() => {
    let timeout;

    const handleMouseEnter = () => {
      setShowControls(true);
      clearTimeout(timeout);
    };

    const handleMouseLeave = () => {
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const videoContainer = videoRef.current?.parentElement;

    if (videoContainer) {
      videoContainer.addEventListener('mouseenter', handleMouseEnter);
      videoContainer.addEventListener('mouseleave', handleMouseLeave);
      videoContainer.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      clearTimeout(timeout);
      if (videoContainer) {
        videoContainer.removeEventListener('mouseenter', handleMouseEnter);
        videoContainer.removeEventListener('mouseleave', handleMouseLeave);
        videoContainer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl">
        {/* Back Button */}
        <Link
          to={`/courses/${courseId}`}
          className="mb-6 sm:mb-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-300 font-medium group text-base sm:text-lg"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Course</span>
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" text="Loading video..." />
          </div>
        ) : video ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
            {/* Main Video Section */}
            <div className="xl:col-span-3 flex flex-col space-y-4 sm:space-y-6">
              {/* Video Player Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="relative group">
                  <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="w-full aspect-video bg-slate-900 rounded-t-2xl sm:rounded-t-3xl max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh]"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                    preload="metadata"
                  />
                  {/* Custom Video Controls */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity duration-300 ${(showControls || window.innerWidth < 640) ? 'opacity-100' : 'opacity-0'} flex flex-col justify-end`}>
                    {/* Play/Pause Overlay (centered, only on desktop) */}
                    <div className="hidden sm:flex absolute inset-0 items-center justify-center">
                      <button
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      >
                        {isPlaying ? (
                          <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* Bottom Controls */}
                    <div className="w-full px-2 sm:px-6 pb-2 sm:pb-6">
                      {/* Progress Bar */}
                      <div className="mb-2 sm:mb-4">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-3 sm:h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                          aria-label="Seek"
                        />
                      </div>
                      {/* Control Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                          <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="w-12 h-12 sm:w-10 sm:h-10 bg-slate-800/80 hover:bg-blue-600/80 text-white rounded-full flex items-center justify-center transition-all duration-200">
                            {isPlaying ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                              </svg>
                            )}
                          </button>
                          <button onClick={() => skipTime(-10)} aria-label="Rewind 10 seconds" className="w-10 h-10 bg-slate-700/80 hover:bg-blue-600/80 text-white rounded-full flex items-center justify-center transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                          </button>
                          <button onClick={() => skipTime(10)} aria-label="Forward 10 seconds" className="w-10 h-10 bg-slate-700/80 hover:bg-blue-600/80 text-white rounded-full flex items-center justify-center transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                            </svg>
                          </button>
                          <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="w-10 h-10 bg-slate-700/80 hover:bg-blue-600/80 text-white rounded-full flex items-center justify-center transition-all duration-200">
                            {isMuted ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 sm:w-20 h-3 sm:h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                            aria-label="Volume"
                          />
                          <span className="text-white text-xs sm:text-sm font-medium">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                          <div className="relative">
                            <button
                              onClick={() => setShowSettings(!showSettings)}
                              aria-label="Playback speed"
                              className="w-10 h-10 bg-slate-700/80 hover:bg-blue-600/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            {showSettings && (
                              <div className="absolute bottom-12 right-0 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg p-2 sm:p-3 min-w-24 sm:min-w-32 z-20">
                                <div className="text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Playback Speed</div>
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                  <button
                                    key={rate}
                                    onClick={() => changePlaybackRate(rate)}
                                    className={`block w-full text-left px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${playbackRate === rate
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'text-slate-600 hover:bg-slate-100'
                                      }`}
                                  >
                                    {rate}x
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button onClick={toggleFullscreen} aria-label="Fullscreen" className="w-10 h-10 bg-slate-700/80 hover:bg-blue-600/80 text-white rounded-full flex items-center justify-center transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Video Info - Collapsible on mobile */}
              <div className="p-4 sm:p-8">
                <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-700 text-xs sm:text-sm font-medium">
                    {section?.sectionName}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-4xl font-medium text-slate-800 mb-4 sm:mb-6 leading-tight">
                  {video.title}
                </h1>

                <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200/40">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-slate-800">About this video</h3>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                    {video.description}
                  </p>
                </div>
              </div>
              {/* Navigation Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {previousVideo && (
                  <Link
                    to={`/courses/${courseId}/video/${previousVideo._id}`}
                    className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 font-medium mb-1">Previous</p>
                        <p className="text-slate-800 font-medium line-clamp-2">{previousVideo.title}</p>
                      </div>
                    </div>
                  </Link>
                )}

                {nextVideo && (
                  <Link
                    to={`/courses/${courseId}/video/${nextVideo._id}`}
                    className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-right">
                        <p className="text-sm text-slate-500 font-medium mb-1">Next</p>
                        <p className="text-slate-800 font-medium line-clamp-2">{nextVideo.title}</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            {/* Sidebar - Course Content (collapsible on mobile) */}
            <div className="xl:col-span-1 mt-6 xl:mt-0">
              <div className="sticky top-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-4 sm:mb-6">Course Content</h3>

                  <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
                    {content?.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2 px-2 sm:px-3">
                          {section.sectionName}
                        </h4>
                        {section.videos.map((sectionVideo, videoIndex) => (
                          <Link
                            key={videoIndex}
                            to={`/courses/${courseId}/video/${sectionVideo._id}`}
                            className={`block p-2 sm:p-3 rounded-xl transition-all duration-300 ${sectionVideo._id === videoId
                              ? 'bg-blue-50 border border-blue-200/60 text-blue-700'
                              : 'hover:bg-slate-50 text-slate-600'
                              }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sectionVideo._id === videoId
                                ? 'bg-blue-100'
                                : 'bg-slate-100'
                                }`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium truncate">
                                  {sectionVideo.title}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-red-200/60 p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-700 text-base sm:text-lg font-medium">Video not found</p>
              <p className="text-red-600 text-xs sm:text-sm font-light mt-1">The requested video could not be located</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VideoScreen;