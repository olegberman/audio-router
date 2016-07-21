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
  	if(tpl_arr[i] === ok_char) {
      out.push(sbj_arr[i]);
    } else {
      var good = word_match_with_typos(sbj_arr[i], tpl_arr[i], 1)
      if(!good) {
        return false;
      }
    }
  }
  return out;
}

var word_match_with_typos = function(word_subj, word_tpl, typos) {
  console.log(word_subj, word_tpl)
  var letters_subj = word_subj.split('')
  var letters_tpl = word_tpl.split('')
  if(word_subj.length <= typos) {
    if(word_subj === word_tpl) {
      return true
    } else {
      return false
    }
  }
  var typo_counter = 0
  for(var i = 0; i < letters_tpl.length; i++) {
    if(letters_subj[i] !== letters_tpl[i]) {
      typo_counter++
    }
  }
  console.log(typo_counter, typos)
  return typo_counter <= typos
}


var extract_params_and_template_name = function(input) {
  // break down input into words
  var words = input.split(' ')
  if(words.length < 2) return []
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
  var name
  templates.forEach(function(template) {
    var tplwords = template.toLowerCase().split(' ')
    if(tplwords.length !== words.length) return
    out = extract_params(words, tplwords, '@')
    if(out) name = template
  })
  return [name, out]
}

router.process = function() {
  var data = extract_params_and_template_name(router.currentInput)
  var trimmed = router.currentInput.trim();
  if(data[0] && data[1]) {
    // replace evething back to @ to find match in commands
    data[1].forEach(function(param) {
      trimmed = trimmed.replace(param, '@')
    })
  }
  if(router.commands[data[0] || trimmed]) {
    router.commands[data[0] || trimmed].apply(this, data[1] || []);
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
