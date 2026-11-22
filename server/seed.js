import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'
import Project from './models/Project.js'
import Image from './models/Image.js'

const IMG = {
  living: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900',
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900',
  bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900',
}

const projects = [
  { title: 'Sharma Residence', locality: 'Indiranagar', propertyType: 'Villa / Independent House', status: 'Completed', budgetTier: 'Luxury', lat: 12.9784, lng: 77.6408, description: 'Bare-shell to move-in turnkey villa with 3D walkthrough sign-off.', cover: IMG.living, category: 'Full Home' },
  { title: 'Lakeview 3 BHK Apartment', locality: 'Whitefield', propertyType: '3 BHK', status: 'Completed', budgetTier: 'Premium', lat: 12.9698, lng: 77.75, description: 'Modular kitchen, wardrobes and false ceiling in a gated community flat.', cover: IMG.kitchen, category: 'Modular Kitchen' },
  { title: 'Rental-Ready 6-Flat Building', locality: 'HSR Layout', propertyType: 'Multi-Unit Building', status: 'Ongoing', budgetTier: 'Economy', lat: 12.9116, lng: 77.6389, description: 'Durable low-maintenance interiors across 6 rental flats with bulk discount.', cover: IMG.home, category: 'Commercial / Multi-Unit' },
  { title: 'Tech Office Fit-Out', locality: 'Electronic City', propertyType: 'Commercial', status: 'Completed', budgetTier: 'Standard', lat: 12.8452, lng: 77.6602, description: 'Workstations, false ceiling and electrical coordination for a 40-seat office.', cover: IMG.office, category: 'Commercial / Multi-Unit' },
  { title: 'Rao 2 BHK Makeover', locality: 'JP Nagar', propertyType: '2 BHK', status: 'Ongoing', budgetTier: 'Standard', lat: 12.9063, lng: 77.5857, description: 'Master bedroom wardrobes and living room TV unit.', cover: IMG.bedroom, category: 'Bedroom' },
]

async function run() {
  await mongoose.connect(process.env.MONGO_URI)

  await Promise.all([Admin.deleteMany(), Project.deleteMany(), Image.deleteMany()])

  await Admin.create({
    email: 'admin@demo.com',
    passwordHash: await bcrypt.hash('admin123', 10),
  })

  for (const { cover, category, ...data } of projects) {
    const project = await Project.create({ ...data, coverImage: cover })
    await Image.create({ url: cover, caption: data.title, category, projectId: project._id, isCover: true })
  }

  console.log('Seeded: admin@demo.com / admin123 + 5 projects')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })