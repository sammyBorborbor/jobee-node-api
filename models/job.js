const mongoose = require('mongoose')
const validator = require('validator')
const slugify = require('slugify')
const geoCoder = require('../utils/geocoder')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please add a valid email address.'],
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    location: {
        type: String,
        enum: ['Point'],
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    company: {
        type: String,
        required: [true, 'Please add a company name.'],
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: ['IT', 'Finance', 'Healthcare', 'Education', 'Agriculture', 'Construction', 'Retail', 'Transport', 'Others'],
            message: 'Please select a valid industry.'
        }
    },
    jobType: {
        type: [String],
        require: true,
        enum: {
            values: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary'],
            message: 'Please select a valid job type.'
        }
    },
    minEducation: {
        type: String,
        required: true,
        enum: {
            values: ['Bachelors', 'Master', 'PhD', 'Others'],
            message: 'Please select a valid education.'
        }
    },
    positions: {
        type: Number,
        default: 1,
    },
    experience: {
        type: String,
        required: true,
        enum: {
            values: ['No Experience', '1 Year - 2 Years', '2 Years - 5 Years', '5 Years+'],
            message: 'Please select a valid experience.'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job'],
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantsApplied: {
        type: [Object],
        select: false,
    }
});

// creating job slug before saving
jobSchema.pre('save', function (next) {
    this.slug = slugify(this.title, {lower: true});
    next();
});

// setting up location
jobSchema.pre('save', async function (next) {
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    next();
});

module.exports = mongoose.model('Job', jobSchema);