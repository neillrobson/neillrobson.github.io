import markdownIt from "markdown-it";
import yaml from "js-yaml";
import eleventyPluginSass from "@jgarber/eleventy-plugin-sass";

export default async function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setLayoutsDirectory("_layouts");

  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    yaml.load(contents)
  );

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!--more-->",
  });

  const twoDigits = (n) => String(n).padStart(2, "0");

  eleventyConfig.addFilter("md", (content) => {
    return markdownIt({ html: true, typographer: true }).render(content);
  });
  eleventyConfig.addFilter(
    "dateToUrl",
    (date) =>
      `${date.getFullYear()}/${twoDigits(date.getMonth() + 1)}/${twoDigits(
        date.getDate() + 1
      )}`
  );

  eleventyConfig.addPlugin(eleventyPluginSass);
}
