$(document).ready(function () {
	displayPlanets(getPlanets());
});

function displayPlanets(planets) {
	console.log('hello world');
}

function getPlanets() {
	$.get('/planets', function(data) {
		console.log(data);
	});
	
}
