var terminate_code = 13;

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

var debouncedSpeak = debounce(function() {
  router.speak(router.currentInput)
}, 500);

var router = {};

router.commands = [];
router.currentInput = '';

router.next = undefined;

router.init = function() {
  window.addEventListener('keyup', function(e) {
    debouncedSpeak()
    console.log(e)
    if(e.keyCode === terminate_code) {
      router.process();
    } else if(e.keyCode === 8) {
      var inputArr = router.currentInput.split(' ');
      if(inputArr < 2) {
        return false;
      } else {
        inputArr.pop();
        router.currentInput = inputArr.join(' ')
      }
    } else {
      if(e.key.length !== 1) return;
      router.currentInput += e.key;
    }
    e.preventDefault()
    return false;
  }, false)

  window.addEventListener('keydown', function(e) {
    e.preventDefault()
    return false;
  })
};

router.on = function(command, runner) {
  router.commands[command] = runner;
  return router;
}

router.ask = function(question, answered) {
  if(typeof arguments[1] === 'function') {
      router.next = answered
  }
  if(typeof arguments[1] === 'boolean') {
    router.multiWordInput = true;
  }
  router.speak(question)
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
  var out = [];
  if(sbj_arr.length !== tpl_arr.length) return
  for(var i = 0; i < sbj_arr.length; i++) {
    if(tpl_arr[i] === ok_char) {
      out.push(sbj_arr[i]);
      continue;
    }
    if(!word_match_with_typos(sbj_arr[i], tpl_arr[i], 1)) {
      return false;
    }
  }
  return out;
}

var word_match_with_typos = function(word_subj, word_tpl, typos) {
  var letters_subj = word_subj.split('')
  var letters_tpl = word_tpl.split('')
  var typo_counter = 0
  for(var i = 0; i < letters_tpl.length; i++) {
    if(letters_subj[i] !== letters_tpl[i]) {
      typo_counter++
    }
  }
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
    if(key === '@') {
      templates.push(key)
    }
  }
  console.log(templates)
  if(!templates.length) return []
  var out = []
  var name
  for(var i = 0; i < templates.length; i++) {
    var template = templates[i]
    var tplwords = template.toLowerCase().split(' ')
    if(tplwords.length !== words.length) continue
    out = extract_params(words, tplwords, '@')
    if(out) {
      name = template
      return [name, out]
    }
  }
  return [name, out]
}

router.process = function() {
  if(router.next) {
    router.next(router.currentInput)
    router.next = undefined
    router.currentInput = ''
    return
  }
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
    if(router.commands['@']) {
      router.commands['@'].apply(this, [router.currentInput]);
      router.currentInput = '';
      return;
    }
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
