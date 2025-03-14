import yaml from "js-yaml";
import eleventyPluginSass from "@jgarber/eleventy-plugin-sass";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import strftime from "strftime";
import MarkdownItTufte from "markdown-it-tufte";
import pullsPlugin from "./src/_plugins/pulls.js";

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
    mdLib.use(pullsPlugin);
    mdLib.set({ html: true, typographer: true });
  });

  eleventyConfig.addFilter("utcDate", (date, format) =>
    strftime(format, new Date(date.toUTCString().substr(0, 25)))
  );

  eleventyConfig.addPlugin(EleventyRenderPlugin);
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
