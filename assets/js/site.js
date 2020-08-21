// Add a .js utility class to <html>
var html = document.querySelector('html');
html.classList.add('js');

// Register service worker, if browser supports them
if ('serviceWorker' in navigator) {
  var scope = detectSiteScope(location.href);
  // console.log(scope.path);
  navigator.serviceWorker.register(scope.path + 'assets/js/sw.js', { scope: scope.path })
  .then(function(registration) {
    console.log('Registered service worker scoped to', registration.scope);
  })
  .catch(function(error) {
    console.error('Failed to register service worker', error)
  });

  function detectSiteScope(url) {
    var scope = {};
    scope.id = url.split('/')[3];
    scope.path = '/';
    if (scope.id.length > 0) {
      scope.path = '/' + scope.id + '/';
    }
    return scope;
  }
}

// Load up the theme switcher if @supports & custom properties available
if ('supports' in CSS && CSS.supports("(--foo: bar)")) {

  function ThemeSwitch() {
    var html = document.querySelector('html');
    var icons = {
      light: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>',
      dark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"/></svg>',
      system: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2V4a8 8 0 1 0 0 16z"/></svg>'
      // system: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zm0 2.311L4.5 7.653v8.694l7.5 4.342 7.5-4.342V7.653L12 3.311zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>'
    }
    var mode = 'system';
    var modes = ['dark','light'];
    var button = document.createElement('a');

    var cleanupOldPreferences = function() {
      // Clean up earlier `modes` item
      if (storageAvailable('localStorage')) {
        localStorage.removeItem('modes');
      }
    }

    var loadPreference = function() {
      // read from local storage
      if (storageAvailable('localStorage')) {
        if (localStorage.getItem('mode')) {
          mode = localStorage.getItem('mode');
        } else {
          mode = 'system';
        }
      }
    }

    var setModeOrder = function() {
      // reverse the modes if dark mode is preferred,
      // or if dark is set in preferences
      if ('matchMedia' in window) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches && (mode !== 'light')) {
          modes.reverse(); // ['light','dark']
        }
      }
      // system gets tacked onto the end as the last option, always
      modes.push('system');
    }

    var storePreference = function() {
      // store current mode (default or selected) in local storage
      if (storageAvailable('localStorage')) {
        localStorage.setItem('mode', mode);
      }
    }

    var setHTMLClass = function() {
      html.classList.replace(mode,modes[0]);
    }

    var cycleModes = function() {
      mode = modes.shift(); // grab the current mode from the front of the array...
      modes.push(mode); // ...and push it to the end of the array
    }

    this.switcherButton = function() {
      button.id = 'theme-button';
      button.href = '#null';
      button.title = 'Switch to ' + modes[0] + ' theme';
      button.innerHTML = icons[modes[0]];
      button.addEventListener('click', function(e) {
        e.preventDefault();
        // fix the class list on <html>
        setHTMLClass();
        cycleModes();
        storePreference();
        button.title = 'Switch to ' + modes[0] + ' theme';
        button.innerHTML = icons[modes[0]];
      });
      return button;
    }

    // Do things on construction
    cleanupOldPreferences();
    loadPreference();
    setModeOrder();
    html.classList.add(mode);
  }

  var ts = new ThemeSwitch();
  var ts_li = document.createElement('li');
  ts_li.id = 'nav-thm';
  ts_li.appendChild(ts.switcherButton());
  document.querySelector('#quick-nav .nav').appendChild(ts_li);
}


function storageAvailable(type) {
  try {
    var storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return false;
  }
}

// Move the nav to the header when there is room
// Responsive detection
function responsiveFeature(feature) {
  var size = window
    .getComputedStyle(document.body, ':after')
    .getPropertyValue('content');
  var has_feature = true;
  if(size.indexOf(feature) === -1) {
    has_feature = false;
  }
  return has_feature;
}

function ToggledNav() {
  var nav = document.querySelector('#full-nav .nav');
  var quick_nav = document.querySelector('#quick-nav .nav');
  var full_nav = document.querySelector('#full-nav');
  var thm_btn = document.querySelector('#theme-button')
  var nav_thm;
  var nav_nav;
  var nav_items = [];
  this.toggle = function() {
    if (responsiveFeature('navbar') && !html.classList.contains('navbar')) {
      if (thm_btn) {
        nav_thm = quick_nav.removeChild(document.getElementById('nav-thm'));
      }
      while (nav.firstChild) {
        if (nav.firstChild.tagName) {
          nav_items.push(nav.removeChild(nav.firstChild));
        } else {
          nav.removeChild(nav.firstChild); // remove text nodes
        }
      }
      for (var i = 0; i < nav_items.length; i++) {
        quick_nav.appendChild(nav_items[i]);
      }
      if (thm_btn) {
        quick_nav.appendChild(nav_thm);
      }
      nav_nav = quick_nav.removeChild(document.getElementById('nav-nav'));
      html.classList.add('navbar');
      full_nav.classList.add('hidden');
    }
    if (!responsiveFeature('navbar') && html.classList.contains('navbar')) {
      if (thm_btn) {
        nav_thm = quick_nav.removeChild(document.getElementById('nav-thm'));
      }
      quick_nav.appendChild(nav_nav);
      for (var i = 0; i < nav_items.length; i++) {
        nav.appendChild(nav_items[i]);
      }
      if (thm_btn) {
        quick_nav.appendChild(nav_thm);
      }
      full_nav.classList.remove('hidden');
      html.classList.remove('navbar');
    }
  }
}

var tn = new ToggledNav();
tn.toggle();

window.addEventListener('resize', function() {
  tn.toggle();
});


// Capture and replicate the current week at the top of the calendar
if ((document.querySelector('#calendar')) && (document.querySelector('#this-week'))) {
  var this_week = document.querySelector('#this-week').closest('article'); // grab this week's <article>
  var current_week = this_week.cloneNode(true); // make a copy of it,
  this_week.querySelector('#this-week').id = ''; // remove the original #this-week id
  current_week.classList.add('current'); // add a class of current to this week's article copy
  current_week.classList.remove('past'); // remove the past class
  current_week.querySelector('#this-week small').innerText = "This Week";
  document.querySelector('#content').prepend(current_week); // insert the copy at the top of the calendar
  // if (location.hash === '') {
  //  location.hash = '#this-week'; // point at the new hash position; viewport should show this one
  // }
  var btn_show_calendar = document.createElement('a');
  var past_weeks = document.querySelectorAll('article.past');
  btn_show_calendar.id = "btn-show-calendar";
  btn_show_calendar.href = "#null";
  btn_show_calendar.text = "Show Previous Weeks"
  btn_show_calendar.addEventListener('click', function(e) {
      for (var week of past_weeks) {
        week.classList.remove('past');
      }
      btn_show_calendar.remove();
      e.preventDefault();
    }
  );
  if (past_weeks.length > 1) {
    current_week.insertAdjacentElement('afterend', btn_show_calendar);
  }
}

if ('fetch' in window) {
  var namedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var namedMonths = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  var github_url = (function() {
    var url = document.querySelector('#github').getAttribute('href'); // grab the href value of the repo link
    if (typeof(url) !== 'undefined') {
      var fragment = url.substring(url.indexOf('.com/') + 5); // find the tail end (5 = .com/)
      return 'https://api.github.com/repos/' + fragment + '/commits?per_page=1'; // return the API url
    }
  })();

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if(typeof(github_url) !== "undefined") {
    fetch(github_url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var commit = {};
      data = data[0]; // only need most recent commit
      // Lowercase commit message's first word to run in `...to XYZ` copy:
      commit.message = data.commit.message.charAt(0).toLowerCase() + data.commit.message.slice(1);
      // Grab only the first line of a multiline message
      commit.message = commit.message.split("\n\n")[0];
      commit.url = data.html_url;
      commit.stamp = data.commit.author.date;
      commit.date = new Date(commit.stamp);
      // Put the date in Day, Month 31 at <Local Time String> format
      commit.time_string = namedDays[commit.date.getDay()] + ', ' +
        namedMonths[commit.date.getMonth()] + ' ' +
        commit.date.getDate() + ' at ' + commit.date.toLocaleTimeString();
      // Append to footer on calendar
      document.querySelector('#footer p').innerHTML +=
        ' Course last updated on <time datetime="' + commit.stamp + '">' + commit.time_string +
        '</time> to <a id="commit-message" href="' + commit.url + '">' + escapeHTML(commit.message) + '</a>.';
    });
  }
}

// This is 10,000 kinds of ugly and bad, but it gets the job done...for now.
var course_levels = ['grad','ugrad','all'];
var title = document.querySelector('title');
var title_components = {};
  title_components.original = title.innerText;
  title_components.name = title_components.original.split(':')[1] // Web Real-Time Communications
  title_components.full = title_components.original.split(':')[0]; // ITMD 469/545
  title_components.code = title_components.full.split(' ')[0]; // ITMD
  title_components.all = title_components.full.split(' ')[1]; // 469/545
  title_components.ugrad = title_components.all.split('/')[0]; // 469
  title_components.grad = title_components.all.split('/')[1]; // 545

document.querySelector('#footer').addEventListener('dblclick', function(e) {
  // Adjust the <title> contents
  title.innerText = title_components.code + ' ' + title_components[course_levels[0]] + ': ' + title_components.name;
  // Switch up the ancestor level class
  html.classList.remove(course_levels[course_levels.length - 1]);
  html.classList.add(course_levels[0]);
  // Push the current level to the end of the array
  course_levels.push(course_levels.shift());
});

window.addEventListener('keyup', function(e) {
  // console.log(e.keyCode);
  // Toggle the visibility of gridlines when `g` is pressed
  if (e.keyCode === 71) {
    document.querySelector('html').classList.toggle('g');
  }
});

html.classList.remove('loading');
