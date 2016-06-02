var gulp          = require('gulp'),
    jade          = require('gulp-jade'),
    sass          = require('gulp-sass'),
    twig          = require('gulp-twig'),
    runSequence   = require('run-sequence'),
    frontMatter   = require('gulp-front-matter'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync').create();


gulp.task('default', function() {
  runSequence(
    'jade',
    'twig',
    'sass',
    'browserSync',
    'watch'
  );
});


// Provide a Server & Run BrowserSync..
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});


// Refresh the Browser..
gulp.task('refreshBrowser', function() {
  browserSync.reload();
});


// Jade Rebuild.. Jade.. Twig(YamlFrontMatter).. SASS/SCSS..
// ----------------------------------------------------------
gulp.task('jadeRebuild', function() {
  runSequence(
    'jade', // Run 'twig' after 'jade' so that
    'twig'  // it will inject changes in browser..
  );
});

gulp.task('jade', function() {
  return gulp.src('_jadefiles/**/*.jade')
    .pipe(jade({ pretty: true }))
      // Run errorHandler if have error
      .on('error', errorHandler)
    .pipe(gulp.dest('_includes'));
    // .pipe(browserSync.reload({ stream: true }));
});

gulp.task('twig', function() {
  'use strict';
  return gulp.src([
      'index.twig',
      // '*.twig',      // Disable for faster build,
      // '*/**/*.twig', // enable it when needed..
      '!_includes/**/*.twig',
      '!_layouts/**/*.twig',
      '!node_modules/**/*.twig'
    ])
    .pipe(frontMatter({
      property: 'data',
      remove: true
    }))
    .pipe(twig({errorLogToConsole: true}))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function() {
  return gulp.src([
      // 'assets/css/foundation-6.2.1.scss', // Enable to modify Foundation (take time)
      'assets/css/main.{sass,scss}'
    ])
    .pipe(sass({
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
      // Run errorHandler if have error
      .on('error', errorHandler)
    .pipe(autoprefixer({
      browser: ['last 2 versions', '> i%', 'not ie <= 8'],
      cascade: true
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});
// ----------------------------------------------------------


gulp.task('watch', function() {
  gulp.watch('_jadefiles/**/*.jade', ['jadeRebuild']);
  gulp.watch(['*.twig', '*/**/*.twig'], ['twig']);
  gulp.watch(['assets/css/**/*.{sass,scss}'], ['sass']);
  gulp.watch('assets/js/**/*.js', ['refreshBrowser']);
});


// Prevent gulp watch from break..
// ----------------------------------------------------------
function errorHandler(error) {
    // Logs out error in the command line
  console.log(error.toString());
    // Ends the current pipe, so Gulp watch doesn't break
  this.emit('end');
}
// ----------------------------------------------------------
