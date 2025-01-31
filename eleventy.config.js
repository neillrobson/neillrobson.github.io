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
  eleventyConfig.addFilter("md", (content) => {
    return markdownIt({ html: true, typographer: true }).render(content);
  });

  eleventyConfig.addPlugin(eleventyPluginSass);
}
