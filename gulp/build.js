const gulp = require('gulp')

const sourcemaps = require('gulp-sourcemaps')
const terser = require('gulp-terser')
const typescript = require('gulp-typescript')

gulp.task('build:typescript', () => {
    const project = typescript.createProject('tsconfig.json')

    return project.src()
        .pipe(sourcemaps.init())
        .pipe(project(typescript.reporter.fullReporter())).js
        .pipe(terser({ mangle: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'))
})

gulp.task('build', gulp.parallel('build:typescript'))