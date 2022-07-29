let source_folder = '#src'; // Переменная с именем папки исходников
let project_folder = require('path').basename(__dirname); // Переменная с именем папки куда выводиться проект
let fs = require('fs'); // Для автоподключения шрифтов

// Пути к файлам и папкам
let path = {
  // Пути к исходникам
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/include_html/*.html'], // Путь в корень папки иходников, исключение файлы с _
    css: source_folder + '/scss/style.scss', // Путь к исходнику scss
    csslibs: source_folder + '/scss/libs/**.*', // Путь к библиотекам scss
    js: source_folder + '/js/script.js', // Путь к исходнику js
    jslibs: source_folder + '/js/libs/**.*', // Путь к библиотекам js
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}', // Путь к файлам в папке img и всех вложенных папок в нее с конкретным расширением
    fonts: source_folder + '/fonts/*.ttf', // Путь к файлам в папке fonts с расширением ttf
    fontsicon: source_folder + '/fonts/font-icon/**.*',
    video: source_folder + '/video/**.*',
  },
  // Пути куда выводяться готовые файлы
  build: {
    html: project_folder + '/', // Путь в корень папки вывода
    css: project_folder + '/css/', // Впуть в папку css в папке вывода
    js: project_folder + '/js/', // Впуть в папку js в папке вывода
    img: project_folder + '/img/', // Впуть в папку img в папке вывода
    fonts: project_folder + '/fonts/', // Впуть в папку fonts в папке вывода
    video: project_folder + '/video/', // Впуть в папку fonts в папке вывода
  },
  // Пути к файлам за которыми постаянная слежка
  watch: {
    html: source_folder + '/**/*.html', // Следит за всеми файлами html во всех папках исходников
    css: source_folder + '/scss/**/*.scss', // Следит за всеми файлами scss в папке scss исходников
    js: source_folder + '/js/**/*.js', // Следит за всеми файлами js в папке js исходников
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}', // Следит за файлами в папке img с конкретными расширениями
    video: source_folder + '/video/**.*',
  },
  // Путь к папке вывода (Для удаления ее)
  clean: './' + project_folder + '/'
}

// Объявление переменных
let { src, dest } = require('gulp'),
  gulp = require('gulp'), // Переменная gulp, для выполнения отдельных штук ?????
  browsersync = require('browser-sync').create(), // Переменная перезагрузки страницы
  fileinclude = require('gulp-file-include'), // Подключение разных html файлов
  del = require('del'), // Удаление папки вывода
  scss = require('gulp-sass'), // Конвертирует scss в css
  autoprefixer = require('gulp-autoprefixer'), // Автопрефиксер
  group_media = require('gulp-group-css-media-queries'), // Медиа вниз
  clean_css = require('gulp-clean-css'), // Чистит и сжимает css
  rename = require('gulp-rename'), // Переименовывает файлы (для min.css)
  uglify = require('gulp-uglify-es').default, // Сжимает js
  babel = require('gulp-babel'), // js для старых браузеров
  imagemin = require('gulp-imagemin'), // Сжатие img
  ttf2woff = require('gulp-ttf2woff'), // Конвертирует шрифт (woff)
  ttf2woff2 = require('gulp-ttf2woff2'); // Конвертирует шрифт (woff2)

// Вывод html файлов в папку вывода
function html() {
  return src(path.src.html) // Путь к исходникам html
    .pipe(fileinclude()) // Подключение html частей
    .pipe(dest(path.build.html)) // Путь вывода html
    .pipe(browsersync.stream()) // Перезагрузка
}

// Ну тут понятно
function css() {
  return src(path.src.css) // Путь к исходникам scss
    .pipe( // Конвертирует scss в css
      scss({
        outputStyle: 'expanded' // Тип сжатия готового css
      })
    )
    .pipe(group_media()) // Медиа вниз
    .pipe( // Автопрефиксер
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    .pipe(dest(path.build.css)) // Путь вывода и вывод css
    .pipe(clean_css()) // Чистит и сжимает css
    .pipe( // Добавляет min
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(path.build.css)) // Путь вывода и вывод css
    .pipe(browsersync.stream()) // Перезагрузка
}
function csslibs() {
  return src(path.src.csslibs)
    .pipe(dest(path.build.css))
}

// Вывод js файлов в папку вывода
function js() {
  return src(path.src.js) // Путь к исходникам js
    .pipe(fileinclude()) // Подключение js частей

    .pipe(dest(path.build.js)) // Путь вывода js
    .pipe( // Сжимает js
      uglify()
    )
    .pipe( // Добавляет min
      rename({
        extname: '.min.js'
      })
    )
    .pipe(dest(path.build.js)) // Путь вывода js
    .pipe(browsersync.stream()) // Перезагрузка
}
function jslibs() {
  return src(path.src.jslibs)
    .pipe(dest(path.build.js))
}

// Конвертирует img
function images() {
  return src(path.src.img) // Путь к исходникам img
    // .pipe(dest(path.build.img)) // Путь вывода img
    // .pipe(src(path.src.img)) // Путь к исходникам img
    // .pipe( // Сжатие картинок
    //   imagemin({
    //     progressive: true,
    //     svgoPlugins: [{ removeVievBox: false }],
    //     interlaced: true,
    //     optimizationLevel: 3 // 0 to 7
    //   })
    // )
    .pipe(dest(path.build.img)) // Путь вывода img
    .pipe(browsersync.stream()) // Перезагрузка
}

function video() {
  return src(path.src.video)
    .pipe(dest(path.build.video))
}

// Конвертирует шрифт
function fonts() {
  src(path.src.fonts) // Исходники шрифтов
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts)) // Путь вывода fotns
  return src(path.src.fonts) // Исходники шрифтов
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts)) // Путь вывода fotns
}

function fontsicon() {
  return src(path.src.fontsicon)
    .pipe(dest(path.build.fonts))
}

// Подключение файлов шрифтов в стили
function fontsStyle() {
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
}

// Надо для подключения файлов шрифтов в стили
function cb() { }

// Функция слежки за файлами
function watchFiles() {
  gulp.watch([path.watch.html], html); // Путь к html файлам и запуск функции html
  gulp.watch([path.watch.css], css); // Путь к css файлам и запуск функции css
  gulp.watch([path.watch.js], js); // Путь к js файлам и запуск функции js
  gulp.watch([path.watch.img], images); // Путь к img и запуск функции js
  gulp.watch([path.watch.video], video);
}

// Удаление папки вывода
function clean() {
  return del(path.clean);
}

// Функция перезагрузки страницы
function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/' // Перезагрузка после изменений в папке вывода
    },
    port: 3000,
    notify: false // Отключение надписи что страница перезагружена
  })
}

// Прописывать функции которые должны выполниться
let build = gulp.series(clean, gulp.parallel(jslibs, js, csslibs, css, html, fonts, fontsicon, images, video));
let watch = gulp.parallel(build, watchFiles, browserSync);

// Чтобы галп понимал переменные
exports.fontsStyle = fontsStyle;
exports.video = video;
exports.fonts = fonts;
exports.fontsicon = fontsicon;
exports.images = images;
exports.jslibs = jslibs;
exports.js = js;
exports.csslibs = csslibs;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch; // При запуске галпа запуск watch