import autoprefixer from "autoprefixer";
import browserify from "browserify";
import cssnano from "cssnano";
import del from "del";
import gulp from "gulp";
import inject from "gulp-inject";
import postcss from "gulp-postcss";
import replace from "gulp-replace";
import gsass from "gulp-sass";
import uglify from "gulp-uglify";
import sass from "sass";
import tsify from "tsify";
import buffer from "vinyl-buffer";
import source from "vinyl-source-stream";

import config from "./gulp.config.json";

export const buildCSS = () => {
  return gulp
    .src(config.paths.src.css)
    .pipe(gsass(sass)())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("../dist"))
    .on("error", (args) => {
      console.debug(args);
    });
};

export const buildJS = () => {
  return browserify({
    debug: true,
    entries: [config.paths.src.ts.entry.lib],
    cache: {},
    packageCache: {},
  })
    .plugin(tsify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify({ mangle: false, output: { webkit: true } }))
    .pipe(gulp.dest("../dist"));
};

export const injectLocalCSS = () => {
  return inject(gulp.src(config.paths.dist.css, { cwd: ".." }), {
    removeTags: true,
    transform: (_path, file) => {
      return `<style>\n${file?.contents?.toString("utf-8") || ""}\n</style>`;
    },
  });
};

export const injectLocalJS = () => {
  return inject(
    gulp.src(
      [
        config.paths.external.cardin,
        config.paths.external.keela,
        config.paths.dist.js,
      ],
      {
        cwd: "..",
      }
    ),
    {
      removeTags: true,
      transform: (_path, file) => {
        return `<script>\n${file?.contents?.toString() || ""}\n</script>`;
      },
    }
  );
};

export const injectRemoteCSS = () => {
  return replace("<!-- replace:remote:css -->", () =>
    config.paths.remote.css
      .map(
        (url, i) => `${i ? "    " : ""}<link rel="stylesheet" href="${url}">`
      )
      .join("\n")
  );
};

export const injectRemoteJS = () => {
  return replace("<!-- replace:remote:js -->", () =>
    config.paths.remote.js
      .map(
        (url, i) =>
          `${
            i ? "    " : ""
          }<script type="text/javascript" src="${url}"></script>`
      )
      .join("\n")
  );
};

export const bundle = () => {
  return gulp
    .src(config.paths.src.html)
    .pipe(injectRemoteCSS())
    .pipe(injectRemoteJS())
    .pipe(injectLocalJS())
    .pipe(injectLocalCSS())
    .pipe(gulp.dest("../dist"));
};

export const cleanDist = () => {
  return del(
    ["../dist/*", "!../dist/*.html", "!../dist/assets", "!../dist/public"],
    {
      force: true,
    }
  );
};

export const copyAssets = () => {
  return gulp.src(config.paths.src.assets).pipe(gulp.dest("../dist/assets"));
};

export const copyIcons = () => {
  return gulp
    .src(config.paths.src.icons)
    .pipe(gulp.dest("../dist/public/icons"));
};

export default gulp.series(
  gulp.parallel(buildCSS, buildJS, copyAssets, copyIcons),
  bundle,
  cleanDist
);
