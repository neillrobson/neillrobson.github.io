import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.ELEVENTY_ENV === "development";

export default {
  eleventyComputed: {
    eleventyExcludeFromCollections: (data) =>
      isDev ? data.eleventyExcludeFromCollections : true,
  },
  tags: ["posts", "drafts"],
};
