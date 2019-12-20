const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const config = require('./gulp.config');
const autoprefixer = require('gulp-autoprefixer');

function dev(){
    gulp.task('html:dev',gulp.parallel(function(){
        return gulp.src(config.html.src)
        .pipe(gulp.dest(config.html.dist))
        .pipe(reload({stream: true}));
    }));
    gulp.task('css:dev',gulp.parallel(function(){
        return gulp.src(config.css.src)
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(config.css.dist))
        .pipe(reload({stream: true}));
    }));
    gulp.task('js:dev',gulp.parallel(function(){
        return gulp.src(config.js.src)
        .pipe(gulp.dest(config.js.dist))
        .pipe(reload({stream: true}));
    }));
    gulp.task('img:dev',gulp.parallel(function(){
        return gulp.src(config.img.src)
        .pipe(gulp.dest(config.img.dist))
        .pipe(reload({stream: true}));
    }));
    gulp.task('fonts:dev',gulp.parallel(function(){
        return gulp.src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.dist))
        .pipe(reload({stream: true}));
    }));
    gulp.task('other:dev',gulp.parallel(function(){
        return gulp.src(config.other.src)
        .pipe(gulp.dest(config.other.dist))
    }));
    gulp.task('dev',gulp.parallel(['html:dev','css:dev','js:dev','img:dev','fonts:dev','other:dev'],function(){
        browserSync.init({
            port: new Date().getFullYear(),
            server: {
                baseDir: './dist/'
            },
            notify: false
        });
        gulp.watch(config.html.src, gulp.parallel(['html:dev']));
        gulp.watch(config.css.src, gulp.parallel(['css:dev']));
        gulp.watch(config.js.src, gulp.parallel(['js:dev']));
        gulp.watch(config.img.src,gulp.parallel(['img:dev']));
        gulp.watch(config.fonts.src,gulp.parallel(['fonts:dev']));
    }))

}

module.exports = dev;