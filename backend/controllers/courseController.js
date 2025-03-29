import asyncHandler from "../middleware/asyncHandler.js";
import Course from "../models/courseModel.js";

// @desc    Fetch All courses
// @route   Get api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, category, search } = req.query; // Get query parameters

  // Number of courses per page
  const pageSize = process.env.PAGINATION_LIMIT;

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
    const courses = await Course.find(query).select('-enrolledStudents')
      .populate('instructor', 'name')
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

// @desc    Fetch All courses for admin
// @route   Get api/courses/admin
// @access  Private
const getCoursesToAdmin = asyncHandler(async(req,res)=>{
  const courses = await Course.find({}).populate('instructor', 'name'); 
  console.log(courses)
  return res.status(200).json(courses);
})

// @desc    Delete any courses for admin
// @route   DELETE api/courses/:id/admin
// @access  Private/Admin
const deleteCoursesByAdmin = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  await Course.deleteOne({ _id: course._id });
  res.status(200).json({ message: 'Course deleted successfully' });
});

// @desc    Fetch intsructor courses 
// @route   Get api/courses/intructor
// @access  Private/Intructor
const getInstructorCourses = asyncHandler(async(req,res)=>{
  const courses = await Course.find({ instructor: req.user._id });

  return res.status(200).json(courses);
});

// @desc    Delete instructor courses 
// @route   DELETE api/courses/:id/instructor
// @access  Private/Instructor  
const deleteInstructorCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not your course' });
  }

  await Course.deleteOne({ _id: course._id });
  res.status(200).json({ message: 'Course deleted successfully' });
});

// @desc    Fetch a Course
// @route   Get api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name');

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
    price: Number(item.price).toFixed(2),
    instructor: req.user._id, // Set the instructor to the logged-in user
    image: image || "/images/sample.jpg", // Use provided image or a default
    category,
    description,
    enrolledStudents: [], // Initialize enrolledStudents as an empty array
  });

  // Save the course to the database
  const createdCourse = await course.save();

  // Send response
  res.status(201).json(createdCourse);
});

// @desc    Create a new review
// @route   POST api/courses/:id/reviews
// @access  Private
const createCourseReview = asyncHandler(async(req,res)=>{
  const { rating, comment } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    //check if course reviewd
    const alreadyReviewed = course.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Course already reviewed');
    }

    const userEnrolledInCourse = course.enrolledStudents.find(
      (student) => student.toString() === req.user._id.toString()
    );
    
    if(!userEnrolledInCourse) {
      return res.status(402).json({ message: 'You should buy course first' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    course.reviews.push(review);

    course.numReviews = course.reviews.length;

    course.rating = 
    course.reviews.reduce((acc,review) => acc + review.rating , 0) / course.reviews.length;

    await course.save();

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('resource not found');
  }
});


// @desc    Get top rated courses
// @route   Get api/courses/top
// @access  Public
const getTopCourses = asyncHandler(async(req,res)=>{
  const courses = await Course.find({}).sort({ rating: -1 }).limit(4).select('-enrolledStudents').populate('instructor', 'name');

  res.status(200).json(courses);
});




// @desc    Enroll student to course
// @route   PUT api/courses/:id/enroll
// @access  Private
const enrollStudentToCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (course.enrolledStudents.includes(userId)) {
    return res.status(400).json({ message: 'Student is already enrolled' });
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    { $addToSet: { enrolledStudents: userId } },
    { new: true }
  );

  res.status(200).json({ message: 'Student enrolled successfully', course: updatedCourse });
});

export { 
  createCourse, 
  getCourseById, 
  getCourses, 
  createCourseReview, 
  getTopCourses, 
  enrollStudentToCourse, 
  getCoursesToAdmin,
  deleteCoursesByAdmin,
  getInstructorCourses,
  deleteInstructorCourse
};
