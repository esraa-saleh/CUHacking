var jsstars = getPlanets();

$(document).ready(function () {
	$('#filters-tab').click(function(evt) {
		openTab(evt, 'filters');
	});
	$('#list-tab').click(function(evt) {
		openTab(evt, 'list');
	});
	$('input').change(function() {
		var checked = $(':checked');
		var filters = {}
		for (i=0; i<checked.length; i++) {
			filters[i] = checked[i].value;
		};
		$.ajax({
			url: '/filters', 
			data: filters,
			success: function(data) {
				console.log(data);
			},
			dataType: 'application/json',
		});
	});
});

function getPlanets() {
	$.getJSON('/planets', function(data) {
		jsstars = data;
	});
	countPlanets();
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
