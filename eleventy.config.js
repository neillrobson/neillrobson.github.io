import markdownIt from "markdown-it";
import yaml from "js-yaml";
import eleventyPluginSass from "@jgarber/eleventy-plugin-sass";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

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
    return markdownIt({ html: true, typographer: true }).render(content || "");
  });
  eleventyConfig.addFilter(
    "dateToUrl",
    (date) =>
      `${date.getUTCFullYear()}/${twoDigits(
        date.getUTCMonth() + 1
      )}/${twoDigits(date.getUTCDate())}`
  );

  eleventyConfig.addPlugin(eleventyPluginSass);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Neill Robson's Website",
      subtitle: "The blog and portfolio of a software developer.",
      base: "https://neillrobson.com",
      author: {
        name: "Neill Robson",
      },
    },
  });

  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/icon");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
}
