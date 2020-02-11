$('#addRowPK').change(function () {
    if ($(this).prop('checked')) {
        $('#addRowNN').prop('checked', true);
        $('#addRowUK').prop('checked', false);
    }
});
$('#addRowUK').change(function () {
    if ($(this).prop('checked')) {
        $('#addRowPK').prop('checked', false);
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
        $('#editRowUK').prop('checked', false);
    }
});
$('#editRowUK').change(function () {
    if ($(this).prop('checked')) {
        $('#editRowPK').prop('checked', false);
    }
});
$('#editRowNN').change(function () {
    if ($(this).prop('checked')) {
    }
    else{
        $('#editRowPK').prop('checked', false);
    }
});