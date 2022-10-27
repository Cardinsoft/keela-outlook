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
import { basename } from "path";
import sass from "sass";
import tsify from "tsify";
import buffer from "vinyl-buffer";
import source from "vinyl-source-stream";

import config from "./gulp.config.json";

process.chdir("..");

export const buildCSS = () => {
  return gulp
    .src(config.paths.src.css)
    .pipe(gsass(sass)())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("dist"))
    .on("error", (args) => {
      console.debug(args);
    });
};

export const buildJS = (entryPath: string, bundleName: string) => () => {
  return browserify({
    debug: true,
    entries: [entryPath],
    cache: {},
    packageCache: {},
  })
    .plugin(tsify)
    .bundle()
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(uglify({ mangle: false, output: { webkit: true } }))
    .pipe(gulp.dest("dist"));
};

export const injectLocalCSS = () => {
  return inject(gulp.src(config.paths.dist.css), {
    removeTags: true,
    transform: (_path, file) => {
      return `<style>\n${file?.contents?.toString("utf-8") || ""}\n</style>`;
    },
  });
};

export const injectLocalJS = () => {
  return inject(
    gulp.src([
      config.paths.dist.js.gas,
      // config.paths.external.cardin,
      // config.paths.external.keela,
      config.paths.dist.js.entry,
    ]),
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
    .pipe(gulp.dest("dist"));
};

export const cleanDist = () => {
  return del(
    [
      "dist/*",
      "!dist/*.html",
      "!dist/assets",
      "!dist/public",
      "!dist/*.xml",
      "!dist/*.json",
    ],
    {
      force: true,
    }
  );
};

export const copyAssets = () => {
  return gulp.src(config.paths.src.assets).pipe(gulp.dest("dist/assets"));
};

export const copyIcons = () => {
  return gulp.src(config.paths.src.icons).pipe(gulp.dest("dist/public/icons"));
};

export const copyManifests = () => {
  return gulp
    .src([config.paths.manifests.gas, config.paths.manifests.outlook])
    .pipe(gulp.dest("dist"));
};

export default gulp.series(
  gulp.parallel(
    buildCSS,
    buildJS(config.paths.src.ts.gas, basename(config.paths.dist.js.gas)),
    buildJS(config.paths.src.ts.entry, basename(config.paths.dist.js.entry)),
    copyAssets,
    copyIcons,
    copyManifests
  ),
  bundle,
  cleanDist
);
