var jsstars = [[5]];
getPlanets();

$(document).ready(function () {
	$('#filters-tab').click(function(evt) {
		openTab(evt, 'filters');
	});
	$('#list-tab').click(function(evt) {
		openTab(evt, 'list');
	});
	countPlanets();
});

function getPlanets() {	
	$.getJSON('/planets', function(data) {
		console.log(data);
		jsstars = data;
	});
}

function countPlanets() {
	var list = $('#list ul li');
	$('#list-tab span').html(" ("+list.length+")");
	if (list.length==1) {
		$('#list-tab a').html("Planet");
	} else {
		$('#list-tab a').html("Planets");
	}
}

function openTab(tab, content) {
	var i, tabcontent, tablinks;

	tabcontent = $('.tabcontent');
	for (i = 0; i<tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = $('.tablinks');
	for (i = 0; i<tablinks.length; i++) {
		$('.tablinks').removeClass("active");
	}
	
	$('#'+content).css("display", "block");
	tab.currentTarget.className += " active";
}

function drawPoints(id) {
    var pjs = Processing.getInstanceById(id);
    var json = $.get("/planets");
    var data = eval("("+json+")");
    if(data) {
        // we know the JSON is an array of points, called "points"
        for(p=0, end=data.length; p<end; p++) {
             //var point = data.points[p];
             consol.log(data[p])
             //pjs.addPoint(point.x, point.y);
        }
    }
}
