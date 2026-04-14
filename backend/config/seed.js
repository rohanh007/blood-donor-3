require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Request = require('../models/Request');

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Donor.deleteMany({});
  await Request.deleteMany({});

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  const users = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@bloodbank.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9876543210',
    },
    {
      name: 'Rahul Sharma',
      email: 'donor@bloodbank.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9876543211',
    },
    {
      name: 'Priya Mehta',
      email: 'receiver@bloodbank.com',
      password: hashedPassword,
      role: 'receiver',
      phone: '9876543212',
    },
  ]);

  // Create donor profile for donor user
  await Donor.create({
    userId: users[1]._id,
    bloodGroup: 'B+',
    location: 'Pune',
    age: 28,
    weight: 72,
    lastDonated: new Date('2024-06-01'),
    availability: true,
    medicalHistory: 'None',
  });

  // Create a sample request for receiver
  await Request.create({
    requesterId: users[2]._id,
    bloodGroup: 'B+',
    location: 'Pune',
    unitsRequired: 2,
    urgency: 'urgent',
    status: 'pending',
    notes: 'Need blood urgently for surgery',
  });

  console.log('✅ Seed data inserted successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('─────────────────────────────────');
  console.log('Admin:    admin@bloodbank.com    | Password@123');
  console.log('Donor:    donor@bloodbank.com    | Password@123');
  console.log('Receiver: receiver@bloodbank.com | Password@123');
  console.log('─────────────────────────────────\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
