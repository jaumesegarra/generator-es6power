'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'This is the awesome and amazing ' + chalk.red('ES6') + 'power generator!'
        ));

        //Get array of inputs from the user
        var prompts = [{
                type: 'input',
                name: 'name',
                message: 'What would you love to name this project?',
                default: this.appname
        },
            {
                type: 'input',
                name: 'version',
                message: 'What is the version of the project?',
                default: "1.0.0"
        },
            {
                type: 'input',
                name: 'description',
                message: 'Please describe the project',
                default: "No description yet"
        },
            {
                type: 'input',
                name: 'author',
                message: 'What is the author\'s name?',
                default: ""
        },
            {
                type: 'input',
                name: 'repository',
                message: 'What is the project\'s GitHub repository?',
                default: "No repository yet"
        },
            {
                type: 'input',
                name: 'license',
                message: 'How would you love to license the project?',
                default: "MIT"
        }];

        this.prompt(prompts, function (props) {
            this.props = props;

            done();
        }.bind(this));
    },

    writing: {
        //Copy the confuguration files
        config: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'), {
                    name: this.props.name,
                    version: this.props.version,
                    description: this.props.description,
                    author: this.props.author,
                    repository: this.props.repository,
                    license: this.props.license
                }
            );
            this.fs.copy(
                this.templatePath('_gulpfile.js'),
                this.destinationPath('gulpfile.js')
            );
        },

        //Copy the project files
        projectfiles: function () {
            
        },

        //Copy the application files
        app: function () {
            // app/
            /////index.html
            this.fs.copyTpl(
                this.templatePath('_src/_templates/_index.html'),
                this.destinationPath('src/templates/index.html'), {
                    name: this.props.name
                }
            );

            /////////////scss
            /////////////////app.scss
            this.fs.copy(
                this.templatePath('_src/_scss/_main.scss'),
                this.destinationPath('src/scss/main.scss')
            );

            /////////////js
            /////////////////app.js
            this.fs.copy(
                this.templatePath('_src/_js/_app.js'),
                this.destinationPath('src/js/app.js')
            );

            this.fs.copy(
                this.templatePath('_src/_js/_game.js'),
                this.destinationPath('src/js/game.js')
            );
        },
    },

    install: function () {
        this.installDependencies();
    }
});