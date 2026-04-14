const Request = require('../models/Request');

exports.createRequest = async (req, res, next) => {
  try {
    const request = await Request.create({ ...req.body, requesterId: req.user.id });
    res.status(201).json({ success: true, data: request });
  } catch (err) { next(err); }
};

exports.getRequests = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'receiver') filter.requesterId = req.user.id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;

    const requests = await Request.find(filter)
      .populate('requesterId', 'name email phone')
      .populate('respondedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) { next(err); }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status, respondedBy: req.user.id },
      { new: true }
    ).populate('requesterId', 'name email phone');

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (err) { next(err); }
};

exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (req.user.role !== 'admin' && request.requesterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Request.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) { next(err); }
};
