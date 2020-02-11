var flag = true;
$('#sidebarCollapse').click(function() {
    if(flag){
        $('#generatedSql').css({
            'width': '901px'
        });
        flag = false;
    }
    else if(!flag){
        setTimeout(function () {
            $('#generatedSql').css({
                'width': '601px'
            });
        }, 300);
        flag = true;
    }
});