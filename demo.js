
router.init();

router

.message('hello', () => {
  router.speak('hey');
})
.message('sup', () => {
  router.speak('not much');
})
.message('help', () => {
  router.speakOptions()
})
