const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// GET: Display all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({createdAt : -1});
        res.render('articles/home', { articles });
    } catch (error) {
        console.log('Error fetching articles:', error);
        res.status(500).send('Error fetching articles');
    }
});

// GET: Display new article form
router.get('/new', (req, res) => {
    try {
        res.render('articles/new', { article: new Article() });
    } catch (error) {
        console.log('Error rendering new article form:', error);
        res.status(500).send('Error rendering new article form');
    }
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

// GET: Display single article by slug
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug }); // Find article by slug
        if (article == null) {
            return res.status(404).redirect('/'); // Redirect to articles list if not found
        }
        res.render('articles/show', { article: article });
    } catch (error) {
        console.log('Error fetching article by slug:', error);
        res.status(500).send('Error fetching article');
    }
});

// POST: Create a new article
router.post('/', async (req, res, next) => {
    try {
        req.article = new Article();
        next();
    } catch (error) {
        console.log('Error initializing new article:', error);
        res.status(500).send('Error initializing new article');
    }
}, saveArticleAndRedirect('new'));

// PUT: Update an article
router.put('/:id', async (req, res, next) => {
    try {
        req.article = await Article.findById(req.params.id);
        if (!req.article) {
            return res.status(404).send('Article not found');
        }
        next();
    } catch (error) {
        console.log('Error fetching article for update:', error);
        res.status(500).send('Error fetching article for update');
    }
}, saveArticleAndRedirect('edit'));

// DELETE: Delete a single article by ID
router.delete('/:id', async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found from delete route');
        }
        res.redirect('/articles'); // Redirect to the articles list after deleting
    } catch (error) {
        console.log('Error deleting article:', error);
        res.status(500).send('Error deleting article');
    }
});

// Save article and redirect
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        try {
            article = await article.save(); // Save the article to the database
            res.redirect(`/articles/${article.slug}`); // Redirect to the article's show page
        } catch (error) {
            console.log('Error while saving article:', error);
            res.render(`articles/${path}`, { article: article }); // Re-render the form with current data
        }
    };
}

module.exports = router;
