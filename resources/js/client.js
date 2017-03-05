var jsstars = [[1 2 3][4 5 6][7 8 9]];

$(document).ready(function () {
	getPlanets();
	$('#filters-tab').click(function(evt) {
		openTab(evt, 'filters');
	});
	$('#list-tab').click(function(evt) {
		openTab(evt, 'list');
	});
});

function getPlanets() {
	jsstars = $.get('/planets', function(data) {
		console.log(data);
	});
	countPlanets();
}

function countPlanets() {
	var list = $('#list ul li');
	console.log(list);
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
	console.log('tab');

	tablinks = $('.tablinks');
	for (i = 0; i<tablinks.length; i++) {
		console.log($('.tablinks')[i]);
		$('.tablinks').removeClass("active");
	}
	
	$('#'+content).css("display", "block");
	tab.currentTarget.className += " active";
}
