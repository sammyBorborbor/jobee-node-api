const Job = require("../models/job");
const geocoder = require('../utils/geocoder');

// Get all jobs => /api/v1/jobs
exports.getJobs = async (_req, res, _next) => {
    const jobs = await Job.find();

    res.status(200).json({
        success: true, message: "Jobs fetched successfully", data: jobs
    });
}

// Create a New Job => /api/v1/job/new
exports.newJob = async (req, res, _next) => {
    const jobs = await Job.create(req.body);
    res.status(200).json({
        success: true, results: jobs.length, data: jobs
    });
}

// update a job => /api/v1/job/:id
exports.updateJob = async (req, res, _next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false, message: "Job not found"
        });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true, useFindAndModify: false
    });

    res.status(200).json({
        success: true, message: "Job updated successfully", data: job
    });
}

// delete a job => /api/v1/job/:id
exports.deleteJob = async (req, res, _next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false, message: "Job not found"
        });
    }

    job = await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true, message: "Job deleted successfully", data: job
    });
}

// Get a single job => /api/v1/job/:id/:slug
exports.getJob = async (req, res, _next) => {
    const job = await Job.find({$and: [{_id: req.params.id}, {slug: req.params.slug}]});
    if (!job || job.length === 0) {
        return res.status(404).json({
            success: false, message: "Job not found"
        });
    }

    res.status(200).json({
        success: true, data: job
    });
};

// Search jobs with radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, _next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[1].longitude;

    const radius = distance / 3963;

    const jobs = await Job.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius]
            }
        }
    });

    res.status(200).json({
        success: true, results: jobs.length, data: jobs
    });

}

// Get stats about a topic(job) => /api/v1/job/stats/:topic
exports.jobStats = async (req, res, _next) => {
    const stats = await Job.aggregate([
        {
            $match: {$text: {$search: "\"" + req.params.topic + "\""}}
        },
        {
            $group: {
                _id: {$toUpper: '$experience'},
                totalJobs: {$sum: 1},
                avgPosition: {$avg: '$position'},
                avgSalary: {$avg: "$salary"},
                minSalary: {$min: "$salary"},
                maxSalary: {$max: "$salary"},
            }
        }
    ]);

    if (stats.length === 0) {
        return res.status(404).json({
            success: false, message: `No stats found for - ${req.params.topic}`
        });
    }

    res.status(200).json({
        success: true, data: stats
    })
};

