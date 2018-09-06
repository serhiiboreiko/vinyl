// General
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const ghpages = require('gh-pages');

// Data
const swig = require('gulp-swig');
const data = require('gulp-data');

// Pug
const pug = require('gulp-pug');

// Styles
const concatCss = require('gulp-concat-css');
const cleanCSS = require('gulp-clean-css');

// Constants
const DATA_PATH = './src/data.json';
const PUG_PATH = './src/**/*.pug';
const STYLES_PATH = './src/styles/*.css';
const ASSETS_PATH = './src/assets/**/*';
const BUILD_PATH = 'build';

// Helpers
const getFormatedDate = () => {
  const date = new Date();
  const YYYY = date.getFullYear();
  const DD = date.getDate();
  const MM = date.getMonth() + 1;

  return `${MM}/${DD}/${YYYY}`;
}

// Tasks
gulp.task('pug', () =>
  gulp.src(PUG_PATH)
    .pipe(data((file) => JSON.parse(fs.readFileSync(DATA_PATH))))
    .pipe(swig({ defaults: { cache: false } }))
    .pipe(pug())
    .pipe(gulp.dest(BUILD_PATH))
);

gulp.task('styles', () =>
  gulp.src(STYLES_PATH)
    .pipe(concatCss('index.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(BUILD_PATH))
);

gulp.task('assets', () =>
  gulp.src(ASSETS_PATH)
    .pipe(gulp.dest(BUILD_PATH))
);

gulp.task('watch', () => {
  watch(PUG_PATH, gulp.series('pug'));
  watch(STYLES_PATH, gulp.series('styles'));
  watch(ASSETS_PATH, gulp.series('assets'));
});

gulp.task('bs', () => {
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    startPath: "/",
  });

  watch(BUILD_PATH + '/**/*', browserSync.reload);
});

gulp.task('build', gulp.parallel('styles', 'assets', 'pug'));

gulp.task('deploy', gulp.series('build', (cb) =>
  ghpages.publish(path.join(process.cwd(), 'build'), cb)
));

gulp.task('default', gulp.series('build', gulp.parallel('bs', 'watch')));
