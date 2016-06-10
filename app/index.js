const yeoman = require('yeoman-generator');
const _s = require('underscore.string');
const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');

module.exports = yeoman.Base.extend({
	init() {
		const cb = this.async();
		const self = this;

		this.prompt([{
			name: 'ceName',
			message: 'Chrome extension name',
			default: this.appname.replace(/\s/g, '-'),
			filter: x => _s.slugify(x)
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			store: true,
			validate: x => x.length > 0 ? true : 'You have to provide a username'
		}, {
			name: 'website',
			message: 'What is the URL of your website?',
			store: true,
			validate: x => x.length > 0 ? true : 'You have to provide a website URL',
			filter: x => normalizeUrl(x)
		}], props => {
			const tpl = {
				ceName: props.ceName,
				camelCeName: _s.camelize(props.ceName),
				githubUsername: props.githubUsername,
				name: self.user.git.name(),
				email: self.user.git.email(),
				humanizedWebsite: humanizeUrl(props.website)
			};

			const mv = (from, to) => {
				self.fs.move(self.destinationPath(from), self.destinationPath(to));
			};

			self.fs.copyTpl([
				`${self.templatePath()}/**`,
				'!**/index.js'
			], self.destinationPath(), tpl);

			mv('editorconfig', '.editorconfig');
			mv('gitattributes', '.gitattributes');
			mv('gitignore', '.gitignore');
			mv('_package.json', 'package.json');

			cb();
		});
	},
	git() {
		this.spawnCommandSync('git', ['init']);
	}
});
