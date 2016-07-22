'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var clean = require('gulp-clean');
var htmlv = require('gulp-html-validator');
var jshint = require('gulp-jshint');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssvariables = require('postcss-css-variables');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');

var sourcemaps = require('gulp-sourcemaps');

var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var browserify = require('browserify');

var minify = require('gulp-minify');
var uglify = require('gulp-uglify');


const config = {
    production: !!util.env.production,
    paths:{
      css:"./build/images/TKR/NSI_CSS/",
      images:"./build/images/TKR/NSI_CSS/",
      scripts:"./build/scripts/TKR/NSI/"
    }
};

gulp.task('default', ["build"]);
gulp.task('build', ["js","css","postcss","html"]);


gulp.task('postcss', function () {
    return gulp.src('./sources/postcss/**/*.css')
        .pipe(postcss([require('postcss-nested') ,cssvariables(),autoprefixer({browsers: ['last 1 version']})]))
        .pipe(config.production ? util.noop():sourcemaps.init())
        .pipe(cleanCSS({debug: !config.production}))
        .pipe(config.production ? util.noop():sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.css))
        .pipe(browserSync.reload({ stream:true }));
});

gulp.task('css', function (){
    return gulp.src('./sources/css/**/*.*')
        .pipe(gulp.dest(config.paths.css))
        .pipe(browserSync.reload({ stream:true }));
});
gulp.task('images', function () {
    return gulp.src('./sources/css/**/*.png')
        .pipe(gulp.dest(config.paths.images));
});
gulp.task('html', function () {
    return gulp.src(['./sources/**/*.html'])
        //.pipe(htmlv())
        .pipe(gulp.dest('./build/'));
});
const aliasifyConfig = {
    aliases: {
        "./data": "./sources/js/dataDev.js"
    },
    verbose: true
}
var b = browserify({
  // Required watchify args
  cache: {}, packageCache: {}, fullPaths: true,debug: true,
  // Browserify Options
  entries: ['./sources/js/index.js'],
  extensions: ['.js'],
  debug: !config.production,

  //plugin: [watchify]
})
.on('error', util.log)
.transform("babelify", {presets: ["es2015", "react"]})
.transform('aliasify', config.production?{}:aliasifyConfig)


var bundle = function() {
  return b
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
     .pipe(config.production ?minify(): util.noop())
     .pipe(config.production ?uglify(): util.noop())
     .pipe(config.production ?util.noop():sourcemaps.init({loadMaps: true})) // loads map from browserify file
     .pipe(config.production ?util.noop():sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(config.paths.scripts))
};

gulp.task('js', function() {
  return bundle();
});
gulp.task('clean',function(){
  return gulp.src([ 'build/*'], {read: false})
  .pipe(clean());
})

// watch files for changes and reload
gulp.task('serve',['build'], function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });
  gulp.watch(['sources/postcss/**/*.css'],['postcss'])
  gulp.watch(['sources/css/**/*.*'],['css'])
  gulp.watch(['sources/*.html'],['html',browserSync.reload]);
  gulp.watch(['sources/js/**/*.js'],['js',browserSync.reload]);
});
