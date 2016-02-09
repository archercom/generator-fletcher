'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');



module.exports = yeoman.generators.Base.extend({

  constructor: function () {

    yeoman.generators.Base.apply(this, arguments);

    // --skip-install, don't run npm or bower install
    this.option('skip-install');
  },



  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'what\'s good yo?'
      // 'Welcome to the premium ' + chalk.red('Fletcher') + ' generator!'
    ));

    var prompts = [
      {
        type    : 'input',
        name    : 'project',
        message : 'what are you calling your project?',
        default : _s.titleize(this.appname) // Default to current folder name
      },
      {
        type    : 'input',
        name    : 'description',
        message : 'what\'s it about?',
        default : 'Custom sub-theme based on the the Zurb Foundation base theme.'
      },
      {
        type      : 'input',
        name      : 'customGlobal',
        message   : 'do you wanna customize the JS global variable?',
        optional  : true,
        default   : _s.classify(this.appname)
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;

      this.projectName = {
        raw         : props.project,                  // Que Onda Guero
        title       : _s.titleize(props.project),     // Que Onda Guero
        underscored : _s.underscored(props.project),  // que_onda_guero
        slug        : _s.slugify(props.project),      // que-onda-guero
        classed     : _s.classify(props.project)      // QueOndaGuero
      };

      this.description = props.description;

      if (props.customGlobal) {
        this.customGlobal = props.customGlobal;
      }

      // To access props later use this.props.someOption;
      this.log(yosay(
        chalk.white('cool. building ' + props.project + '\'s project structure now...')
      ));

      done();
    }.bind(this));
  },

  writing: {

    // general settings
    // ============================================================
    projectfiles: function () {
      // hidden files can't be copied directly, we must rename them without the
      // leading dot and copy them into the correct place with the dot in place
      // gitignore
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    // setting up arrowhead
    // ============================================================
    app: function () {


      // individual files
      // ----------------------------------------
      // .info file
      this.fs.copyTpl(
        this.templatePath('arrow.info'),
        this.destinationPath(this.projectName.underscored + '.info'),
        {
          projectName: this.projectName,
          description: this.description
        }
      );


      // bower file
      this.template('bower.json');

      // gruntfile
      this.template('Gruntfile.js');

      // readme
      this.template('README.md');

      // package.json
      this.template('package.json');

      // template.php
      this.template('template.php');

      // theme-settings.php
      this.template('theme-settings.php');


      // folders
      // ----------------------------------------
      // fonts
      this.fs.copy(
        this.templatePath('fonts'),
        this.destinationPath('fonts')
      );

      // images
      this.fs.copy(
        this.templatePath('images'),
        this.destinationPath('images')
      );

      // jade
      // we copy the entire directory first
      this.fs.copy(
        this.templatePath('jade'),
        this.destinationPath('jade')
      );
      // and re-template these 2 specifically
      this.template('jade/index.jade');
      this.template('jade/00--kitchen-sink.jade');

      // js
      // pass in the project name
      var js_settings = {
        projectName: this.projectName
      };
      // use custom global if set
      if (this.customGlobal) {
        js_settings.customGlobal = this.customGlobal;
      }
      this.fs.copyTpl(
        this.templatePath('js/arrow/init.js'),
        this.destinationPath('js/' + this.projectName.slug + '/init.js'),
        js_settings
      );
      this.fs.copyTpl(
        this.templatePath('js/arrow/sample.js'),
        this.destinationPath('js/' + this.projectName.slug + '/sample.js'),
        js_settings
      );

      // misc
      this.fs.copy(
        this.templatePath('misc'),
        this.destinationPath('misc')
      );

      // scss
      this.fs.copy(
        this.templatePath('scss'),
        this.destinationPath('scss')
      );

      // templates
      this.fs.copy(
        this.templatePath('templates'),
        this.destinationPath('templates')
      );

    }

  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }

    this.log(yosay(
      'do work son'
    ));
  }

});
