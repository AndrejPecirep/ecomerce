function ownerMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }
  next();
}

module.exports = ownerMiddleware;
