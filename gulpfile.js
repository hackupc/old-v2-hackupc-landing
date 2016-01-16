var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    flatten = require('gulp-flatten')
    combiner = require('stream-combiner2');

gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  var combined = combiner.obj([
    gulp.src('src/scripts/**/*.js'),
    concat('main.js'),
    gulp.dest('dist/assets/js'),
    rename({suffix: '.min'}),
    uglify(),
    gulp.dest('dist/assets/js'),
    notify({ message: 'Scripts task complete' })
  ]);
  combined.on('error', console.error.bind(console));
  return combined;
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(notify({ message: 'Fonts task complete' }));
});

gulp.task('dependencies', function() {
  return gulp.src(['bower_components/**/*.min.js', '!bower_components/**/src/**/*.min.js'])
    .pipe(flatten({ includeParents: 0}))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Dependencies task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

gulp.task('default', ['dependencies', 'styles', 'scripts', 'images', 'fonts'], function() {
});

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  // Watch font files
  gulp.watch('src/fonts/**/*', ['fonts']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
  // Watch dependencies
  gulp.watch('bower_components/**/*.min.js', ['dependencies']);
});
