$('#users').on('click', function() {

    if($(this).hasClass('active')){

    }
    else{
        $('#th_addUser').css("display", "none");

        $('li').each(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });
        $(this).addClass('active');
    }
});







$('#add_user').on('click', function() {

    if($(this).hasClass('active')){

    }
    else{
        $('#th_addUser').css("display", "block");

        $('li').each(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });
        $(this).addClass('active');
    }
});



$('#edit_user').on('click', function() {

    if($(this).hasClass('active')){

    }
    else{
        $('#th_addUser').css("display", "none");

        $('li').each(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });
        $(this).addClass('active');
    }
});



$('#delete_user').on('click', function() {

    if($(this).hasClass('active')){

    }
    else{
        $('#th_addUser').css("display", "none");

        $('li').each(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });
        $(this).addClass('active');
    }
});