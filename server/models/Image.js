import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // /uploads/xxx.jpg OR external URL
    publicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Full Home', 'Modular Kitchen', 'Living Room', 'Bedroom', 'Wardrobes', 'Commercial / Multi-Unit'],
      default: 'Full Home',
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    isCover: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Image', imageSchema)