$(function ()
{




	$('select').selectmenu();
	$('input[type=submit], input[type=button], button')
		.button();
	$('#expandButton')
		.click(function (event)
		{
			event.preventDefault();
		});
});

