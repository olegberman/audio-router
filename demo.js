
router.init();
var from


var pullMessages = function() {
  $.get('/chat/1', function(data) {
    shouldReadNewMessages(data)
  })
}

var fromOtherLength = 0
var shouldReadNewMessages = function(data) {
  var fromOther = data.filter(message => message.from !== from)
  if(fromOther.length > fromOtherLength) {
    var readCount = fromOther.length - fromOtherLength;
    var toRead = []
    for(var i = readCount; i > 0; i--) {
      toRead.push(fromOther[fromOther.length - i])
    }
    if(!toRead[0]) return;
    router.speak('New message from ' + toRead[0].from + '...')
    toRead.forEach(function(_msg) {
      router.speak(_msg.message)
    })
    fromOtherLength = fromOther.length
  }
}

setInterval(function() {
  pullMessages();
}, 5000);

router.ask('What is your name?', (name) => {
  from = name;
  router.speak('Nice to meet you, ' + name);
  router

  .on('read', () => {
    pullMessages()
  })

  .on('@', (msg) => {
    $.post('/chat/1', {
      message: msg,
      from: from
    })
    .done(() => {
      router.speak(msg)
      setTimeout(function() {
        router.speak('Sent!')
      }, 1000)
    })
  })
})



// .on('create block', () => {
//   router.ask('Which color?', (color) => {
//     addBlock(color);
//     router.speak('block added')
//   })
// })
//
// .on('change @', (text) => {
//   document.title = text;
//   router.ask('you just changed the title to ' + text + '. Are you happy now?', () => {
//     router.speak('I thought so', () => {
//       router.ask('I am going to bug you. Give me a number', (num) => {
//         router.speak('The double of that is ' + (Number(num) * 2))
//       })
//     })
//   })
// })
//
// .on('yo', () => {
//   var i = 3;
//   while(i--) router.speak('yo')
// })
//
// .on('list dom', () => {
//   for(var key in document.body.childNodes.values) {
//     router.speak(key)
//   }
// })
//
// var addBlock = function(color) {
//   var div = document.createElement('div');
//   div.style.width = '200px';
//   div.style.height = '200px';
//   div.style.backgroundColor = color;
//   div.style.margin = '30px';
//   document.body.appendChild(div);
// }
