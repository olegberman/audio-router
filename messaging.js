'use strict';

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

let chats = []

app.use(express.static('.'));
app.get('/chat/:chat_id/', (req, res, next) => {
  let chat_id = Number(req.params.chat_id)
  if(!chats[chat_id]) {
    chats[chat_id] = [];
  }
  res.header('Access-Control-Allow-Origin', '*');
  return res.json(chats[chat_id])
});

app.post('/chat/:chat_id', (req, res, next) => {
  let chat_id = Number(req.params.chat_id)
  if(!chats[chat_id]) {
    chats[chat_id] = [];
  }
  const from = req.body.from
  const message = req.body.message
  console.log(from, message)
  res.header('Access-Control-Allow-Origin', '*');
  var msg = {
    from: from,
    message: message
  };
  chats[chat_id].push(msg)
  return res.json(msg)
});

app.listen(5000);
