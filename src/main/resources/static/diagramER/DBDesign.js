/// <reference path="MindFusion.Diagramming-vsdoc.js" />

var Diagram = MindFusion.Diagramming.Diagram;
var TableNode = MindFusion.Diagramming.TableNode;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var Behavior = MindFusion.Diagramming.Behavior;
var Events = MindFusion.Diagramming.Events;
var Theme = MindFusion.Diagramming.Theme;
var Font = MindFusion.Drawing.Font;
var Alignment = MindFusion.Diagramming.Alignment;
var Style = MindFusion.Diagramming.Style;
var ColumnStyle = MindFusion.Diagramming.ColumnStyle;
var ScrollBar = MindFusion.Diagramming.ScrollBar;
var ConnectionStyle = MindFusion.Diagramming.ConnectionStyle;
var ArrayList = MindFusion.Collections.ArrayList;
var AbstractionLayer = MindFusion.AbstractionLayer;
var Rect = MindFusion.Drawing.Rect;

var diagram;
var tableCount = 0, rowClicked = -1;
var tblClicked = null, currentLink = null;
var addRowDialog = null, addRowForm = null, addRowName = null, addRowType = null;
var editRowDialog = null, editRowForm = null, editRowName = null, editRowType = null;
var renameTableDialog = null, renameTableForm = null, renameTableCaption = null;
var infoDialog = null, infoText = null;
var btnAddRow, btnEditRow, btnDeleteRow, btnRenameTable, btnInfo;


$(document).ready(function () {
    // create a Diagram component that wraps the "diagram" canvas
    diagram = MindFusion.AbstractionLayer.createControl(Diagram, null, null, null, $("#diagram")[0]);
    //diagram = Diagram.create(document.getElementById("diagram"));
    diagram.setBounds(new Rect(0, 0, 600, 207));
    diagram.setUndoEnabled(true);
    diagram.setShowGrid(true);

    // set some Diagram properties.
    diagram.setBehavior(Behavior.LinkTables);
    diagram.setAllowSelfLoops(false);
    diagram.setBackBrush('rgba(21,21,21,0.87)');
    diagram.setLinkHeadShape('Triangle');
    diagram.setLinkHeadShapeSize(4);
    diagram.getSelection().allowMultipleSelection = false;
    //diagram.zoomToFit();

    diagram.setAllowInplaceEdit(true);

    // set the Diagram style.
    var theme = new Theme();

    var tableNodeStyle = new Style();
    tableNodeStyle.setBrush({
        type: 'RadialGradientBrush',
        color1: 'rgba(21,21,21,0.92)',
        color2: 'rgb(0,0,0)',
        angle: 30
    });
    tableNodeStyle.setTextColor({type: 'SolidBrush', color: 'rgb(0,0,0)'});
    tableNodeStyle.setStroke('rgb(255,255,255)');
    tableNodeStyle.setFontName('Verdana');
    tableNodeStyle.setFontSize(4);
    tableNodeStyle.setTextColor('white');

    var linkStyle = new Style();
    linkStyle.setBrush({type: 'SolidBrush', color: 'rgb(0,0,0)'});
    linkStyle.setStroke('rgb(192, 192, 192)');

    theme.styles['std:TableNode'] = tableNodeStyle;
    theme.styles['std:DiagramLink'] = linkStyle;

    diagram.setTheme(theme);


    // set table scrollbars
    TableNode.prototype.useScrollBars = true;
    ScrollBar.prototype.background = "#e0e9e9";
    ScrollBar.prototype.foreground = "DarkGray";




    // Set diagram event listeners
    diagram.addEventListener(Events.nodeCreated, function (sender, args) {   // tabele tworzone za pomocą myszki
        var table = args.getNode();

        if (table) {
            table.setText("Table" + tableCount++);
            table.setCaptionFont(new Font("Verdana", 4, true, true));
            table.redimTable(4, 0);
            table.setScrollable(true);
            table.setConnectionStyle(ConnectionStyle.Rows);

            // set the first column to resize with the table
            table.columns[0] = {width: 5, columnStyle: 0};
            table.getColumn(1).columnStyle = ColumnStyle.AutoWidth;
            table.getColumn(2).columnStyle = ColumnStyle.AutoWidth;
            table.columns[3] = {width: 4.9, columnStyle: 0};

            generateSQL();
        }
    });

    diagram.addEventListener(Events.clicked, function (sender, args) {
        rowClicked = -1;
        tblClicked = null;

        $('#btnEditRow').button().val("Edit row");
        $('#btnDeleteRow').button().val("Delete row");
    });

    diagram.addEventListener(Events.nodeClicked, function (sender, args) {
        rowClicked = -1;
        tblClicked = args.getNode();
        if (tblClicked) {
            var cellClicked = tblClicked.cellFromPoint(args.getMousePosition());
            if (cellClicked) {
                rowClicked = cellClicked.row;
                $('#btnEditRow').button().val("Edit row " + rowClicked);
                $('#btnDeleteRow').button().val("Delete row " + rowClicked);
            }
        }
    });

    // activate table after click, activate cell after click, rename table after click
    diagram.addEventListener(Events.nodeDoubleClicked, function (sender, args) {
        if (tblClicked != args.getNode()) {
            tblClicked = args.getNode();
        }

        if (tblClicked) {
            var cellClicked = tblClicked.cellFromPoint(args.getMousePosition());
            if (cellClicked) {
                rowClicked = cellClicked.row;
                editRowOpen();
            } else if (tblClicked.hitTestManipulators(args.getMousePosition()) == null) {
                if (args.getMousePosition().y <= tblClicked.getBounds().y + tblClicked.getCaptionHeight())
                    renameTableOpen();
                else
                    addRowOpen();
            }
        }
    });

    diagram.addEventListener(Events.linkDoubleClicked, function (sender, args) {
        infoOpen();
    });

    diagram.addEventListener(Events.nodeSelected, function (sender, args) {
        $('#btnAddRow').button("option", "disabled", false);
        $('#btnEditRow').button("option", "disabled", false);
        $('#btnDeleteRow').button("option", "disabled", false);
        $('#btnRenameTable').button("option", "disabled", false);
        $('#btnDeleteTable').button("option", "disabled", false);
    });

    diagram.addEventListener(Events.nodeDeselected, function (sender, args) {
        $('#btnAddRow').button("option", "disabled", true);
        $('#btnEditRow').button("option", "disabled", true);
        $('#btnDeleteRow').button("option", "disabled", true);
        $('#btnRenameTable').button("option", "disabled", true);
        $('#btnDeleteTable').button("option", "disabled", true);
    });

    diagram.addEventListener(Events.linkSelected, function (sender, args) {
        $('#btnInfo').button("option", "disabled", false);
    });

    diagram.addEventListener(Events.linkDeselected, function (sender, args) {
        $('#btnInfo').button("option", "disabled", true);
    });

    document.addEventListener('wheel', function (e) {
        var zoom = diagram.getZoomFactor();
        zoom -= e.deltaY / 20;
        if (zoom > 10)
            diagram.setZoomFactor(zoom);

        //e.preventDefault(); // do not scroll
    });


    // Prepare popup dialogs
    addRowDialog = $("#addRow-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 250,
        modal: false,
        buttons: {
            "OK": addRow,
            Cancel: function () {
                addRowDialog.dialog("close");
            }
        },
        close: function () {
            addRowType.val("NUMBER");
            addRowType.selectmenu("refresh");
            addRowForm[0].reset();
        }
    });
    addRowForm = addRowDialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addRow();
    });
    addRowName = $("#addRow-fieldName");
    addRowType = $("#addRow-fieldType");
    addRowType.selectmenu("destroy").selectmenu({ style: "dropdown" }); // lista opcji fix


    editRowDialog = $("#editRow-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 250,
        modal: false,
        buttons: {
            "OK": editRow,
            Cancel: function () {
                editRowDialog.dialog("close");
            }
        },
        close: function () {
            editRowForm[0].reset();
        }
    });
    editRowForm = editRowDialog.find("form").on("submit", function (event) {
        event.preventDefault();
        editRow();
    });
    editRowName = $("#editRow-fieldName");
    editRowType = $("#editRow-fieldType");

    renameTableDialog = $("#renameTable-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 250,
        modal: false,
        buttons: {
            "OK": renameTable,
            Cancel: function () {
                renameTableDialog.dialog("close");
            }
        },
        close: function () {
            renameTableForm[0].reset();
        }
    });
    renameTableForm = renameTableDialog.find("form").on("submit", function (event) {
        event.preventDefault();
        renameTable();
    });
    renameTableCaption = $("#renameTableCaption");

    infoDialog = $("#info-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 250,
        modal: true,
        buttons: {
            "OK": function () {
                infoDialog.dialog("close");
            }
        }
    });
    infoText = infoDialog.find("p");

    // Prepare buttons
    $('#btnAddRow').button("option", "disabled", true).click(function (event) {
        addRowOpen();
    });
    $('#btnEditRow').button("option", "disabled", true).click(function (event) {
        editRowOpen();
    });
    $('#btnDeleteRow').button("option", "disabled", true).click(function (event) {
        deleteRow();
    });
    $('#btnRenameTable').button("option", "disabled", true).click(function (event) {
        renameTableOpen();
    });
    $('#btnDeleteTable').button("option", "disabled", true).click(function (event) {
        deleteTable();
    });
    $('#btnCreateTable').button().click(function (event) {
        createTable();
    });
    $('#btnInfo').button("option", "disabled", true).click(function (event) {
        infoOpen();
    });
});

function addRowOpen() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    addRowDialog.dialog("open");
}

function addRow() {
    var table = tblClicked || diagram.getActiveItem();
    var counter,name,type;

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    table.addRow();

    var lastRow = table.cells.rows - 1;

    // use the cell indexer to access cells by their column and row
    counter = table.getCell(0, lastRow); // licznik
    counter.setText(table.rows.length); // ilosc wierszy w tabeli
    name = table.getCell(1, lastRow); // nazwa
    name.setText(addRowName[0].value);
    type = table.getCell(2, lastRow);  // typ
    type.setText(addRowType[0].value);

    // align text in new cells
    counter.setTextAlignment(Alignment.Center);
    name.setTextAlignment(Alignment.Center);
    type.setTextAlignment(Alignment.Center);

    // setFont to specific column
    counter.setFont(new Font("Arial", 3, false, false));
    name.setFont(new Font("Verdana", 3, false, false));
    type.setFont(new Font("Verdana", 3, false, false));

    // setTextColor to specific column
    counter.setTextColor('rgb(225,225,225)');
    type.setTextColor('rgb(255,91,98)');

    // dopasowuje tabele do tekstu po dodaniu nowego wiersza - do poprawki
   // table.resizeToFitText(false, false);

    // close the dialog
    addRowDialog.dialog("close");

    // refresh SQL definition
    generateSQL();
}

function editRowOpen() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table) || rowClicked < 0)
        return;

    editRowName.val(table.getCell(1, rowClicked).getText());
    editRowType.val(table.getCell(2, rowClicked).getText());
    editRowType.selectmenu("refresh");

    editRowDialog.dialog("open");
}

function editRow() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table) || rowClicked < 0)
        return;

    // use the cell indexer to access cells by their column and row
    table.getCell(1, rowClicked).setText(editRowName[0].value);
    table.getCell(2, rowClicked).setText(editRowType[0].value);

    // close the dialog
    editRowDialog.dialog("close");

    // refresh SQL definition
    generateSQL();
}

function deleteRow() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table) || rowClicked < 0)
        return;

    table.deleteRow(rowClicked);
    var number_of_rows = table.rows.length;

    rowClicked = -1;
    $('#btnEditRow').button().val("Edit row");
    $('#btnDeleteRow').button().val("Delete row");


    // update the numbering in the table after removing the row
    var counter;
    for (var r = 0; r < number_of_rows; ++r) {
        counter = table.getCell(0, r);
        counter.setText(r+1);
    }

    // refresh SQL definition
    generateSQL();
}

function createTable() {
    // create a new table with the specified extent
    var cell;
    var table = diagram.getFactory().createTableNode(
        15 + tableCount * 5, 15 + tableCount * 5, 50, 60);  // ( położenie tabeli X, położenie tabeli Y, szerokość tabeli, długość tabeli) (zabezpieczenie przed nachodzeniem na siebie kolejnych tabel)
    table.setText("Table" + tableCount++);
    table.setCaptionFont(new Font("Verdana", 4, true, true));
    table.redimTable(4, 0);
    table.setScrollable(false);
    table.setConnectionStyle(ConnectionStyle.Rows);

    // set the first column to resize with the table

    table.columns[0] = {width: 5, columnStyle: 0};
    table.getColumn(1).columnStyle = ColumnStyle.AutoWidth;
    table.getColumn(2).columnStyle = ColumnStyle.AutoWidth;
    table.columns[3] = {width: 4.9, columnStyle: 0};

    generateSQL();
}

function deleteTable() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    diagram.removeItem(table);

    rowClicked = -1;
    $('#btnEditRow').button().val("Edit row");
    $('#btnDeleteRow').button().val("Delete row");

    // refresh SQL definition
    generateSQL();
}

function renameTableOpen() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    renameTableCaption.val(table.getText());

    renameTableDialog.dialog("open");
}

function renameTable() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    table.setText(renameTableCaption[0].value);

    // close the dialog
    renameTableDialog.dialog("close");

    // refresh SQL definition
    generateSQL();
}

function infoOpen() {
    var link = diagram.getActiveItem();

    if (!link || !AbstractionLayer.isInstanceOfType(DiagramLink, link))
        return;

    var dest = link.getDestination();
    var orgn = link.getOrigin();
    infoText[0].innerHTML = "Linking \ntable " + orgn.getText() + ", row " +
        link.getOriginIndex() + " to\n table " + dest.getText() +
        ", row " + link.getDestinationIndex();

    infoDialog.dialog("open");
}

function generateSQL() {
    var text = '';

    // enumerate all tables in the current diagram
    ArrayList.forEach(diagram.nodes, function (table) {
        text += "CREATE TABLE " + table.getText() + "\r\n(";

        // enumerate all rows of a table
        for (var r = 0; r < table.cells.rows; ++r) {
            // get text of cells in current row
            text += "\t" + table.getCell(1, r).getText() + " " + table.getCell(2, r).getText();
            if (r < table.cells.rows - 1)
                text += ",\r\n";
        }
        text += "\r\n);\r\n\r\n";
    });
    $('#generatedSql')[0].innerHTML = text;
}

function onUndo() {
    deleteTable();
    diagram.undo();
}

function onRedo() {
    createTable();
    diagram.redo();
}