function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

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

var getCurrentTime = function(){
  return moment(localStorage.currentTime);
}

var getCurrentWeek = function(){
  return moment(localStorage.currentTime).weeks();
}

var getCurrentYear = function(){
  return moment(localStorage.currentTime).year();
}

var getCurrentDate = function(){
  return moment(localStorage.currentTime).date();
}

var getCurrentWeekDay = function(){
  return moment(localStorage.currentTime).isoWeekday();
}

$(document).ready(function(){
  watchHamburger();
})