$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else{
    return decodeURI(results[1]) || 0;
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

var populateDayView = function(){
  var day = $.urlParam('day');
  var weekNo = localStorage.getItem("currentWeek");
  
}

$(document).ready(function(){
  FastClick.attach(document.body);
  watchHamburger();
});