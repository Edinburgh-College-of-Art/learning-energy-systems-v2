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


$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else{
    return decodeURI(results[1]) || 0;
  }
};

var styleBlocks = function(el){
  var all = $(el).children('div.block').length
  var selected = $(el).children('div.block.selected').length
  var pct = (selected / all) * 100;
  var key = findClosest(pct, Object.keys(gradient));
  $(el).children('div.block').removeClass('pct-0 pct-13 pct-25 pct-38 pct-50 pct-63 pct-75 pct-88 pct-100');
  $(el).children('div.block.selected').addClass('pct-'+key);
};

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

var getOccurrencesForWeek = function(year, week, successCb, errorCb){
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/yeargroups/'+localStorage.yeargroupId+'/occurrences/'+year+'/week/'+week;

  $.ajax({ type: 'GET', url: url, headers: headers,
    success: function(data){},
    error: function(data){ errorCb(data); },
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var getUsageForWeek = function(year, week, successCb){
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/yeargroups/'+localStorage.yeargroupId+'/usage?year='+year+'&week='+week;

  $.ajax({ type: 'GET', url: url, headers: headers,
    success: function(data){ successCb(data); },
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var getUsageForDay = function(year, week, day, successCb){
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/yeargroups/'+localStorage.yeargroupId+'/usage?year='+year+'&week='+week+'&day='+day;

  $.ajax({ type: 'GET', url: url, headers: headers,
    success: function(data){ successCb(data); },
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var readStudent = function(token, successCb, errorCb){
  var headers = { 'Authorization': 'Token ' + token };
  $.ajax({ type: 'GET', url: window.identify_url, headers: headers,
    success: function(data){
      localStorage.username = data.user.username;
      localStorage.token = token;
      localStorage.yeargroupId = data.yeargroup.id;
      successCb(data);
    },
    error: function(data){ errorCb(data); },
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var login = function(){
  $('nav').hide();
  var token = $.urlParam('token');
  if (!token){ token = localStorage.token; }

  var successCb = function(){ window.location = "/client/week"; };

  var errorCb = function(){
    console.log("error");
    localStorage.removeItem('token');
    window.location = "/admin/login";
  };

  if (token) {
    readStudent(token, successCb, errorCb);
  } else {
    errorCb();
  }
};

var selectDay = function(e){
  $('.weekdays a.selected').removeClass('selected');
  $(e.target).addClass('selected');
  localStorage.currentTime = moment($(e.target).attr('data-date'), "YYMMDD").format();
  styleDeviceIcons();
}

var watchWeekDays = function(){
  var day, isFuture, clickCb;
  $('.weekdays a').each(function(i,e){
    day = moment().year(getCurrentYear()).weeks(getCurrentWeek()).isoWeekday(i+1);
    isFuture = day > moment();
    isSelectedDay = day.format('YYMMDD') == getCurrentTime().format('YYMMDD');

    $(e).off(); 
    $(e).attr('class','');

    if (isFuture){
      $(e).addClass('disabled');
    } else{
      $(e).attr('data-date', day.format('YYMMDD'));
      $(e).click(selectDay);
    }

    if (isSelectedDay){ $(e).addClass('selected'); }
  });
}

var watchTotalButton = function(){
  $('#total a').click(function(){
    window.location = "/client/day?day=" + getCurrentWeekDay();
  });
}

var watchWeekSelectors = function(){
  $('.prev-week').off().click(function(){
    if (!$(this).hasClass('disabled')){
      localStorage.currentTime = getCurrentTime().weeks(getCurrentWeek()-1).format(); //one week ago
      $('span.week-text').text('Last week');
      watchWeekDays();
      styleDeviceIcons();
      $('.next-week, .prev-week').toggleClass('disabled');
    }
  });

  $('.next-week').off().click(function(){
    if (!$(this).hasClass('disabled')){
      localStorage.currentTime = moment().format();
      $('span.week-text').text('This week');
      watchWeekDays();
      styleDeviceIcons();
      $('.next-week, .prev-week').toggleClass('disabled');
    }
  });
}

var updateMinDisplay = function(controlElement){
  var mins = $(controlElement).children('div.selected').length * 5;
  var dEl = '.' + $(controlElement).attr('data-device') +'-duration';
  $(dEl + ' .minutes').text(mins);
}

var watchSelectorControl = function(occurrenceId){
  var isMouseDown = false, isHighlighted, controlElement;
  $("div.selector-control div.block")
    .on('mousedown touchstart', function () {
      controlElement = $(this).parent();
      isMouseDown = true;
      $(this).toggleClass("selected");
      isHighlighted = $(this).hasClass("selected");
      return false; // prevent text selection
    })
    .on('touchmove', function(e){
      var myLocation = e.originalEvent.changedTouches[0];
      var realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
      if (isMouseDown) {
        $(realTarget).toggleClass("selected", isHighlighted);
      }
    })
    .on('mouseover', function(){
      if (isMouseDown) {
        $(this).toggleClass("selected", isHighlighted);
      }
    })
    .bind("selectstart", function(){
      return false;
    });

  $(document).on('mouseup touchend', function(){
    isMouseDown = false;
    styleBlocks(controlElement);
    var prediction = buildPrediction();
    submitPrediction(occurrenceId, prediction);
    updateMinDisplay(controlElement);
  });
};


var buildPrediction = function(){
  var prediction = { light: "", computer: "", projector: "", heater: "" };
  var detectSelect = function(i,e){
    var device = $(this).parent().attr('data-device');
    if ($(this).hasClass("selected")){
      prediction[device] = prediction[device].concat("1");
    } else {
      prediction[device] = prediction[device].concat("0");
    }
  };

  $('div.selector-control.light div.block').each(detectSelect);
  $('div.selector-control.computer div.block').each(detectSelect);
  $('div.selector-control.heater div.block').each(detectSelect);
  $('div.selector-control.projector div.block').each(detectSelect);

  return prediction;
}

var submitPrediction = function(occurrenceId, prediction){
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/occurrences/'+occurrenceId+'/user-prediction';

  prediction["occurrence_id"] = occurrenceId;
  $.ajax({ type: 'PUT', data: prediction, url: url, headers: headers,
    success: function(data){ console.log("success"); },
    error: function(data){},
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var styleDeviceIcons = function(){
  getUsageForDay(getCurrentYear(), getCurrentWeek(), getCurrentDate(), function(data){
    styleDeviceIcon('light', data);
    var c = styleDeviceIcon('computer', data);
    var p = styleDeviceIcon('projector', data);
    styleDeviceIcon('heater', data);
    // move total towards middle
    $('#total').parents('.row').css('top', ((c.top + p.top)/2));
    var duration = Math.round(data.total_duration / 60);
    var units = 'hours';
    if (duration < 1){
      duration = data.total_duration;
      units = 'mins';
    }
    var backg = Math.round(10 * (data.average_pct/100));
    $('body').css('background-image', 'url(/static/img/backgrounds/'+backg*2+'.png)');
    $('#total a span.time').text(duration);
    $('#total a span.units').text(units);
  });
}

var styleDeviceIcon = function(device, data){
  $('#'+device+' img').css('height', '');
  $('#'+device+' a').css('top', '');
  var height = $('#'+device+' img').height();
  var newHeight = height - (height/2) + ((height/2) * (data.average_use[device]/100));
  var top = (1 - data.average_use[device]/100) * (newHeight/2);
  $('#'+device+' img').height(newHeight);
  $('#'+device+' a').css('top', top);
  return { new_height: newHeight, top: top };
}

var populateWeekView = function(){
  localStorage.setItem("currentTime", moment().format());
  watchWeekDays();
  watchWeekSelectors();
  watchTotalButton();
  styleDeviceIcons();
}

var populateSubjects = function(selectedDay){
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/yeargroups/'+localStorage.yeargroupId+'/occurrences/'+selectedDay.format("YYYY/MM/DD");

  $.ajax({ type: 'GET', url: url, headers: headers,
    success: function(data){
      var s;
      $.each(data, function(i,o){
        s = o.subject;
        $('ul.subjects').append(
          '<li id="subject-'+s.id+'">\
          <div class="circle"><span>' + (i+1) + '</span></div>\
          <a href="prediction?duration='+s.duration+'&subject='+s.name+'&occurrence='+o.id+'&date='+selectedDay.format("YYYY/MM/DD")+'">\
          <span class="title">'+s.name+'</span></a></li>');
      });
    },
    error: function(data){},
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var populateDayView = function(){
  var day = $.urlParam('day');
  var isCurrentWeek = moment(localStorage.currentTime).weeks() == moment().weeks();
  var prefix = '';

  if (getCurrentWeek() == moment().weeks()-1){ prefix = 'Last '; }
  if (isCurrentWeek && moment().isoWeekday() == day){
    $('h2').text('Today');
  } else {
    $('h2').text(prefix + moment().isoWeekday(day).format('dddd'));
  }

  var selectedDay = moment().weeks(getCurrentWeek()).isoWeekday(day);
  populateSubjects(selectedDay);
}

var getCurrentPrediction = function(occurrenceId, successCb){
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/occurrences/'+occurrenceId+'/user-prediction';
  $.ajax({ type: 'GET', url: url, headers: headers,
    success: function(data){ successCb(data) },
    error: function(data){ console.log("Error"); },
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var populatePredictionView = function(){
  var subject = $.urlParam('subject');
  var occurrenceId = $.urlParam('occurrence');
  var date = $.urlParam('date');
  var duration = $.urlParam('duration');
  var selectedDay = moment(date, "YYYY/MM/DD");
  var blockSize = 5;  
  var blocks = (duration / blockSize);

  $('body').addClass('prediction');
  $('h1').text(subject);

  var i = 0, txt = '', skip = false;
  $('div.selector-control').each(function(){
    for (i=(blocks-1); i >= 0; i--){
      if ((i == blocks-1) ||  (!skip && (i+1) % 3 == 0)){ txt = (i+1)*5; skip = true; } else { txt = ''; skip = false; }
      $(this).prepend('<div data-idx="'+i+'" class="block">'+txt+'</div>');
    }
  });

  if (blocks < 9) {
    $('div.selector-control').css('grid-template-columns', '1fr '.repeat(blocks));
  } else if (blocks > 9) {
    $('div.selector-control').css('grid-template-columns', '1fr '.repeat(Math.round(blocks/2)));
  }

  getCurrentPrediction(occurrenceId, function(prediction){
    var i = 0, e = undefined;
    if (prediction.id){
      for (i=0; i < prediction.light.length; i++){
        if (prediction.light[i] == "1"){
          e = $('div.selector-control.light div.block')[i];
          $(e).addClass('selected');
        }
        if (prediction.computer[i] == "1"){
          e = $('div.selector-control.computer div.block')[i];
          $(e).addClass('selected');
        }
        if (prediction.heater[i] == "1"){ 
          e = $('div.selector-control.heater div.block')[i];
          $(e).addClass('selected');
        }
        if (prediction.projector[i] == "1"){
          e = $('div.selector-control.projector div.block')[i];
          $(e).addClass('selected');
        }
      }
    }

    $.each(['light', 'projector', 'heater', 'computer'], function(i,e){
      styleBlocks('div.selector-control.'+e);
      updateMinDisplay('div.selector-control.'+e);
    })
  });

  watchSelectorControl(occurrenceId);
}

var watchViewToday = function(){
  $("#view-today").click(function(){
    localStorage.currentTime = moment().format();
    window.location = "/client/day?day="+moment().isoWeekday();
  });
}

var watchLogOut = function(){
  $("#log-out").click(function(){
    localStorage.removeItem('token');
    window.location = "/admin/login";
  });
}

var watchBackBtn = function(){
  $('a.back').click(function(){
    if (document.referrer) {
      window.open(document.referrer,'_self');
    } else { 
      history.go(-1);
    }
    return false;
  });
}

$(document).ready(function(){
  if (!storageAvailable('localStorage')){
    alert("Oh no! Cannot use localStorage feature, please use a different browser!");
  }
  FastClick.attach(document.body);
  $('nav h3.username span').text(localStorage.username);
  watchViewToday();
  watchLogOut();
  watchBackBtn();
});