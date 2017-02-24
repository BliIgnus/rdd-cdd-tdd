#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

//Define the result of the "help" command of the application
const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

/**
FUNCTION _toCelcius (decimal temp)
Convert the temp var from Farenheit degrees to Celcius degrees
Return temp in Celcius degrees
*/
function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

updateNotifier({ pkg}).notify();

/*Extract the condition from the request response
	If error, display error
*/
weather(cli.input, (err, result) => {
	if (err) {
		console.log(chalk.bold.red(err));
		process.exit(1);
	}

	let condition = result.query.results.channel.item.condition.text;
	let temperature;

	/*Extract the temperature from the request response
			Temperature in the request is in Farenheit degrees
			Convert it in Celcius degrees or return it as state depending user's parameters
			Default is converting to Celcius degrees
	*/
	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} else if (cli.input[2] && cli.input[2] === 'F') {
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}

	//Get city and country from user parameters or default values
	let city = cli.input[0] ? cli.input[0] : 'Dhaka';
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh';

	//Print in console values with colors
	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
