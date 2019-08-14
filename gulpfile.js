var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');

var emojis = JSON.parse(fs.readFileSync("./mumuki-emojis.json", "utf8"));

var codepoints = {};
var shortnames = {}

Object.values(emojis).forEach(function (e) {

  const value = {
    n: e.name,
    ca: e.category,
    o: e.order,
    s: e.shortname,
    ss: e.shortname_alternates,
    d: e.diversity,
    ds: e.diversities,
    co: e.code_points.fully_qualified,
    k: e.keywords,
  };

  codepoints[e.code_points.fully_qualified] = value;

  shortnames[e.shortname.replace(/:/g, '')] = value;
  if (e.shortname_alternates && e.shortname_alternates.length) {
    e.shortname_alternates.forEach((n) => shortnames[n.replace(/:/g, '')] = value);
  }
});

fs.writeFileSync("./mumuki-emojis-codepoints.json", JSON.stringify(codepoints, null, 2));
fs.writeFileSync("./mumuki-emojis-shortnames.json", JSON.stringify(shortnames, null, 2));

function clean() {
  return del('dist');
};

function images() {
  return gulp.src('assets/images/**')
    .pipe(gulp.dest('dist/images'));
};

function css() {
  return gulp.src('assets/stylesheets/**/*.css')
    .pipe(gulp.dest('dist/stylesheets'));
};

function js() {
  return gulp.src('assets/javascripts/**/*.js')
    .pipe(concat('mumuki-emojis.js'))
    .pipe(replace(/window\.muEmojis\.object = (.*);/, `window.muEmojis.object = ${JSON.stringify(codepoints)};`))
    .pipe(gulp.dest('dist/javascripts/'));
};

exports.build = gulp.series(clean, gulp.parallel(css, js, images));
