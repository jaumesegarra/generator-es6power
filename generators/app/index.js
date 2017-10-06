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
            'This is the awesome and amazing ' + chalk.red('ES6') + ' power generator!'
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
        },{
                type: 'checkbox',
                name: 'options',
                message: 'What would you like to include?',
                choices: [
                    {
                      name: 'Lodash',
                      checked: true
                    },
                    {
                      name: 'Jquery',
                      checked: false
                    }
                ]
        }];

        this.prompt(prompts, function (props) {
            if ((props.options).indexOf('Lodash') !== -1 ) props.lodash = true;
            if ((props.options).indexOf('Jquery') !== -1 ) props.jquery = true;

            props.babel_plugins = [];
            props.dependencies = {};
            props.dev_dependencies = {
                "babel-preset-es2015": "^6.24.1",
                "babelify": "^7.3.0",
                "browser-sync": "^2.18.13",
                "browserify": "^14.4.0",
                "gulp": "^3.9.1",
                "gulp-minify-html": "^1.0.6",
                "gulp-sass": "^3.1.0",
                "gulp-sequence": "^0.4.6",
                "gulp-uglify": "^3.0.0",
                "vinyl-buffer": "^1.0.0",
                "vinyl-source-stream": "^1.1.0"
            };

            if(props.lodash){
                props.babel_plugins.push("lodash");
                props.dependencies["lodash"] = "^4.17.4";
                props.dev_dependencies["babel-plugin-lodash"] = "^3.2.11";
            }

            if(props.jquery){
                props.dependencies["jquery"] = "^3.2.1";
            }

            props.babel_plugins = JSON.stringify(props.babel_plugins);
            props.dependencies = JSON.stringify(props.dependencies);
            props.dev_dependencies = JSON.stringify(props.dev_dependencies);

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
                    license: this.props.license,
                    dependencies: this.props.dependencies,
                    dev_dependencies: this.props.dev_dependencies
                }
            );
            this.fs.copy(
                this.templatePath('_gulpfile.js'),
                this.destinationPath('gulpfile.js')
            );
        },

        //Copy the project files
        projectfiles: function () {
            this.fs.copyTpl(
                this.templatePath('_.babelrc'),
                this.destinationPath('.babelrc'), {
                    babel_plugins: this.props.babel_plugins
                }
            );
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
            this.fs.copyTpl(
                this.templatePath('_src/_js/_app.js'),
                this.destinationPath('src/js/app.js'),{
                    lodash:this.props.lodash,
                    jquery: this.props.jquery
                }
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