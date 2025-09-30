const Job = require('../models/Job');   // Job Model
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdBy');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const getJob = async (req, res) => {
  const {
    user: { userId },       // nested destructuring - getting from Auth middleware
    params: { id: jobId }   // destructure the id from the route  '/:id' and rename to 'jobId'
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;         // Assign 'user.userId' to 'createdBy'
  console.log(req.body);
  const job = await Job.create(req.body);       // Create the job
  console.log(job);
  res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async(req, res) => {
  const {
    body: { company, position },
    user: { userId },       // nested destructuring - getting from Auth middleware
    params: { id: jobId }   // destructure the id from the route  '/:id' and rename to 'jobId'
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or position cannot be empty');
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {                       // ***** OPTIONAL *****
      new: true,            // return new updated Job if successful
      runValidators: true,  // Run validation defined in ../models/Job.js
    }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
}
 
const deleteJob = async (req, res) => {
  const {
    user: { userId },       // nested destructuring - getting from Auth middleware
    params: { id: jobId }   // destructure the id from the route  '/:id' and rename to 'jobId'
  } = req

  console.log('Delete userId:', userId);
  console.log('Delete jobId:', jobId);

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Job deleted successfully'});
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}