// Capture and replicate the current week at the top of the calendar
if (document.querySelector('#calendar')) {
  var this_week = document.querySelector('#this-week').closest('article'); // grab this week's <article>
  var current_week = this_week.cloneNode(true); // make a copy of it,
  this_week.querySelector('#this-week').id = ''; // remove the original #this-week id
  current_week.classList.add('current'); // add a class of current to this week's article copy
  current_week.querySelector('#this-week small').innerText = "This Week";
  document.querySelector('#content').prepend(current_week); // insert the copy at the top of the calendar
  if (location.hash) {
    location.hash = '#this-week'; // point at the new hash position; viewport should show this one
  }
}

window.addEventListener('keyup', function(e) {
  console.log(e.keyCode);
  // Toggle the visibility of gridlines when `g` is pressed
  if (e.keyCode === 71) {
    document.querySelector('html').classList.toggle('g');
  }
})
