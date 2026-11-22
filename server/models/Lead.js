import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    phone: { type: String, required: true },
    location: { type: String, default: '' },
    propertyType: { type: String, default: '' },
    size: { type: String, default: '' },
    purpose: { type: String, default: '' },
    budgetTier: { type: String, default: '' },
    units: { type: Object, default: {} }, // { wardrobes: 2, kitchen: 1, ... }
    estimate: { type: Object, default: {} }, // { min: 400000, max: 600000 }
    source: { type: String, enum: ['wizard', 'roi', 'site-visit'], default: 'wizard' },
    status: {
      type: String,
      enum: ['New', 'Site Visit Booked', 'Quote Sent', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Lead', leadSchema)