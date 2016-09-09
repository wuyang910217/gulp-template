var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    wrap = require('gulp-wrap'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

gulp.task('buildHome', function(){
  gulp.src('./source/pages/index.html')
          .pipe(wrap({src:'source/layout/home_layout.html'}))
          .pipe(gulp.dest('./dist/'));
});

gulp.task('buildMain', function(){
  gulp.src('./source/pages/main.html')
          .pipe(wrap({src:'source/layout/main_layout.html'}))
          .pipe(gulp.dest('./dist/'));
});

gulp.task('cp', function(){
  gulp.src('./source/js/main.js',)
          .pipe(gulp.dest('./dist/js'));
});

gulp.task('imagemin', function(){
  gulp.src('./source/assets/*')
          .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: flase}],
            use: [pngquant()]
          }))
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
          .pipe(gulp.dest('./dist/styles/'))
          .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync',['buildHome','buildMain'],function(){
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
  gulp.watch(['source/js/main.js'], ['cp']);
});

gulp.task('default', ['browser-sync','watch','imagemin']);
