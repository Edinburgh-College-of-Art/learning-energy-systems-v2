// CONSTANTS //
var les_base_url = "http://localhost";
//var les_base_url = "http://app.learningenergy.eca.ed.ac.uk/admin-app";

var _chartPaddingWidth = 25;
var _chartPaddingHeight = 75;
var _e_scaleTypes = { week: 0, month: 1};
var _weekLabels =[ {
    text: "Monday",
    xPos: 0
  }, {
    text: "Tuesday",
    xPos: 1
  }, {
    text: "Wednesday",
    xPos: 2
  }, {
    text: "Thursday",
    xPos: 3
  }, {
    text: "Friday",
    xPos: 4
  }
];

var _energyTypes = ["computer", "heater", "light", "projector"];

// GLOBAL VARS //
var questionData;
var energyData;
var energyData_subjects = [];
var SHOW_ALL = false;

var url = new URL(window.location.href);
var schoolId = url.searchParams.get("les_school_id");
if (schoolId == null){ schoolId = localStorage['les_school_id']; }
if (schoolId == undefined){ schoolId = 1; }


var pickHex = function(color1, color2, weight) {
  var p = weight;
  var w = p * 2 - 1;
  var w1 = (w/1+1) / 2;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)];
  return rgb;
}

var findClosest = function (x, arr) {
  var indexArr = arr.map(function(k) { return Math.abs(k - x) })
  var min = Math.min.apply(Math, indexArr)
  return arr[indexArr.indexOf(min)]
}

var styleCircle = function(el){
  var pct = $(el).attr('data-pct');

  var gradient = {
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

  var key = findClosest(pct, Object.keys(gradient));

  var circleSize = 5 + (pct/100) * 88;
  var spacing = (100 - circleSize) / 2;

  if ($(el).hasClass('day-grayout') || $(el).hasClass('device-grayout')){
    $(el).css('background-color', 'rgb(120,120,120)');
    $(el).css('box-shadow', '0 0 7px 0px rgb(120,120,120)');
  } else {
    $(el).css('background-color', 'rgb('+ gradient[key] +')');
    $(el).css('box-shadow', '0 0 7px 0px rgb('+ gradient[key] +')');
  }

  if ($(el).parent().hasClass('energy-cell')){
    $(el).css('height', circleSize+'%').css('width', circleSize+'%');
    $(el).css('top', spacing+'%').css('left', spacing+'%');  
  }
};

var randomData = function(){
  $('.energy-grid div.circle, .microscope div.circle').each(function(){
    var pct = 100 * Math.random();
    $(this).attr('data-pct', pct);
    styleCircle(this);
  });
}

var fixedData = function(seed){
  if (seed == undefined){ seed = 0; }
  $('.energy-grid div.circle, .microscope div.circle').each(function(i,e){
    var pct = Math.abs(Math.sin(i+1+seed)) * 100;
    $(this).attr('data-pct', pct);
    styleCircle(this);
  });
}

var colouriseCircles = function(){
  $('.energy-cell .circle').each(function(i,el){
    styleCircle(el);
  });
}

var watchDeviceIcons = function(){
  $('.energyIcon').click(function(e){
    $(this).toggleClass('selected');
    var colourise = $(this).hasClass('selected');
    var deviceName = $(this).attr('name');

    $('.energy-cell.'+deviceName+' .circle').each(function(i,el){
      if (colourise){ $(el).removeClass('device-grayout'); }
      else { $(el).addClass('device-grayout'); }
    });

    colouriseCircles();
  });
}

var watchHamburger = function(){
  $('.toggle-overlay-menu').click(function(){
    $('nav#header .hamburger').toggleClass("opened-menu");
    $('#overlay-menu').toggleClass('hidden');
    $('body').toggleClass('no-scroll');
  })
}

var watchSelects = function(){
  $("#selectSubject, #selectMonth, #selectWeek").change(
    function(event) {
      fixedData($(this).val());
    });

  $("#selectDay").change(
    function(event) {
      var day = $(this).val().toLocaleLowerCase();

      var removeGrayout = function(i,el){ 
        $(el).removeClass('day-grayout'); };
      var doGrayout = function(i,el){
        $(el).addClass('day-grayout'); };

      if (day == 'all days'){
        $('.energy-cell .circle').each(removeGrayout);
      } else {
        $('.energy-cell .circle').each(doGrayout);
        $('.energy-cell.'+day + ' .circle').each(removeGrayout);
      }

      colouriseCircles();
    });
}

var watchRevealBtns = function(){
  $('.reveal-btn').off().click(function(){
    $(this).parents('.answer').addClass('visible');
  });
}


$(document).ready(function(){
  fixedData();

  /*$('body').click(function(){
    console.log('bprk');
    $('div.energy-grid .energy-cell').removeClass('selected');
  });*/

  $('div.energy-grid .energy-cell').click(function(){
    $('div.energy-grid .energy-cell').removeClass('selected');
    $(this).addClass('selected');
  });

  var spinner = new Spinner();

  watchHamburger();
  watchSelects();
  watchDeviceIcons();
  watchRevealBtns();
});
