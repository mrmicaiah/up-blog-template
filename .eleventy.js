const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/robots.txt');
  eleventyConfig.addPassthroughCopy('src/CNAME');

  // Date filters
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLLL d, yyyy');
  });

  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('isoDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISO();
  });

  // Reading time filter
  eleventyConfig.addFilter('readingTime', content => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  });

  // Excerpt filter
  eleventyConfig.addFilter('excerpt', content => {
    const stripped = content.replace(/<[^>]*>/g, '');
    return stripped.substring(0, 160) + (stripped.length > 160 ? '...' : '');
  });

  // Limit filter for collections
  eleventyConfig.addFilter('limit', (arr, limit) => {
    return arr.slice(0, limit);
  });

  // Get first n items
  eleventyConfig.addFilter('head', (arr, n) => {
    if (!Array.isArray(arr)) return [];
    if (n < 0) return arr.slice(n);
    return arr.slice(0, n);
  });

  // Markdown config
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary('md', md);

  // Collection: All posts sorted by date descending
  eleventyConfig.addCollection('posts', collection => {
    return collection.getFilteredByGlob('src/posts/*.md').sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Collection: Posts by tag
  eleventyConfig.addCollection('tagList', collection => {
    const tags = new Set();
    collection.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => tags.add(tag));
      }
    });
    return [...tags].filter(tag => tag !== 'posts');
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    },
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};