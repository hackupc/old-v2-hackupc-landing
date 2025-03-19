const gulp = require("gulp"),
  sass = require("gulp-sass")(require("sass")),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("gulp-cssnano"),
  jshint = require("gulp-jshint"),
  uglify = require("gulp-uglify"),
  imagemin = require("gulp-imagemin"),
  rename = require("gulp-rename"),
  concat = require("gulp-concat"),
  cache = require("gulp-cache"),
  livereload = require("gulp-livereload"),
  del = require("del");

// Compile SCSS to CSS
function styles() {
  return gulp
    .src("src/styles/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cssnano())
    .pipe(gulp.dest("dist/assets/css"));
}

// Minify JS
function scripts() {
  return gulp
    .src("src/scripts/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .pipe(gulp.dest("dist/assets/js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/assets/js"));
}

// Optimize Images
function images() {
  return gulp.src("src/images/**/*").pipe(imagemin()).pipe(gulp.dest("dist/assets/img"));
}

// Copy Fonts
function fonts() {
  return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/assets/fonts"));
}

// Copy Templates
function templates() {
  return gulp.src("src/templates/**/*").pipe(gulp.dest("dist/assets/templates"));
}

// Copy Data
function data() {
  return gulp.src("src/data/**/*").pipe(gulp.dest("dist/assets/data"));
}

// ✅ **New: Copy HTML files**
function html() {
  return gulp.src("src/**/*.html").pipe(gulp.dest("dist"));
}

// Clean `dist/`
function clean() {
  return del(["dist"]);
}

// Default Task
exports.default = gulp.series(clean, gulp.parallel(styles, scripts, images, fonts, templates, data, html));

// Watch for changes
function watchFiles() {
  gulp.watch("src/styles/**/*.scss", styles);
  gulp.watch("src/scripts/**/*.js", scripts);
  gulp.watch("src/fonts/**/*", fonts);
  gulp.watch("src/images/**/*", images);
  gulp.watch("src/data/**/*", data);
  gulp.watch("src/templates/**/*", templates);
  gulp.watch("src/**/*.html", html);
}

exports.watch = watchFiles;
exports.build = gulp.series(clean, gulp.parallel(styles, scripts, images, fonts, templates, data, html));
