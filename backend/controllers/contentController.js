import asyncHandler from "../middleware/asyncHandler.js";
import Course from "../models/courseModel.js";
import Content from '../models/contentModel.js';

// @desc    Get course content
// @route   GET api/courses/:id/content
// @access  Private
const getCourseContent = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor")
      .populate("content");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isInstructor =
      course.instructor?._id?.toString() === userId.toString() ||
      course.instructor?.toString() === userId.toString();

    const isEnrolled = course.enrolledStudents.includes(userId);

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({ message: "You should buy the course first" });
    }

    const contents = await Content.find({ course: req.params.id });

    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Add content
// @route   POST api/content/:id
// @access  Private/Instructor
const addContent = asyncHandler(async (req, res) => {
  const { sectionName, title, description, videoUrl } = req.body;
  const courseId  = req.params.id;

  try {
    if (!title || !videoUrl || !description || !sectionName) {
      return res.status(400).json({ message: 'Please provide all required fields: sectionName, title, description, videoUrl' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to add content to this course' });
    }

    // Check if a section with the same name already exists
    const existingSection = await Content.findOne({ sectionName, course: courseId });

    if (existingSection) {
      // If the section exists, add the new video to its videos array
      existingSection.videos.push({ title, description, videoUrl });
      const updatedSection = await existingSection.save();

      // Return the updated section
      return res.status(200).json({
        message: 'Video added to existing section',
        section: updatedSection,
      });
    } else {
      // If the section does not exist, create a new section with the video
      const newContent = new Content({
        sectionName,
        videos: [{ title, description, videoUrl }],
        course: courseId,
      });

      const createdContent = await newContent.save();

      // Add the new content to the course's content array
      course.content.push(createdContent._id);
      await course.save();

      // Return the new created section
      return res.status(201).json({
        message: 'New section created with video',
        section: createdContent,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



export { getCourseContent, addContent };