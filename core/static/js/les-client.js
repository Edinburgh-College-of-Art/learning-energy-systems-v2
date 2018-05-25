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

var readStudent = function(token, successCb, errorCb){
  var headers = { 'Authorization': 'Token ' + token };
  $.ajax({ type: 'GET', url: window.identify_url, headers: headers,
    success: function(data){
      localStorage.token = token;
      localStorage.yeargroupId = data.yeargroup.id;
      successCb(data);
    },
    error: function(data){ errorCb(data); },
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var login = function(){
  var token = $.urlParam('token');
  if (!token){ token = localStorage.getItem("token"); }

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

var watchHamburger = function(){
  $('.toggle-overlay-menu').click(function(){
    $('nav#header .hamburger').toggleClass("opened-menu");
    $('#overlay-menu').toggleClass('hidden');
    $('body').toggleClass('no-scroll');
  })
}

var watchWeekDays = function(){
  var currentWeek = localStorage.getItem("currentWeek");
  var previousWeekSelected = (currentWeek < moment().weeks());
  $('.weekdays a').each(function(i,e){
    $(e).attr('class', '');
    if (previousWeekSelected){ return; }
    if (moment().isoWeekday() == (i+1)){
      $(e).attr('class', 'selected');
    } else if ((i+1) > moment().isoWeekday()){
      $(e).attr('class', 'disabled');
      $(e).off().click(function(e){ e.preventDefault() });
    }
  });
}

var watchWeekSelectors = function(){
  $('.prev-week').off().click(function(){
    if (!$(this).hasClass('disabled')){
      $('span.week-text').text('Last week');
      localStorage.setItem("currentWeek", moment().weeks()-1);
      watchWeekDays();
      $('.next-week, .prev-week').toggleClass('disabled');
    }
  });

  $('.next-week').off().click(function(){
    if (!$(this).hasClass('disabled')){
      $('span.week-text').text('This week');
      localStorage.setItem("currentWeek", moment().weeks());
      watchWeekDays();
      $('.next-week, .prev-week').toggleClass('disabled');
    }
  });
}

var populateWeekView = function(){
  localStorage.setItem("currentWeek", moment().weeks());
  watchWeekDays();
  watchWeekSelectors();
}

var populateSubjects = function(selectedDay){
  //request occurrences for day, filtered by yeargroup or by student
  var headers = { 'Authorization': 'Token ' + localStorage.token };
  var url = window.les_base_url + '/api/yeargroups/'+localStorage.yeargroupId+'/subjects/'+selectedDay.format("YYYY/MM/DD");

  $.ajax({ type: 'GET', url: url, headers: headers,
    success: function(data){
      $.each(data, function(i,s){
        $('ul.subjects').append('<li id="subject-'+s.id+'"><div class="circle"><span>1</span></div><a href="#"><span class="title">'+s.name+'</span></a></li>');
      });
    },
    error: function(data){},
    complete: function(r){ console.log(r.responseJSON); }
  });
}

var populateDayView = function(){
  var day = $.urlParam('day');
  var isCurrentWeek = localStorage.currentWeek == moment().weeks();
  var prefix = '';

  if (localStorage.currentWeek == moment().weeks()-1){ prefix = 'Last '; }
  if (isCurrentWeek && moment().isoWeekday() == day){
    $('h2').text('Today');
  } else {
    $('h2').text(prefix + moment().isoWeekday(day).format('dddd'));
  }
  //get specific day
  var selectedDay = moment().weeks(localStorage.currentWeek).isoWeekday(day);
  populateSubjects(selectedDay);
}

$(document).ready(function(){
  if (!storageAvailable('localStorage')){
    alert("Oh no! Cannot use localStorage feature, please use a different browser!");
  }
  FastClick.attach(document.body);
  watchHamburger();
});