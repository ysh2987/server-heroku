const express = require('express');

let users = [
  { id: 'test1', pw: 'test1', nickname: '강아지' },
  { id: 'test2', pw: 'test2', nickname: '고양이' },
  { id: 'test3', pw: 'test3', nickname: '두더지' },
  { id: 'test4', pw: 'test4', nickname: '호랑이' },
];

// Route
const usersRouter = express.Router();

usersRouter.post('/users', (req, res) => {
  try {
    let state = false;
    let userData = {};
    users.forEach((user) => {
      if (user.id === req.body.id && user.pw === req.body.pw) {
        state = true;
        userData.id = user.id;
        userData.nickname = user.nickname;
      }
    });
    if (state) {
      // 로그인 성공
      res.send({ state: state, data: userData });
    } else {
      // 로그인 실패
      res.send({ state: state });
    }
  } catch (e) {
    console.log(e);
  }
});

// 회원가입
usersRouter.post('/signup', (req, res) => {
  try {
    if (users.some((user) => user.id === req.body.id)) {
      res.send('0'); // id 중복: 0
    } else if (users.some((user) => user.nickname === req.body.nickname)) {
      res.send('1'); // 닉네임 중복: 1
    } else {
      users.push(req.body);
      res.send([req.body.id, req.body.nickname]);
    }
  } catch (e) {
    console.log(e);
  }
});

// 회원 탈퇴
usersRouter.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    users = users.filter((user) => user.id !== id);
    res.send(true);
  } catch (e) {
    console.log(e);
  }
});
usersRouter.patch('/users/:id', (req, res) => {
  try {
    const {
      params: { id },
      body: { nickName },
    } = req;
    const check = users.find((user) => user.nickname === nickName);
    if (check) {
      res.send({ status: '0' });
    } else {
      users = users.map((user) =>
        user.id === id ? { ...user, nickname: nickName } : user,
      );
      res.send({ nickName: nickName, status: '1' });
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = usersRouter;
