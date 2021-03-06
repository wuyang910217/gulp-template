var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    wrap = require('gulp-wrap'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('buildHome', function(){
  gulp.src('./source/pages/index.html')
          .pipe(wrap({src:'source/layout/home_layout.html'}))
          .pipe(gulp.dest('./dist/'));
});

gulp.task('buildMain', function(){
  gulp.src('source/pages/main.html')
          .pipe(wrap({src:'source/layout/main_layout.html'}))
          .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', function(){
  gulp.src('./source/js/*.js')
          .pipe(sourcemaps.init())
          .pipe(concat('main.js'))
          .pipe(uglify())
          .pipe(sourcemaps.write())
          .pipe(size())
          .pipe(gulp.dest('./dist/js'));
});

gulp.task('imagemin', function(){
  gulp.src('./source/assets/*')
          .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
          })))
          .pipe(gulp.dest('./dist/assets'));
});

function handleError(err){
  console.log(err.toString());
  this.emit('end');
}

gulp.task('sass', function(){
  gulp.src('./source/styles/main.scss')
          .pipe(sass()).on('error', handleError)
          .pipe(prefix())
          .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(size())
          .pipe(gulp.dest('./dist/styles/'))
          .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync',['buildHome','buildMain','scripts'],function(){
  browserSync({
    server: {
      baseDir: './dist/'
    }
  });
});

gulp.task('rebuild',['buildHome','buildMain'], function(){
  browserSync.reload();
});

gulp.task('watch', function(){
  gulp.watch(['**/*.html'], ['rebuild']);
  gulp.watch(['source/styles/*.scss'], ['sass']);
  gulp.watch(['source/js/main.js'], ['scripts']);
});

gulp.task('clean', function(){
  gulp.src('dist/*', {read: false})
          .pipe(clean());
});

gulp.task('default', ['clean','sass','browser-sync','watch','imagemin']);
