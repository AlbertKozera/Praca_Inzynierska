$('#addRowPK').change(function () {
    if ($(this).prop('checked')) {
        $('#addRowNN').prop('checked', true);
    }
});
$('#addRowNN').change(function () {
    if ($(this).prop('checked')) {
    }
    else{
        $('#addRowPK').prop('checked', false);
    }
});
$('#editRowPK').change(function () {
    if ($(this).prop('checked')) {
        $('#editRowNN').prop('checked', true);
    }
});
$('#editRowNN').change(function () {
    if ($(this).prop('checked')) {
    }
    else{
        $('#editRowPK').prop('checked', false);
    }
});
