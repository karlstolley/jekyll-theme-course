window.addEventListener('keyup', function(e) {
  console.log(e.keyCode);
  // Toggle the visibility of gridlines when `g` is pressed
  if (e.keyCode === 71) {
    document.querySelector('html').classList.toggle('g');
  }
})
