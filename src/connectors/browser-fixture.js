const fs = require("fs");

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : "";
}

function extractFromHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const title = extractTitle(html);
  const text = stripHtml(html);
  const approxWords = text ? text.split(/\s+/).length : 0;
  return {
    title,
    text,
    charCount: text.length,
    approxWords
  };
}

module.exports = { extractFromHtmlFile };
