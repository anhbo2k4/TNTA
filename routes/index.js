const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

if (postController) {
  router.get('/', postController.getAllPosts);
  router.get('/post/:id', postController.getPostById);
  router.post('/post', postController.createPost);
  router.put('/post/:id', postController.updatePost);
  router.delete('/post/:id', postController.deletePost);
} else {
  console.error('postController is undefined');
}

module.exports = router;
