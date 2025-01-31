import { DateTime } from "luxon";
import yaml from "js-yaml";
import eleventyPluginSass from "@jgarber/eleventy-plugin-sass";

const DATE_RE = /\d{4}-\d\d-\d\d \d\d:\d\d(:\d\d)? [-+]\d{4}/;

export default async function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setLayoutsDirectory("_layouts");

  eleventyConfig.addDateParsing((dateValue) => {
    if (typeof dateValue === "string" && dateValue.match(DATE_RE))
      return DateTime.fromFormat(dateValue, "yyyy-MM-dd hh:mm z");
  });

  eleventyConfig.addDataExtension("yml,yaml", (contents) =>
    yaml.load(contents)
  );

  eleventyConfig.addPlugin(eleventyPluginSass);
}
