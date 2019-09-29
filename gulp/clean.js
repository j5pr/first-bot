const gulp = require('gulp')

const del = require('del')

gulp.task('clean dist', (cb) => del(['dist/'], cb))

gulp.task('clean', gulp.parallel('clean dist'))
