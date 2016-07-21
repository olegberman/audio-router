
router.init();

router

.message('my name is @', (name) => {
  router.speak('nice to meet you, ' + name);
})
.message('sup', () => {
  router.speak('not much');
})
.message('help', () => {
  router.speakOptions()
})
.message('lol', () => {
  router.speak('fuck off.');
})
.message('ha', () => {
  router.speak('fuck off you are annoying me .');
})
.message('fuck @', (str1) => {
  console.log('fuck who?' + str1)
})
