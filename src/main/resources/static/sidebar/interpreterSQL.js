function executeSQL(interpreterSQL) {
    var tmp = document.getElementById(interpreterSQL).value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var response = xhttp.responseText;
            var responseJSON = JSON.parse(response);
            var feedback = responseJSON.feedback;
            var feedbackString = feedback[0];

            if(feedbackString.indexOf("Operacja została wykonana pomyślnie") === 0){
                ifOperationWasSuccessed();
            }else{
                ifOperationWasNotSuccessed();
            }

            document.getElementById("errorsHandler").value = feedbackString;
            console.log(feedbackString);
        }
    };

    xhttp.open("POST", "/user/executeSQL", true);
    xhttp.send(tmp);
}


function ifOperationWasSuccessed() {
    $('#errorsHandler').css({
        'color': 'rgb(0, 255, 0)'
    });
}

function ifOperationWasNotSuccessed() {
    $('#errorsHandler').css({
        'color': 'red'
    });
}
