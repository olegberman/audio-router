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
  router.speak('No such command.')
}

var extract_params = function(sbj_arr, tpl_arr, ok_char) {
  var ok = true;
  var out = [];
  if(sbj_arr.length !== tpl_arr.length) return
  for(var i = 0; i < sbj_arr.length; i++) {
  	if(sbj_arr[i] !== tpl_arr[i]) {
    	if(sbj_arr[i] !== ok_char) {
      	out.push(sbj_arr[i])
      }
    }
  }
  return out;
}


var parseRoutesWithParams = function(input) {
  // break down input into words
  var words = input.split(' ')
  if(words.length < 2) return
  // now try to match with message patterns
  // find all registered messages with dynamic input @
  var templates = []
  for(var key in router.commands) {
    if(key.indexOf('@') !== -1) {
      templates.push(key)
    }
  }
  if(!templates.length) return
  var out = []
  templates.forEach(function(template) {
    var tplwords = template.toLowerCase().split(' ')
    if(tplwords.length !== words.length) return
    out = extract_params(words, tplwords, '@')
  })
  return out
}

router.process = function() {
  var params = parseRoutesWithParams(router.currentInput)
  var trimmed = router.currentInput.trim();
  if(params) {
    // replace evething back to @ to find match in commands
    params.forEach(function(param) {
      trimmed = trimmed.replace(param, '@')
    })
  }
  if(router.commands[trimmed]) {
    router.commands[trimmed].apply(this, params);
  } else {
    router.commandNotFound();
  }
  router.currentInput = '';
}

router.speak = function(text, done) {
  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.rate = 1.0;
  u.onend = done;
  speechSynthesis.speak(u);
  return router;
}
