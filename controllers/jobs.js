const Job = require('../models/Job');   // Job Model
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  res.send('Get all jobs');
}

const getJob = async (req, res) => {
  res.send('Get job');
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;         // Assign 'user.userId' to 'createdBy'
  console.log(req.body);
  const job = await Job.create(req.body);       // Create the job
  console.log(job);
  res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async(req, res) => {
  res.send('Update job');
}
 
const deleteJob = async (req, res) => {
  res.send('Delete job');
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}