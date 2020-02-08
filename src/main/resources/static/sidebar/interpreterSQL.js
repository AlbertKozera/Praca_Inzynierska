function executeSQL(interpreterSQL) {
    document.getElementById("errorsHandler").value = "";
    document.getElementById("queryHandler").value = "";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var response = xhttp.responseText;
            var responseJSON = JSON.parse(response);
            var feedback = responseJSON.feedback;

            if(feedback.mapa != null){
                var namesOfColumns = Object.keys(feedback.mapa[0]);
                var numberOfRows = 1;

                document.getElementById("queryHandler").value += "         ";
                for(var r = 0; r < namesOfColumns.length ; ++r){
                    if(r < (namesOfColumns.length - 1))
                        document.getElementById("queryHandler").value += namesOfColumns[r] + "  |  ";
                    else
                        document.getElementById("queryHandler").value += namesOfColumns[r];
                }
                document.getElementById("queryHandler").value += "\n";
                for(var r = 0; r < feedback.mapa.length ; ++r){
                    if((numberOfRows + '').indexOf('1') > -1)
                        document.getElementById("queryHandler").value += numberOfRows++ + "   |    ";
                    else
                        document.getElementById("queryHandler").value += numberOfRows++ + "  |    ";
                    var dataRow = Object.values(feedback.mapa[r]);
                    for(var i = 0; i < dataRow.length ; ++i) {
                        if(i < (dataRow.length - 1))
                            document.getElementById("queryHandler").value += dataRow[i] + ",  ";
                        else
                            document.getElementById("queryHandler").value += dataRow[i];
                    }
                    document.getElementById("queryHandler").value += "\n";
                }
                for(var r = 0; r < feedback.lista.length ; ++r){
                    document.getElementById("errorsHandler").value += feedback.lista[r] + "\n";
                }
                if(feedback.updateFlag)
                    ifOperationWasSuccessed('#errorsHandler');
                else if(!feedback.updateFlag)
                    ifOperationWasNotSuccessed('#errorsHandler');
            }
            else{
                for(var r = 0; r < feedback.lista.length ; ++r){
                    var errorMessage = feedback.lista[r].replace(/\n/ig, '');
                    document.getElementById("errorsHandler").value += errorMessage + "\n";
                    if(feedback.updateFlag)
                        ifOperationWasSuccessed('#errorsHandler');
                    else if(!feedback.updateFlag)
                        ifOperationWasNotSuccessed('#errorsHandler');
                }
            }
        }
    };

    xhttp.open("POST", "/customer/executeSQL", true);
    xhttp.send(document.getElementById(interpreterSQL).value);
}

function ifOperationWasSuccessed(textarea) {
    $(textarea).css({
        'color': 'rgb(0, 255, 0)'
    });
}

function ifOperationWasNotSuccessed(textarea) {
    $(textarea).css({
        'color': 'red'
    });
}
