$(document).ready(function() {
    $('#rulerSlider').click(function () {

        if ($("#canvas").hasClass('gridOFF')) {
            $("#canvas").removeClass('gridOFF').addClass('canvas')
        } else {
            $("#canvas").removeClass('canvas').addClass('gridOFF')
        }
    });
});