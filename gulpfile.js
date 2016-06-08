var gulp           = require('gulp'),
    // HTML
    jade           = require('gulp-jade'),
    data           = require('gulp-data'),
    prettify       = require('gulp-prettify'),
    frontMatter    = require('gulp-front-matter'),
    nunjucksRender = require('gulp-nunjucks-render'),
    // markdown       = require('gulp-markdown'), // TODO
    // CSS
    sass           = require('gulp-sass'),
    nano           = require('gulp-cssnano'),
    uncss          = require('gulp-uncss'),
    csslint        = require('gulp-csslint'),
    autoprefixer   = require('gulp-autoprefixer'),
    // JS
    concat         = require('gulp-concat'),
    // Other Tools
    fs             = require('fs-extra'),
    clean          = require('gulp-clean'),
    plumber        = require('gulp-plumber'),
    runSequence    = require('run-sequence'),
    browserSync    = require('browser-sync').create();


var config = JSON.parse(fs.readFileSync('./config.json'));

// Edit path in config.json file..
var inputPath   = config.path.input,
    outputPath  = config.path.output;

// Run 'gulp help' will log all gulp commands you can use..
gulp.task('help', function() {
  console.log("________________________________________________________");
  console.log("                                                        ");
  console.log('------| Run "gulp {command}" for specific task |--------');
  console.log("--------------------------------------------------------");
  console.log("------------ All Commands <--> Description -------------");
  console.log("-------- help <--> to display all this -----------------");
  console.log("- browserSync <--> build a server only -----------------");
  console.log("------- clean <--> del all build files -----------------");
  console.log("- jadeRebuild <--> build jade n then nunjucks ----------");
  console.log("-------- jade <--> build for jade only -----------------");
  console.log("---- nunjucks <--> build for nunjucks only -------------");
  console.log("-------- sass <--> build for sass only -----------------");
  console.log("---- nunjucks <--> build for nunjucks only -------------");
  console.log("---------- js <--> build for js only -------------------");
  console.log("-------- copy <--> copy specific n statics files only --");
  console.log("------- watch <--> watch for all changess --------------");
  console.log("                                                        ");
  console.log('---- Run "gulp" will build all things above for u.. ----');
  console.log("________________________________________________________");
  console.log("                                                        ");
});


gulp.task('default', function() {
  runSequence(
    'clean',  // Clean all build files first.. Then build others..
    'jade',
    'nunjucks',
    ['sass', 'js', 'copy'],
    'browserSync',
    'watch'
  );
});


// Provide a Server & Run BrowserSync..
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: outputPath
    }
  });
});


// Clean(del) all files in build folder..
gulp.task('clean', function() {
  return gulp.src(outputPath + '*', {read: false})
    .pipe(plumber())
    .pipe(clean({ force: true }));
});


// Jade Rebuild.. Jade.. Nunjucks(YamlFrontMatter).. SASS/SCSS.. JS.. Copy(jquery,img)..
// -------------------------------------------------------------------------------------
gulp.task('jadeRebuild', function() {
  runSequence(
    'jade',  // Run 'nunjucks' after 'jade' so that
    'nunjucks'  // it will inject changes in browser..
  );
});

gulp.task('jade', function() {
  return gulp.src(inputPath + 'pages/_jadefiles/**/*.jade')
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(inputPath + 'pages/includes'));
    // .pipe(browserSync.reload({ stream: true }));
});

gulp.task('nunjucks', function() {
  'use strict';
  return gulp.src([
      inputPath + 'pages/**/*.nunjucks',
      '!' + inputPath + 'pages/includes/**/*.*'
    ])
    .pipe(plumber())
    .pipe(frontMatter({  // Get data via yaml front matter..
      property: 'data',
      remove: true
    }))
    .pipe(data(function() {  // Get data via json file..
      return JSON.parse(fs.readFileSync(inputPath + 'data.json'));
    }))
    .pipe(nunjucksRender({
      path: [inputPath]
    }))
    .pipe(prettify({ indent_size: 2 }))
    .pipe(gulp.dest(outputPath))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function() {
  return gulp.src(inputPath + 'assets/css/main.{sass,scss}')
    .pipe(sass({
      outputStyle: 'expanded',
      onError: browserSync.notify
    }))
      // Run errorHandler if have error..
      .on('error', errorHandler)
    .pipe(autoprefixer({
      browser: ['last 2 versions', '> i%', 'not ie <= 8'],
      cascade: true
    }))
    .pipe(uncss({
      html: [outputPath + 'index.html', outputPath + '**/*.html'],
      ignore: [
        // Add more to ignore..
        new RegExp('^meta\..*'),
        new RegExp('.*\.top-bar.*'),
        new RegExp('.*\.menu.*'),

        new RegExp('.*\.is-.*'),
        new RegExp('::-webkit-scrollbar*'),
        new RegExp('.charWrap'),
        new RegExp('.funnyText*')
      ]
    }))
    .pipe(nano())
    .pipe(csslint())
    // .pipe(csslint.reporter({ 'shorthand': false }))
    .pipe(gulp.dest(outputPath + 'assets/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest(inputPath + 'assets/css'));
});

gulp.task('js', function() {
  return gulp.src([
      inputPath + 'assets/js/**/*.js',
      '!' + inputPath + 'assets/js/jquery-1.12.0.min.js'
    ])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(outputPath + 'assets/js'))
    .pipe(browserSync.reload({ stream: true }));
});

// Copy specific n statics files only..
gulp.task('copy', function() {
  gulp.src(inputPath + 'assets/js/jquery-1.12.0.min.js')
    .pipe(gulp.dest(outputPath + 'assets/js'));
  gulp.src(inputPath + 'assets/img/**/*.*')
    .pipe(gulp.dest(outputPath + 'assets/img'));
  gulp.src(inputPath + 'favicon.ico')
    .pipe(gulp.dest(outputPath))
    .pipe(browserSync.reload({ stream: true }));
});
// -------------------------------------------------------------------------------------


gulp.task('watch', function() {
  gulp.watch(inputPath + 'pages/_jadefiles/**/*.jade', ['jadeRebuild']);
  gulp.watch(['*.nunjucks', '*/**/*.nunjucks'], ['nunjucks']);
  gulp.watch(inputPath + 'data.json', ['nunjucks']);
  gulp.watch(inputPath + 'assets/css/**/*.{sass,scss}', ['sass']);
  gulp.watch(inputPath + 'assets/js/**/*.js', ['js']);
  gulp.watch(inputPath + 'assets/img/**/*.*', ['copy']);
});


// Prevent gulp watch from break..
// -------------------------------------------------------------------------------------
function errorHandler(error) {
    // Logs out error in the command line..
  console.log(error.toString());
    // Ends the current pipe, so Gulp watch doesn't break..
  this.emit('end');
}
// -------------------------------------------------------------------------------------
