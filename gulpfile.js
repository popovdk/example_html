let preprocessor = 'sass';

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const del = require('del');

function browsersync() {
	browserSync.init({
		server: { baseDir: 'dist/' }, // Папка сервера
		notify: false,
		online: true // Открывать порты для доступа с другового устройства через wifi: true или false
	})
}

function scripts() {
	return src([
		'app/js/main.js',
		])
	.pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(uglify()) // Сжимаем JavaScript
	.pipe(sourcemaps.write())
	.pipe(dest('dist'))
	.pipe(browserSync.stream())
}

function styles() {
	return src('app/' + preprocessor + '/main.' + preprocessor + '') // Выбираем источник в зависимости от препроцессора
	.pipe(sourcemaps.init())
	.pipe(eval(preprocessor)())
	.pipe(concat('app.css'))
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }} )) // Минифицируем стили
	.pipe(sourcemaps.write())
	.pipe(dest('dist'))
	.pipe(browserSync.stream())
}

function html () {
	return src(['app/**/*.html'], { base: 'app' })
	.pipe(dest('dist'))
	.pipe(browserSync.stream())
}

// Удаляем всё содержимое папки "dist/"
function cleandist() {
	return del('dist/**/*', { force: true })
}

function startwatch() {
	watch(['app/**/*.js'], scripts);
	watch('app/**/' + preprocessor + '/**/*', styles);
	watch('app/**/*.html').on('change', html);
}

exports.serve = parallel(cleandist, html, styles, scripts, browsersync, startwatch);
