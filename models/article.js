const mongoose = require('mongoose');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const { marked } = require('marked');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  contentHtml: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate the slug and convert markdown to sanitized HTML
articleSchema.pre('validate', function (next) {
  console.log('Pre Save Hook : ', this)
  // Generate slug from title
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Convert markdown to HTML
  if (this.markdown) {
    const rawHtml = marked(this.markdown);

    // Sanitize the HTML content to prevent XSS attacks
    this.contentHtml = dompurify.sanitize(rawHtml);
  }

  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

