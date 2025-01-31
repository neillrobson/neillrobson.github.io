import yaml from "js-yaml";
import eleventyPluginSass from "@jgarber/eleventy-plugin-sass";

export default async function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setLayoutsDirectory("_layouts");

  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    yaml.load(contents)
  );

  eleventyConfig.addPlugin(eleventyPluginSass);
}
