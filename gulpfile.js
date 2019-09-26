const gulp = require('gulp')

require('./gulp/build.js')
require('./gulp/clean.js')

gulp.task('default', gulp.series('clean', 'build'))