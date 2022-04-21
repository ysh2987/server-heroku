const express = require('express');
const data = require('./data');

// Mock Data
let posts = [...data];

// Route
const apiRouter = express.Router();

// fuction
const getPostOwner = (id) => posts.filter((post) => post.owner.id === id);
const getMaxId = (items) => Math.max(...items.map(({ id }) => id), 0);
const getPost = (id) => posts.find((post) => post.id === +id);
const changePost = (newPost) => {
  posts = posts.map((post) => (post.id === newPost.id ? newPost : post));
};

// GET
apiRouter.get('/posts', (req, res) => {
  res.status(200).json(posts);
});

apiRouter.patch('/posts/setting/:ownerId', (req, res) => {
  const {
    params: { ownerId },
    body: { nickname },
  } = req;

  posts = posts.map((post) =>
    post.owner.id === ownerId
      ? {
          ...post,
          owner: { ...post.owner, nickname },
        }
      : post,
  );

  res.send(getPostOwner(posts));
});

apiRouter.get('/posts/setting/:ownerId', (req, res) => {
  const {
    params: { ownerId },
  } = req;
  res.send(getPostOwner(ownerId));
});

// create post
apiRouter.post('/posts', (req, res) => {
  // body is not null
  const { title, city, sportsTypes, content, date, owner } = req.body;

  try {
    const newPost = {
      id: getMaxId(posts) + 1,
      title,
      city,
      sportsTypes,
      content,
      date,
      recruit: true,
      comments: [],
      likeCount: 0,
      owner,
    };

    posts = [newPost, ...posts];

    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send(error);
  }
});

apiRouter.get('/posts/:id', (req, res) => {
  const { id } = req.params;

  try {
    res.send(getPost(id));
  } catch (e) {
    console.error(e);
  }
});

apiRouter.post('/posts/:id/comments', (req, res) => {
  const {
    params: { id },
    body: { content, date, owner },
  } = req;

  try {
    const pick = getPost(id);
    const newComment = {
      id: getMaxId(pick.comments) + 1,
      content,
      date,
      owner,
    };
    const newPost = { ...pick, comments: [...pick.comments, newComment] };

    changePost(newPost);

    res.send(newPost);
  } catch (e) {
    console.error(e);
  }
});

module.exports = apiRouter;
