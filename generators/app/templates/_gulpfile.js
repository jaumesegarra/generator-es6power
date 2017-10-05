var gulp        = require('gulp'),
    browserSync  = require('browser-sync'),
    processhtml  = require('gulp-minify-html'),
    gulpSequence = require('gulp-sequence'),
    sass = require('gulp-sass'),
    browserify  = require('browserify'),
    babelify    = require('babelify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify');

// js
gulp.task('js', function () {
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('js/app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

// html
gulp.task('html', function() {
  return gulp.src('./src/templates/**/*')
    .pipe(processhtml())
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
});

// sass
gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });

  gulp.watch('./src/templates/**/*', ['html']);
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});
 
gulp.task('default', gulpSequence(['html', 'sass', 'js'], 'serve'));