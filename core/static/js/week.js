/*
 * Copyright (C) 2015 Hadi Mehrpouya <http://www.hadi.link>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var g_paper; //raphael paper
var g_width, g_height;  //screen width and height
var g_daysLeftMargin, g_daysTopMargin, g_headerHeight, g_daysRadius, g_daysHeight;
var g_dataChanged = false;
var g_title = "WEEK";
var g_total, g_projectorTotal = 3, g_computerTotal = 2, g_heaterTotal = 10, g_lightTotal = 5;
var g_monday, g_tuesday, g_wednesday, g_thursday, g_friday;
var g_monT = 0, g_tueT = 0, g_wedT = 0, g_thurT = 0, g_friT = 0;
var g_daysYScale = 5;
var g_studentUID = "1";
var g_currDate = new Date().toISOString().substring(0, 10);
var g_currDay = getDayName(new Date().getDay());
if (g_currDay === 'sunday')
{
  g_currDate = new Date();
  g_currDate.setDate(g_currDate.getDate() - 2);
  g_currDay = getDayName(g_currDate.getDay());
  g_currDate = g_currDate.toISOString().substring(0, 10);
}
else if (g_currDay === 'saturday')
{
  g_currDate = new Date();
  g_currDate.setDate(g_currDate.getDate() - 1);
  g_currDay = getDayName(g_currDate.getDay());
  g_currDate = g_currDate.toISOString().substring(0, 10);
}

$(document).bind('mobileinit', function () {
  $.mobile.loadingMessage = false;
});

$(function () {
  FastClick.attach(document.body);
});

$(document).ready(function(){
  window.g_studentUID = localStorage.getItem("studentId");
  loadUpdateData(true);
  reset();
});

$(window).bind("resize", function () {
  reset();
  initialise();
});

$(window).on("orientationchange", function (event) {
  reset();
  initialise();
});

function reset() {
  if (window.g_paper) {
    window.g_paper.clear();
    window.g_paper.remove();
  }
}

var g_background;
function initialise() {
  window.g_width = $(window).width();
  window.g_height = $(window).height();
  window.g_headerHeight = window.g_height / 10;
  window.g_daysHeight = window.g_height / 10;
  window.g_daysTopMargin = window.g_daysHeight / 5;
  window.g_daysRadius = window.g_daysHeight - 5 * window.g_daysHeight / 7;
  localStorage.setItem("currentDay", window.g_currDate);
  window.g_daysLeftMargin = (window.g_width - (window.g_daysRadius * 5 + (window.g_daysRadius * 4 / 3))) / 5;
  window.g_daysMargin = (window.g_width - window.g_daysLeftMargin * 4 - window.g_daysRadius * 5) / 2;
  window.g_paper = new Raphael('canvas_container');
  window.g_paper.setViewBox(0, 0, window.g_width, window.g_height, true);
  window.g_paper.setSize('100%', '100%');
  g_background = window.g_paper.image("img/backgrounds/" + (window.g_total - window.g_total % 2) + ".png", 0, 0, window.g_width, window.g_height);
  g_background.node.id = "myBack";
//  g_background.attr({href:"img/backgrounds/20.png"});

  var titleHeading = window.g_paper.text(window.g_width / 2, window.g_headerHeight / 2, window.g_title);
  titleHeading.attr({'text-anchor': "middle", "font-size": "26px", "fill": "#fff", "font-family": "TTRounds-Bold"});
  var homeIcon = window.g_paper.image("img/icons/day-icon.png", window.g_width - window.g_headerHeight / 2 - 10, window.g_headerHeight / 4, window.g_headerHeight / 2, window.g_headerHeight / 2);
  homeIcon.node.setAttribute("class", "donthighlight pointerCursor");
  homeIcon.node.id = "homeIcon";
  $("#homeIcon").bind('click', function () {
    localStorage.setItem("currentDate", window.g_currDate);
    localStorage.setItem("currentDay", window.g_currDay);
    window.location = "dayView.html";
  });
  var helpIcon = window.g_paper.image("img/icons/help-icon.png", 10, window.g_headerHeight / 4, window.g_headerHeight / 2, window.g_headerHeight / 2);
  helpIcon.node.setAttribute("class", "donthighlight pointerCursor");
  helpIcon.node.id = "helpIcon";
  $("#helpIcon").bind('click', function () {
    window.location = "editUser.html";
  });
  var headLine = window.g_paper.path('M' + 10 + " " + window.g_headerHeight + "L" + (window.g_width - 10) + " " + window.g_headerHeight);
  headLine.attr({"stroke": "#fff", "stroke-opacity": .4, "stroke-width": 1});
  drawDays();
  drawConsumptions(window.g_projectorTotal, window.g_lightTotal, window.g_computerTotal, window.g_heaterTotal, window.g_total);
}

function drawDays() {
  var monX = window.g_daysMargin;
  var tueX = window.g_daysMargin + window.g_daysLeftMargin + window.g_daysRadius;
  var wedX = window.g_daysMargin + window.g_daysLeftMargin * 2 + window.g_daysRadius * 2;
  var thurX = window.g_daysMargin + window.g_daysLeftMargin * 3 + window.g_daysRadius * 3;
  var fridX = window.g_daysMargin + window.g_daysLeftMargin * 4 + window.g_daysRadius * 4;
  var monY = window.g_headerHeight + window.g_daysTopMargin * 4 + (150 - window.g_monT) / window.g_daysYScale;
  var tueY = window.g_daysTopMargin * 4 + window.g_headerHeight + (150 - window.g_tueT) / window.g_daysYScale;
  var wedY = window.g_daysTopMargin * 4 + window.g_headerHeight + (150 - window.g_wedT) / window.g_daysYScale;
  var thurY = window.g_daysTopMargin * 4 + window.g_headerHeight + (150 - window.g_thurT) / window.g_daysYScale;
  var fridY = window.g_daysTopMargin * 4 + window.g_headerHeight + (150 - window.g_friT) / window.g_daysYScale;

  drawLinesBetwDays(monX, monY, tueX, tueY, wedX, wedY, thurX, thurY, fridX, fridY);
  window.g_monday = new daySection(monX, monY, window.g_daysRadius, window.g_currDay === "monday", "M", "monday", window.g_monT);//!!!!!!!!!!!!!!!!!!!!!!
  window.g_tuesday = new daySection(tueX, tueY, window.g_daysRadius, window.g_currDay === "tuesday", "T", "tuesday", window.g_tueT);
  window.g_wednesday = new daySection(wedX, wedY, window.g_daysRadius, window.g_currDay === "wednesday", "W", "wednesday", window.g_wedT);
  window.g_thursday = new daySection(thurX, thurY, window.g_daysRadius, window.g_currDay === "thursday", "T", "thursday", window.g_thurT);
  window.g_friday = new daySection(fridX, fridY, window.g_daysRadius, window.g_currDay === "friday", "F", "friday", window.g_friT);
  var headLine = window.g_paper.path('M' + 10 + " " + (window.g_headerHeight + window.g_daysTopMargin * 8) + "L" + (window.g_width - 10) + " " + (window.g_headerHeight + window.g_daysTopMargin * 8));
  headLine.attr({"stroke": "#fff", "stroke-opacity": .4, "stroke-width": 1});
}
function drawLinesBetwDays(_mx, _my, _tx, _ty, _wx, _wy, _thx, _thy, _fx, _fy) {
  var x = _mx + window.g_daysRadius, y = _my, x1 = _tx - window.g_daysRadius, y1 = _ty, x2 = _wx - window.g_daysRadius, y2 = _wy, x3 = _thx - window.g_daysRadius, y3 = _thy, x4 = _fx - window.g_daysRadius, y4 = _fy;
  var myPath = "";
  var minVal=70
  if (window.g_monT > minVal || window.g_tueT > minVal || window.g_wedT > minVal || window.g_thurT > minVal|| window.g_friT > minVal)
  {
    myPath += 'M' + x + " " + y +
        "L" + x1 + " " + y1;
  // }
  // if (window.g_tueT > minVal || window.g_wedT > minVal)
  // {
    myPath += 'M' + (x1 + 2 * window.g_daysRadius) + " " + y1 +
        "L" + x2 + " " + y2;
  // }
  // if (window.g_wedT > minVal || window.g_thurT > minVal)
  // {
    myPath += 'M' + (x2 + 2 * window.g_daysRadius) + " " + y2 +
        "L" + x3 + " " + y3;
  // }
  // if (window.g_thurT > minVal || window.g_friT > minVal)
  // {
    myPath += 'M' + (x3 + 2 * window.g_daysRadius) + " " + y3 +
        "L" + x4 + " " + y4;
  }
  var headLine = window.g_paper.path(myPath);
  headLine.attr({"stroke": "#fff"});
}
/*This function will draw the consumptions visualisation.
 * it will get 5 inputs, projection time,
 *  computer use time, heater time,
 *  lighting time and finaly total energy use
 *  The size of icons will indicate the amount of energy being used.
 *  */
function drawConsumptions(_p, _l, _c, _h, _t) {
  var minRange = 70, maxRange = 150;
  var p = map_range(_p, 0, 315, minRange, maxRange);
  var c = map_range(_c, 0, 315, minRange, 150);
  var l = map_range(_l, 0, 315, minRange, 150);
  var h = map_range(_h, 0, 315, minRange, 150);
  var pImage = "img/icons/projector-week-Icon.png";
  var cImage = "img/icons/computer-week-Icon.png";
  var lImage = "img/icons/lightBulb-week-icon.png";
  var hImage = "img/icons/heater-week-Icon.png";
  var topStuff = window.g_headerHeight + window.g_daysTopMargin * 8;
  var restOfHeight = window.g_height - topStuff;
  var centY = restOfHeight / 2 + topStuff;
  var circR = window.g_width / 9;
  if (p === minRange)
  {
    pImage = "img/icons/projector-icon-0.png";
  }
  if (c === minRange) {
    cImage = "img/icons/computer-icon-0.png";
  }
  if (l === minRange) {
    lImage = "img/icons/light-icon-0.png";
  }
  if (h === minRange) {
    hImage = "img/icons/heater-icon-0.png";
  }
  var proj = window.g_paper.image(pImage, Math.max(p / 10, window.g_width / 15), window.g_height / 2 - 2 * p / 3, p, p);
  proj.node.id = "projector";
  var comp = window.g_paper.image(cImage, window.g_width - Math.max(7 * c / 6, window.g_width / 6), window.g_height / 2 - 2 * c / 3, c, c);
  comp.node.id = "computer";
  var light = window.g_paper.image(lImage, Math.max(l / 10, window.g_width / 15), 4 * window.g_height / 5 - l / 2, l, l);
  light.node.id = "light";
  var heater = window.g_paper.image(hImage, window.g_width - Math.max(7 * h / 6, window.g_width / 6), 4 * window.g_height / 5 - h / 2, h, h);
  heater.node.id = "heater";
  var total = window.g_paper.circle(window.g_width / 2, centY, circR);
  total.node.id = "total";
  total.attr({stroke: "#FFF", "stroke-width": 3, fill: "#fff", "fill-opacity": 1, "stroke-opacity": 1});
  var titleHeading = window.g_paper.text(window.g_width / 2, centY, _t);
  titleHeading.node.id = "totalHead";
  titleHeading.attr({'text-anchor': "middle", "font-size": "40px", "fill": "#000", "font-family": "TTRounds-Regular"}).node.setAttribute("class", "donthighlight");
  ;
}
//A class that keeps the attributes for each day. It has onclick event.
function daySection(_x, _y, _r, _status, _title, _id, _total) {
  this.x = _x;
  this.y = _y;
  this.r = _r;
  var st = window.g_paper.set();
  this.dayBtn = window.g_paper.circle(this.x, this.y, this.r);
  this.dayBtn.node.setAttribute("class", "pointerCursor");
  this.dayBtn.node.status = _status;
  this.dayBtn.node.title = _title;
  this.dayBtn.node.id = _id;
  this.dayBtn.node.parent = _id;

  $("#" + _id).bind('click', dayClicked);
  var titleHeading = window.g_paper.text(this.x, this.y, this.dayBtn.node.title);
  titleHeading.node.parent = _id;
  titleHeading.node.id = _id + "_title";
  $("#" + _id + "_title").bind('click', dayClicked);
  if (!_status) {
    this.dayBtn.attr({stroke: "#FFF", "stroke-width": 3, fill: "#333", "fill-opacity": .1, "stroke-opacity": .6});
    titleHeading.attr({'text-anchor': "middle", "font-size": "20px", "fill": "#fff", "font-family": "TTRounds-Regular"});
  }
  else {
    this.dayBtn.attr({stroke: "#FFF", "stroke-width": 3, fill: "#fff", "fill-opacity": 0.3, "stroke-opacity": .1});
    titleHeading.attr({'text-anchor': "middle", "font-size": "20px", "fill": "#fff", "font-family": "TTRounds-Regular"});
  }
  titleHeading.node.setAttribute("class", "donthighlight pointerCursor");
  $(this.dayBtn.node).removeAttr("style");
}

var g_clickFlag = false;
function dayClicked() {
  if (!window.g_clickFlag) {
    window.g_clickFlag = true;
    setTimeout(function () {
      window.g_clickFlag = false;
    }, 100);
    if (this.parent === window.g_currDay) {
      localStorage.setItem("currentDate", window.g_currDate);
      localStorage.setItem("currentDay", window.g_currDay);
      window.location = "dayView.html";
    } else {
      var me = $("#" + this.parent)[0];
      me.status = !me.status;//update status
      //updateing background color of the selected one.
      var other = $("#" + window.g_currDay)[0];
      other.status = false;
      other.setAttribute("fill", "#333");
      other.setAttribute("stroke-opacity", .6);
      other.setAttribute("fill-opacity", 0.1);
      window.g_currDate = calculateDate(me.id);
      window.g_currDay = this.parent;
      if (!me.status) {
        me.setAttribute("fill", "#333");
        me.setAttribute("stroke-opacity", .6);
        me.setAttribute("fill-opacity", 0.1);
      }
      else {
        me.setAttribute("fill-opacity", 0.3);
        me.setAttribute("fill", "#fff");
        me.setAttribute("stroke-opacity", .1);
      }
      localStorage.setItem("currentDate", window.g_currDate);
      localStorage.setItem("currentDay", window.g_currDay);
      loadUpdateData(false);


    }
  }
  return false;
}

function calculateDate(_day) {
  var today = new Date(getMonday(new Date));
  var otherDay = new Date(today);
  switch (_day) {
    case "monday":
      break;
    case "tuesday":
      otherDay.setDate(today.getDate() + 1);
      break;
    case "wednesday":
      otherDay.setDate(today.getDate() + 2);
      break;
    case "thursday":
      otherDay.setDate(today.getDate() + 3);
      break;
    case "friday":
      otherDay.setDate(today.getDate() + 4);
      break;
  }
  return otherDay.toISOString().substring(0, 10);
}

daySection.prototype.getX = function () {
  return this.x;
};
daySection.prototype.getY = function () {
  return this.y;
};

function loadUpdateData(_loadOrUpdate) {
  var minSize = 70;
  var url = window.les_base_url + "/app_students/"+window.g_studentUID+"/week/"+window.g_currDate+".json";

  $.ajax({ type: 'GET', url: url, dataType: 'json' }).always(function (data) {
    window.g_monT = window.g_tueT = window.g_wedT = window.g_thurT = window.g_friT = 0;
    console.log(data);
    window.g_projectorTotal = parseInt(data.day.projector !== null ? data.day.projector : 0),
        window.g_computerTotal = parseInt(data.day.computer !== null ? data.day.computer : 0),
        window.g_heaterTotal = parseInt(data.day.heater !== null ? data.day.heater : 0),
        window.g_lightTotal = parseInt(data.day.light !== null ? data.day.light : 0);
    window.g_total = ((window.g_projectorTotal + window.g_computerTotal + window.g_heaterTotal + window.g_lightTotal) / 60).toFixed(1);
    window.g_monT = window.g_tueT = window.g_wedT = window.g_thurT = window.g_friT = 0;
    for (var i = 0; i < data.week.length; i++) {
      var d = new Date(data.week[i].date);
      var n = d.getDay();
      switch (n) {
        case 1:
          window.g_monT = data.week[i].daySum;
          break;
        case 2:
          window.g_tueT = data.week[i].daySum;
          break;
        case 3:
          window.g_wedT = data.week[i].daySum;
          break;
        case 4:
          window.g_thurT = data.week[i].daySum;
          break;
        case 5:
          window.g_friT = data.week[i].daySum;
          break;

      }
    }
    /*
     * TODO: Check with smaller heights and make sure the range for y value is always right!
     * FIX ME: Changing days doesn't refresh the background.
     */
    var h = $(window).height() / 2 - 40;
//
    window.g_monT = map_range(window.g_monT, 0, 1260, minSize, h);
    window.g_tueT = map_range(window.g_tueT, 0, 1260, minSize, h);
    window.g_wedT = map_range(window.g_wedT, 0, 1260, minSize, h);
    window.g_thurT = map_range(window.g_thurT, 0, 1260, minSize, h);
    window.g_friT = map_range(window.g_friT, 0, 1260, minSize, h);
    if (_loadOrUpdate)
      initialise();
    else {
      $("#total").remove();
      $("#computer").remove();
      $("#projector").remove();
      $("#heater").remove();
      $("#light").remove();
      $("#totalHead").remove();
      drawConsumptions(window.g_projectorTotal, window.g_lightTotal, window.g_computerTotal, window.g_heaterTotal, window.g_total);
      $("#myBack").attr("href", "img/backgrounds/" + (window.g_total - window.g_total % 2) + ".png");
    }
  });
}


function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}


function getDayName(_day) {
  var weekday = new Array(7);
  weekday[0] = "sunday";
  weekday[1] = "monday";
  weekday[2] = "tuesday";
  weekday[3] = "wednesday";
  weekday[4] = "thursday";
  weekday[5] = "friday";
  weekday[6] = "saturday";
  return weekday[_day];

}
