import asyncHandler from "../middleware/asyncHandler.js";
import Course from "../models/courseModel.js";
import Content from '../models/contentModel.js';

// @desc    Get course content
// @route   GET api/courses/:id/content
// @access  Private
const getCourseContent = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const course = await Course.findById(req.params.id).populate('content');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.includes(userId);

    if (!isEnrolled) {
      return res.status(403).json({ message: 'You should buy the course first' });
    }

    const contents = await Content.find({ course: req.params.id });

    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add content
// @route   POST api/content/:id
// @access  Private/Instructor
const addContent = asyncHandler(async (req, res) => {
  const { title, description, videoUrl } = req.body;
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to add content to this course' });
    }

    if (!title || !videoUrl || !description) {
      return res.status(400).json({ message: 'Please provide all required fields: title, description, videoUrl' });
    }

    const content = new Content({
      title,
      videoUrl,
      description,
      course: courseId
    });

    const createdContent = await content.save();

    course.content.push(createdContent._id);
    await course.save();

    res.status(201).json(createdContent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



export { getCourseContent, addContent };