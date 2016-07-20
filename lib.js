var terminate_code = 13;


var router = {};

router.commands = [];
router.currentInput = '';

router.init = function() {
  window.addEventListener('keyup', function(e) {
    if(e.keyCode === terminate_code) {
      router.process();
    } else {
      if(e.key.length !== 1) return;
      router.currentInput += e.key;
    }
  })
};

router.message = function(command, runner) {
  router.commands[command] = runner;
  return router;
}

router.speakOptions = function() {
  for(var key in router.commands) {
    router.speak(key);
  }
}

router.commandNotFound = function() {
  router.speak('No such command, try again.')
}

router.process = function() {
  var trimmed = router.currentInput.trim();
  if(router.commands[trimmed]) {
    router.commands[trimmed].call();
  } else {
    router.commandNotFound()
  }
  router.currentInput = '';
}

router.speak = function(text, done) {
  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.rate = 1.0;
  u.onend = done;
  speechSynthesis.speak(u);
}
