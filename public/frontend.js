//Jquery button handlers

//Login Modal Handler
$('#login').on('click', function(event) {
	event.preventDefault();
	$('.login-modal').fadeIn('slow');
});

//Hamburger Menu Handler (mobile)
$("#nav-toggle").click(function(){
  $('nav').slideToggle('300');
  $('nav a').on('click', function(event) {
  	$('nav').slideUp('300');
  });
});

//Emotion Buttons
$('.new-mood label').click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
});


$('.new-activity label').click(function(){
    $(this).toggleClass('selected');

});

//put on delete button
//confirm("Press a button!");

