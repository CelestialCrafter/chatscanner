const fs = require('fs');
const ini = require('ini');
const path = require('path');
const prompts = require('prompts');

const defaults = {
	logPath: ''
};

let read = '';

const checkLogs = (config) => {
	setInterval(() => {
		fs.readFile(config.logPath, (err, file) => {
			const logs = file.toString();
			const unprocessed = logs.split(read)[1];
			const newWords = [];

			config.words.forEach((word) => {
				if (unprocessed.toLowerCase().includes(word)) newWords.push(word);
			});

			if (newWords[0]) console.log('\x07NEW WORDS!!! ' + newWords.join(', '));
			read = logs;
		});
	}, config.delay);
}

const start = (config) => {
	fs.readFile(config.logPath, (err, file) => {
		console.log('RUNNING CHECKER!');
		const logs = file.toString();
		read = logs;
		checkLogs(config);
	});
};

prompts([
	{
		type: 'text',
		name: 'logPath',
		message: 'What is the path to your log file? (C:\\Users\\YOURUSERACCOUNTNAME\\AppData\\Roaming\\.minecraft\\logs\\latest.log - %appdata% DOES NOT WORK)'
	},
	{
		type: 'number',
		name: 'delay',
		message: 'How long do you want to wait between checks (If the number is low it will be more resource intensive - Press enter for default delay)'
	},
	{
		type: 'text',
		name: 'words',
		message: 'What words do you want to check for? (word1, word2, word3 - SPACES NEEDED)'
	}
]).then((config) => {
	if (!config.delay) config.delay = defaults.delay;
	config.words = config.words.split(', ');
	if (!config.words) throw 'You did not put in words to scan for!';
	if (!config.logPath) throw 'You did not put in the log file path!!';
	start(config);
});
