var energyTypes = ["computer", "heater", "light", "projector"];
var url = new URL(window.location.href);

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

var styleCircle = function(el){
  var pct = $(el).attr('data-pct');
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
    $(this).siblings('.data').children('.value').text(Math.round(pct * 0.9));
    styleCircle(this);
  });

  var totalMins = 0;
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach((d)=>{
    var mins = 0;
    $('.energy-cell.'+d+' span.value').each(function(i,e){
      mins += parseInt($(this).text());
    });
    $('.energy-total.'+d).text(mins);
    totalMins += mins;
  })
  $('.energy-total.all span').text(totalMins);
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

var getUsageForWeek = function(yeargroupId, year, week, successCb){
  var url = window.les_base_url + '/api/usage/weekdays?year='+year+'&week='+week;
  if (yeargroupId){
    url = window.les_base_url + '/api/yeargroups/weekdays'+yeargroupId+'/usage?year='+year+'&week='+week;
  }

  $.ajax({ type: 'GET', url: url,
    success: function(data){ successCb(data); },
    complete: function(r){ console.log(r.responseJSON); },
    error: function(r){ console.log(r); }
  });
}

$(document).ready(function(){
  localStorage.setItem("currentTime", moment().format());

  fixedData();

  $('div.energy-grid .energy-cell').click(function(){
    $('div.energy-grid .energy-cell').removeClass('selected');
    $(this).addClass('selected');
  });

  var spinner = new Spinner();

  watchSelects();
  watchDeviceIcons();
  watchRevealBtns();

  getUsageForWeek(undefined, getCurrentYear(), getCurrentWeek(), function(d){console.log(d) });
});