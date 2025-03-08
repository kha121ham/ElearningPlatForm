import asyncHandler from "../middleware/asyncHandler.js";
import Course from "../models/courseModel.js";

// @desc    Fetch All courses
// @route   Get api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, category, search } = req.query; // Get query parameters

  // Number of courses per page
  const pageSize = 10;

  // Build the query object
  const query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Search by title or description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    // Calculate the number of courses to skip
    const skip = (page - 1) * pageSize;

    // Fetch courses with pagination and filtering
    const courses = await Course.find(query)
      .skip(skip)
      .limit(pageSize);

    // Count total number of courses matching the query
    const totalCourses = await Course.countDocuments(query);

    // Send response
    res.json({
      courses,
      page: parseInt(page),
      pages: Math.ceil(totalCourses / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch a Course
// @route   Get api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    return res.json(course);
  } else {
    res.status(404);
    throw new Error("Resource Not Found");
  }
});

// @desc    Create a Course
// @route   POST api/courses
// @access  Private/Teacher
const createCourse = asyncHandler(async (req, res) => {
  const { title, price, image, brand, category, description } = req.body;

  // Check if required fields are provided
  if (!title || !price || !category || !description) {
    res.status(400);
    throw new Error(
      "Please provide all required fields: title, price, category, description"
    );
  }

  // Create the course
  const course = new Course({
    title,
    price,
    instructor: req.user._id, // Set the instructor to the logged-in user
    image: image || "/images/sample.jpg", // Use provided image or a default
    brand: brand || "Sample Brand", // Use provided brand or a default
    category,
    description,
    enrolledStudents: [], // Initialize enrolledStudents as an empty array
  });

  // Save the course to the database
  const createdCourse = await course.save();

  // Send response
  res.status(201).json(createdCourse);
});

export { createCourse, getCourseById, getCourses };
