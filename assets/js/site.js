// Add a .js utility class to <html>
document.querySelector('html').classList.add('js');

// Register service worker, if browser supports them
if ('serviceWorker' in navigator) {
  var scope = detectSiteScope(location.href);
  console.log(scope.path);
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


// Capture and replicate the current week at the top of the calendar
if (document.querySelector('#calendar')) {
  var this_week = document.querySelector('#this-week').closest('article'); // grab this week's <article>
  var current_week = this_week.cloneNode(true); // make a copy of it,
  this_week.querySelector('#this-week').id = ''; // remove the original #this-week id
  current_week.classList.add('current'); // add a class of current to this week's article copy
  current_week.classList.remove('past'); // remove the past class
  current_week.querySelector('#this-week small').innerText = "This Week";
  document.querySelector('#content').prepend(current_week); // insert the copy at the top of the calendar
  if (location.hash === '') {
    location.hash = '#this-week'; // point at the new hash position; viewport should show this one
  }
  var btn_show_calendar = document.createElement('a');
  btn_show_calendar.id = "btn-show-calendar";
  btn_show_calendar.href = "#null";
  btn_show_calendar.text = "Show Previous Weeks"
  btn_show_calendar.addEventListener('click', function(e) {
      var past_weeks = document.querySelectorAll('article.past');
      for (var week of past_weeks) {
        week.classList.remove('past');
      }
      btn_show_calendar.remove();
      e.preventDefault();
    }
  );
  current_week.insertAdjacentElement('afterend', btn_show_calendar);
}

window.addEventListener('keyup', function(e) {
  // console.log(e.keyCode);
  // Toggle the visibility of gridlines when `g` is pressed
  if (e.keyCode === 71) {
    document.querySelector('html').classList.toggle('g');
  }
})
