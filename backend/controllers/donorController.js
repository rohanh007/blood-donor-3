const Donor = require('../models/Donor');

exports.createDonor = async (req, res, next) => {
  try {
    const exists = await Donor.findOne({ userId: req.user.id });
    if (exists) return res.status(400).json({ success: false, message: 'Donor profile already exists' });
    const donor = await Donor.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: donor });
  } catch (err) { next(err); }
};

exports.getDonors = async (req, res, next) => {
  try {
    const { bloodGroup, location, availability } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (availability !== undefined) filter.availability = availability === 'true';

    const donors = await Donor.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: donors.length, data: donors });
  } catch (err) { next(err); }
};

exports.getDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('userId', 'name email phone');
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
    res.json({ success: true, data: donor });
  } catch (err) { next(err); }
};

exports.updateDonor = async (req, res, next) => {
  try {
    let donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
    if (req.user.role !== 'admin' && donor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('userId', 'name email phone');
    res.json({ success: true, data: donor });
  } catch (err) { next(err); }
};

exports.deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
    if (req.user.role !== 'admin' && donor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donor profile deleted' });
  } catch (err) { next(err); }
};
