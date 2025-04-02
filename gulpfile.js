const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Define the build task
gulp.task('build', function(done) {
    return gulp.src('src/*.js') // Source files
        .pipe(uglify())         // Minify the JavaScript
        .pipe(rename({ extname: '.min.js' })) // Rename with .min.js extension
        .pipe(gulp.dest('dist')) // Output to dist folder
        .on('end', done);       // Signal task completion
});

// Optional: Default task to run 'build' when you just type 'gulp'
gulp.task('default', gulp.series('build'));
