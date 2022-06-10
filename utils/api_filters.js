class ApiFilters {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryCopy = { ...this.queryString };

        const excludedFields = ['page', 'sort', 'limit', 'fields', 'q'];
        excludedFields.forEach(el => delete queryCopy[el]);

        console.log(queryCopy);

        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
        // Advanced Filtering
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-postingDate');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    searchByQuery() {
        if (this.queryString.q) {
            const searchTerm = this.queryString.q.split(',').join(' ');
            this.query = this.query.find({ $text: { $search: "\"" + searchTerm + "\"" } });
        }
        return this;
    }

    pagination() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skipResults = (page - 1) * limit;

        this.query = this.query.skip(skipResults).limit(limit);

        return this;
    }

}

module.exports = ApiFilters;