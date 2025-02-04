import markdownIt from "markdown-it";
import yaml from "js-yaml";
import eleventyPluginSass from "@jgarber/eleventy-plugin-sass";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import strftime from "strftime";
import MarkdownItTufte from "markdown-it-tufte";

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

  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(MarkdownItTufte);
    mdLib.set({ html: true, typographer: true });
  });

  // This filter doesn't use the same Markdown-It instance as the core Eleventy renderer.
  // Consider replacing with the official EleventyRenderPlugin if issues arise.
  eleventyConfig.addFilter("md", (content) => {
    return markdownIt({ html: true, typographer: true }).render(content || "");
  });

  eleventyConfig.addFilter("utcDate", (date, format) =>
    strftime(format, new Date(date.toUTCString().substr(0, 25)))
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
