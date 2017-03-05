$(document).ready(function () {
	displayPlanets(getPlanets());

	$('#filters-tab').click(function(evt) {
		openTab(evt, 'filters');
	});
	$('#list-tab').click(function(evt) {
		openTab(evt, 'list');
	});
	countPlanets();
});

function displayPlanets(planets) {
	console.log(planets);
}

function getPlanets() {
	$.get('/planets', function(data) {
		console.log(data);
	});
	
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
