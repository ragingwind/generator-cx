'use strict';
const yeoman = require('yeoman-generator');
const _s = require('underscore.string');

module.exports = yeoman.Base.extend({
	init() {
		const cb = this.async();
		const self = this;

		this.prompt([{
			name: 'ceName',
			message: 'Chrome extension name',
			default: this.appname.replace(/\s/g, '-'),
			filter: x => _s.slugify(x)
		}], props => {
			const tpl = {
				ceName: props.ceName,
				camelCeName: _s.camelize(props.ceName),
				githubUsername: props.githubUsername,
				name: self.user.git.name(),
				email: self.user.git.email()
			};

			self.fs.copyTpl([
				`${self.templatePath()}/**`,
				'!**/index.js'
			], self.destinationPath(), tpl);

			cb();
		});
	},
	git() {
		this.spawnCommandSync('git', ['init']);
	},
	install() {
		this.installDependencies({bower: false});
	}
});
