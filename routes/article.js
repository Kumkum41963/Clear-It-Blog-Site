const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// GET: Display list of articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' }); // Fetch all articles from the database
        res.render('articles/home', { articles: articles });
    } catch (error) {
        console.log('Error fetching articles:', error);
        res.status(500).send('Error fetching articles');
    }
});

// GET: Display new article form
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article });
});

router.put('/:id', async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    try {
        await article.save(); // Save the article to the database
        res.redirect(`/articles/${article.slug}`); // Redirect to the new article's page
    } catch (error) {
        console.log('Error while saving article:', error);
        res.render('articles/new', { article: article }); // Re-render the new article form with the current data
    }
})

// GET: Display single article by ID
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug }); // Find article by ID
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.render('articles/show', { article: article });
    } catch (error) {
        console.log('Error fetching article by ID:', error);
        res.status(500).send('Error fetching article');
    }
});

// POST: Create a new article
router.post('/', async (req, res,next) => {
   req.article=new Article()
   next()
},saveArticleAndRedirect('new'));

// DELETE : Delete single article by ID
router.delete('/:id', async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.redirect('/articles'); // Redirect after deleting
    } catch (error) {
        console.log('Error deleting article:', error);
        res.status(500).send('Error deleting article');
    }
});


function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown


        try {
            await article.save(); // Save the article to the database
            res.redirect(`/articles/${article.slug}`); // Redirect to the new article's page
        } catch (error) {
            console.log('Error while saving article:', error);
            res.render(`articles/${path}`, { article: article }); // Re-render the new article form with the current data
        }
    }
}

module.exports = router;


// method-over-ride -> a library that within a form allows us to use other methods except for get/post