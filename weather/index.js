'use strict';

const YQL = require('yql');
const _ = require('lodash');

module.exports = (opts, callback) => {
	opts = opts || [];

	let query;

	/*
	Build a Yahoo weather request, with default city and country
	OR with application launch arguments (opts[1] : city and opts[2] : country)
	*/
	if (_.isEmpty(opts)) {
		query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Dhaka, Bangladesh")');
	} else {
		query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + opts[0] + ', ' + opts[1] + '")');
	}

	//Send the request
	query.exec((err, response) => {
		//If request return an error, call callback error
		if (err) {
			return callback(err);
		}

		//If request return valid data, call callback response
		callback(null, response);
	});
};
