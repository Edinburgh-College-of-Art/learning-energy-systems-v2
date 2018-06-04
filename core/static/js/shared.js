window.findClosest = function (x, arr) {
  var indexArr = arr.map(function(k) { return Math.abs(k - x) })
  var min = Math.min.apply(Math, indexArr)
  return arr[indexArr.indexOf(min)]
}

window.gradient = {
  100: [173, 40, 82],
  88: [234, 44,  90],
  75: [233, 126, 103],
  63: [243, 207, 94],
  50: [167, 209, 100],
  38: [1,   155, 115],
  25: [2,   96,  122],
  13: [10,  55,  109],
  0:  [26,  22,  100]
};

var watchHamburger = function(){
  $('.toggle-overlay-menu').click(function(){
    $('nav#header .hamburger').toggleClass("opened-menu");
    $('#overlay-menu').toggleClass('hidden');
    $('body').toggleClass('no-scroll').toggleClass('overlay-open');
  })
}

var round = function(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

$(document).ready(function(){
  watchHamburger();
})