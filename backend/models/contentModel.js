import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  videos: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      videoUrl: {
        type: String,
        required: true,
      },
    },
  ],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const Content = mongoose.model("Content", contentSchema);

export default Content;