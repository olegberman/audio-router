
router.init();

router

.on('create block', () => {
  router.ask('Which color?', (color) => {
    addBlock(color);
    router.speak('block added')
  })
})

.on('change @', (text) => {
  document.title = text;
  router.ask('you just changed the title to ' + text + '. Are you happy now?', () => {
    router.speak('I thought so', () => {
      router.ask('I am going to bug you. Give me a number', (num) => {
        router.speak('The double of that is ' + (Number(num) * 2))
      })
    })
  })
})

.on('yo', () => {
  var i = 3;
  while(i--) router.speak('yo')
})

.on('list dom', () => {
  for(var key in document.body.childNodes.values) {
    router.speak(key)
  }
})

var addBlock = function(color) {
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.height = '200px';
  div.style.backgroundColor = color;
  div.style.margin = '30px';
  document.body.appendChild(div);
}
