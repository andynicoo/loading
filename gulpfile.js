var gulp          = require('gulp');
var sass          = require('gulp-sass');
var cleanCss      = require('gulp-clean-css');
var autoprefixer  = require('gulp-autoprefixer');
var watch         = require('gulp-watch');
var connect       = require('gulp-connect');
var testProxy     = require('./proxy');

gulp.task('connect', function() {
	connect.server({
		root      : './',
		livereload: true,
		port      : 8000,
		middleware:function(connect, opt){
			return [testProxy.handleJsonRequrest];
		}
	})
})

gulp.task('watch',function(){
    watch(['./**/*.scss'],function(e){
		gulp.src(e.path)
		//.on('error', function(err){console.log(err.message);})
		.on('end', function(){ console.log('[' + (new Date()).toString().match(/\d{2}:\d{2}:\d{2}/) + '] ' + e.path) })
		.pipe(sass().on('error',sass.logError))
		.pipe(autoprefixer())
		//.pipe(cleanCss({rebase:false}))
		.pipe(gulp.dest('./css'))
		.pipe(connect.reload())
	})
});

gulp.task('sass', function() {
    gulp.src('./sass/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cleanCss({rebase:false}))
        .pipe(gulp.dest('./css'))
});

gulp.task('default', ['sass']);