var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', function() {
    //gulp.watch('app/**/*.js', ['browserify'])
    gulp.watch('sass/**/*.scss', ['sass'])
});

gulp.task('default', ['watch']);