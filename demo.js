
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
.message('hello @ fuck @', (str1, str2) => {
  router.speak('hello '+str1+' fuck '+str2);
})
