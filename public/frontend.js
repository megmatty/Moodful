//Jquery button handlers

//Login Modal Handler
$('#login').on('click', function(event) {
	event.preventDefault();
	$('.login-modal').fadeIn('slow');
});

//keep focus on login modal
$('#login button').submit(function(event) {
	event.preventDefault();
	$('#user').focus();
	$('.login-modal').fadeOut('slow');
});

//Hamburger Menu Handler (mobile)
$("#nav-toggle").click(function(){
  $('nav').slideToggle('300');
  $('nav a').on('click', function(event) {
  	$('nav').slideUp('300');
  });
});

//Emotion-Activity Buttons
$('.new-mood label').click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
});

$('.new-mood input').click(function(){
    $(this).attr('checked', true);
});

$('.new-activity label').click(function(){
    $(this).toggleClass('selected');
});

