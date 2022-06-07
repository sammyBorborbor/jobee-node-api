const express = require("express");
const router = express.Router();
const { getJobs } = require("../controllers/jobs_controller");

router.route("/jobs").get(getJobs);

module.exports = router;