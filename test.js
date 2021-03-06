import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';

let generator;

test.beforeEach(async () => {
	await pify(helpers.testDirectory)(path.join(__dirname, 'temp'));
	generator = helpers.createGenerator('cx:app', ['../app'], null, {skipInstall: true});
});

test.serial('generates expected files', async () => {
	helpers.mockPrompt(generator, {
		ceName: 'test',
		githubUsername: 'tester',
		website: 'http://tester.com'
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'.editorconfig',
		'.git',
		'.gitattributes',
		'.gitignore',
		'background.js',
		'icon-16.png',
		'icon-128.png',
		'manifest.json',
		'license',
		'package.json',
		'readme.md'
	]);
});

test.serial('check content', async () => {
	helpers.mockPrompt(generator, {
		ceName: 'test',
		githubUsername: 'tester',
		website: 'http://tester.com'
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('package.json', /\/test/);
});
