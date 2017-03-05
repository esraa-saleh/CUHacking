var jsstars = [[5]];
var selectedJSstars = [];
getPlanets();

$(document).ready(function () {
	$('#filters-tab').click(function(evt) {
		openTab(evt, 'filters');
	});
	$('#list-tab').click(function(evt) {
		openTab(evt, 'list');
	});
	$('input').change(function() {
		var parameter = $(':checked')[0].value;
		$.getJSON("/lists", {"aFilter": parameter}, function(data){ selectedJSstars=data;
		displayListTab();
		});
	});
	countPlanets();
});

function getPlanets() {	
	$.getJSON('/planets', function(data) {
		jsstars = data;
	});
}

function displayListTab() {
	$("#list").html('<ul></ul>');
	selectedJSstars.forEach(function(ele) {displayListItem(ele)});
	countPlanets();
}

function displayListItem(item) {
	var listItem = $('<li class="tempItem"><h3>'+item[1]+'</h3><ul><li class="tempDislay"</li><li id="radiusDisplay"></li></ul></li>');
	$("#list").append(listItem);
	
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

