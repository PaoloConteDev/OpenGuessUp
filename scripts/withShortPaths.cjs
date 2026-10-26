const { withAppBuildGradle } = require("expo/config-plugins");
module.exports = function withShortPaths(config) {
  return withAppBuildGradle(config, (mod) => {
    const marker = "// Open Guess: hash long C++ object paths on Windows.";
    if (!mod.modResults.contents.includes(marker))
      mod.modResults.contents = mod.modResults.contents.replace(
        "defaultConfig {",
        `defaultConfig {\n        ${marker}\n        externalNativeBuild {\n            cmake { arguments "-DCMAKE_OBJECT_PATH_MAX=240" }\n        }`,
      );
    mod.modResults.contents = mod.modResults.contents.replace(
      "-DCMAKE_OBJECT_PATH_MAX=128",
      "-DCMAKE_OBJECT_PATH_MAX=240",
    );
    return mod;
  });
};
