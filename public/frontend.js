//Jquery button handlers

//Login Modal Handler
$('#login').on('click', function(event) {
	event.preventDefault();
	$('.login-modal').fadeIn('slow');
});

//Hamburger Menu Handler (mobile)
// $("nav a").click(function(){
//   $(this).slideToggle("fast");
// }).children().click(function(e) {
//   e.stopPropagation();
// });