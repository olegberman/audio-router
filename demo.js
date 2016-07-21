
router.init();

router

.on('create block', () => {
  router.ask('Which color?', (color) => {
    addBlock(color);
    router.speak('block added')
  })
})

.on('change title to :text', (text) => {
  document.title = text;
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
