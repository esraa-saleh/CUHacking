$(document).ready(function () {
	displayPlanets(getPlanets());
/*	$('#list').hide();
	$('#filter-tab').click(function() {
		$('#filters').toggle()
		$('#list').toggle();
	});
	$('#list-tab').click(function() {
		$('#filters').toggle()
		$('#list').toggle();
	});*/

	$('#filters-tab').click(function(evt) {
		openTab(evt, 'filters');
	});
	$('#list-tab').click(function(evt) {
		openTab(evt, 'list');
	});
});

function displayPlanets(planets) {
	console.log('hello world');
}

function getPlanets() {
	$.get('/planets', function(data) {
		console.log(data);
	});
	
}

function openTab(tab, content) {
	var i, tabcontent, tablinks;

	tabcontent = $('.tabcontent');
	for (i = 0; i<tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	tablinks = $('.tablinks');
	for (i = 0; i<tablinks.length; i++) {
		console.log($('.tablinks')[i]);
		$('.tablinks').removeClass("active");
	}
	
	$('#'+content).css("display", "block");
	tab.currentTarget.className += " active";
}
