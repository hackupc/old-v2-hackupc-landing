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
  del = require("del"),
  flatten = require("gulp-flatten"),
  combiner = require("stream-combiner2");

// Tarea para compilar estilos SCSS a CSS
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

// Tarea para minificar scripts
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

// Copiar fuentes
function fonts() {
  return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/assets/fonts"));
}

// Copiar dependencias desde bower_components
function dependencies() {
  return gulp
    .src(["bower_components/**/*.min.js", "!bower_components/**/src/**/*.min.js"])
    .pipe(flatten({ includeParents: 0 }))
    .pipe(gulp.dest("dist/assets/js"));
}

// Optimizar imágenes
function images() {
  return gulp.src("src/images/**/*").pipe(imagemin()).pipe(gulp.dest("dist/assets/img"));
}

// Copiar plantillas
function templates() {
  return gulp.src("src/templates/**/*").pipe(gulp.dest("dist/assets/templates"));
}

// Copiar datos
function data() {
  return gulp.src("src/data/**/*").pipe(gulp.dest("dist/assets/data"));
}

// Limpiar archivos generados
function clean() {
  return del(["dist/assets/css", "dist/assets/js", "dist/assets/img"]);
}

// Tarea default
exports.default = gulp.series(clean, gulp.parallel(dependencies, styles, scripts, images, fonts, templates, data));

// Watch para cambios en archivos
function watchFiles() {
  gulp.watch("src/styles/**/*.scss", styles);
  gulp.watch("src/scripts/**/*.js", scripts);
  gulp.watch("src/fonts/**/*", fonts);
  gulp.watch("src/images/**/*", images);
  gulp.watch("src/data/**/*", data);
  gulp.watch("src/templates/**/*", templates);
  gulp.watch("bower_components/**/*.min.js", dependencies);
}

exports.watch = watchFiles;
exports.build = gulp.series(clean, gulp.parallel(dependencies, styles, scripts, images, fonts, templates, data));
