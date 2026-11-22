import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    locality: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ['1 BHK', '2 BHK', '3 BHK', 'Villa / Independent House', 'Multi-Unit Building', 'Commercial'],
      required: true,
    },
    status: { type: String, enum: ['Completed', 'Ongoing'], default: 'Completed' },
    budgetTier: { type: String, enum: ['Economy', 'Standard', 'Premium', 'Luxury'], default: 'Standard' },
    description: { type: String, default: '' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    visible: { type: Boolean, default: true },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)