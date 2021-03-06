var gulp        = require('gulp'),
    minifycss   = require('gulp-minify-css'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    uglify      = require('gulp-uglify'),
    usemin      = require('gulp-usemin'),
    imagemin    = require('gulp-imagemin'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    notify      = require('gulp-notify'),
    cache       = require('gulp-cache'),
    changed     = require('gulp-changed'),
    rev         = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del         = require('del'),
    ngannotate  = require('gulp-ng-annotate');


// JShint task
gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
             .pipe(jshint())
             .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'copytemplates', 'imagemin','copyfonts');
});

// JSHint task
gulp.task('usemin',['jshint'], function () {
  // temporarily serving dishdetail page for debugging
  //return gulp.src('./app/menu.html')
  // return gulp.src('./app/dishdetail.html')
  return gulp.src('./app/index.html')
             .pipe(usemin({
               css:[minifycss(),rev()],
               js: [ngannotate(),uglify(),rev()]
             }))
             .pipe(gulp.dest('dist/'));
});

// CopyTemplates task
gulp.task('copytemplates', ['clean'], function() {
   gulp.src('./app/menu.html')
       .pipe(gulp.dest('./dist/'));

   gulp.src('./app/dishdetail.html')
       .pipe(gulp.dest('./dist/'));

   gulp.src('./app/contactus.html')
       .pipe(gulp.dest('./dist/'));
});

// Imagemin task
gulp.task('imagemin', function() {
  return del(['dist/images']), 
         gulp.src('app/images/**/*')
             .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
             .pipe(gulp.dest('dist/images'))
             .pipe(notify({ message: 'Images task complete' }));
});

// CopyFonts task
gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
       .pipe(gulp.dest('./dist/fonts'));
   
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
       .pipe(gulp.dest('./dist/fonts'));
});

// Browser-Sync task
gulp.task('browser-sync', ['default'], function () {
  var files = [
     'app/**/*.html',
     'app/styles/**/*.css',
     'app/images/**/*.png',
     'app/scripts/**/*.js',
     'dist/**/*'
  ];

  browserSync.init(files, {
    server: {
       baseDir: "dist",
       // temporarily serving dishdetail page for debugging
       //index: "menu.html"
       //index: "dishdetail.html"
       index: "index.html"
    }
  });

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});
 
// Watch ***
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
  
  // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);

});