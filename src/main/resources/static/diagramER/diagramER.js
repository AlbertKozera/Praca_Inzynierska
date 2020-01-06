/// <reference path="MindFusion.Diagramming-vsdoc.js" />


var copyRuler;

var Diagram = MindFusion.Diagramming.Diagram;
var TableNode = MindFusion.Diagramming.TableNode;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
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
var DashStyle = MindFusion.Drawing.DashStyle;
var ShadowsStyle = MindFusion.Diagramming.ShadowsStyle;
var CellFrameStyle = MindFusion.Diagramming.CellFrameStyle;
var InteractionState = MindFusion.Diagramming.InteractionState;
var PivotPoint = MindFusion.Drawing;
var GridStyle = MindFusion.Diagramming.GridStyle;
var Utils = MindFusion.Diagramming.Utils;
var DiagramItem = MindFusion.Diagramming.DiagramItem;
var Ruler = MindFusion.Diagramming.Ruler;

var diagram, overview;
var tableCount = 0, rowClicked = -1;
var tblClicked = null, currentLink = null;
var addRowDialog = null, addRowForm = null, addRowName = null, addRowType = null;
var editRowDialog = null, editRowForm = null, editRowName = null, editRowType = null;
var renameTableDialog = null, renameTableForm = null, renameTableCaption = null;
var infoDialog = null, infoText = null;
var btnAddRow, btnEditRow, btnDeleteRow, btnRenameTable, btnInfo;

var highlightedTable = false;
var gridSliderFlag = true;
var rulerSliderFlag = true;
var oldHoverTable, oldHoverCell;
var uniqueTagCell = 0;
var uniqueTagTable = 0;
var selectedHighlightedRow = false;
var selectedHighlightedTable = -1;

$(document).ready(function () {
    // create a Diagram component that wraps the "diagram" canvas
    diagram = MindFusion.AbstractionLayer.createControl(Diagram, null, null, null, $("#diagram")[0]);
    //diagram = Diagram.create(document.getElementById("diagram"));
    //diagram.setBounds(new Rect(0, 0, 600, 207));
    diagram.setBounds(new Rect(0, 0, 898, 898));
    diagram.setUndoEnabled(true);
    diagram.setShowGrid(true);

    // create an Overview component that wraps the "overview" canvas
    var overview = MindFusion.AbstractionLayer.createControl(MindFusion.Diagramming.Overview,
        null, null, null, document.getElementById("overview"));
    overview.setDiagram(diagram);

    // create an Ruler component that wraps the "ruler" div
    var ruler = MindFusion.Diagramming.Ruler.create(document.getElementById("ruler"));
    ruler.setDiagram(diagram);
    ruler.setBackColor("#373737");
    ruler.setForeColor("#616161");
    ruler.setTextColor("rgb(255,68,65)");
    ruler.setPointerColor("#00ff41");
    ruler.setProjectionColor("#3a0030");
    copyRuler = ruler;

    // set some Diagram properties.
    diagram.setBehavior(Behavior.LinkTables);
    diagram.setAllowSelfLoops(false);
    diagram.setBackBrush('rgba(55,55,55,0.87)');
    diagram.setLinkHeadShape('Triangle');
    diagram.setLinkHeadShapeSize(4);
    diagram.getSelection().allowMultipleSelection = true;
    diagram.setGridSizeX(5);
    diagram.setGridSizeY(5);
    diagram.setGridColor("#232323");
    diagram.setGridStyle(GridStyle.Lines);
    diagram.setShadowsStyle(ShadowsStyle.None);

    diagram.setAllowInplaceEdit(false); // click on field and you can edit this

    // set the Diagram style.
    var theme = new Theme();

    var tableNodeStyle = new Style();
    tableNodeStyle.setBrush({
        type: 'RadialGradientBrush',
        color1: 'rgba(21,21,21,0.92)',
        color2: 'rgb(0,0,0)',
        angle: 30
    });
    //ustawienia tekstu wszystkich tabel
    tableNodeStyle.setFontName('Verdana');
    tableNodeStyle.setTextColor({type: 'SolidBrush', color: "#000000"});
    tableNodeStyle.setFontSize(4);
    tableNodeStyle.setTextColor("#ffffff");


    var linkStyle = new Style();
    linkStyle.setBrush({type: 'SolidBrush', color: 'rgb(0,0,0)'});
    linkStyle.setStroke('rgb(192, 192, 192)');

    theme.styles['std:TableNode'] = tableNodeStyle;
    theme.styles['std:DiagramLink'] = linkStyle;

    diagram.setTheme(theme);

    // set table scrollbars
    TableNode.prototype.useScrollBars = true;
    ScrollBar.prototype.background = "#000000";
    ScrollBar.prototype.foreground = "rgba(62,62,62,0.87)";


    // Set diagram event listeners
    diagram.addEventListener(Events.nodeCreated, function (sender, args) {   // tabele tworzone za pomocą myszki
        var table = args.getNode();

        if (table) {
            //nadanie tagu
            table.setTag(uniqueTagTable++);
            //podstawowe ustawienia
            table.redimTable(4, 0);
            table.setScrollable(true);
            table.setConnectionStyle(ConnectionStyle.Rows);
            //nagłówek tabeli
            table.setText("Table" + tableCount++);
            table.setCaptionFont(new Font("Verdana", 3.5, true, true));
            table.setCaptionBackBrush("#191919");
            table.setCaptionHeight(7.5);
            //obramowanie tabeli
            table.setStrokeDashStyle(DashStyle.Solid);
            table.setStrokeThickness(1.5);
            table.setCellFrameStyle(CellFrameStyle.None);
            table.setStroke("#000000");
            //aktualizacja scrollbara
            table.scroller.updateLocation();
            table.scroller.updateContent();

            // set the first column to resize with the table
            table.columns[0] = {width: 5, columnStyle: 0};
            table.getColumn(1).columnStyle = ColumnStyle.AutoWidth;
            table.columns[2] = {width: 17, columnStyle: 0};
            table.columns[3] = {width: 4.9, columnStyle: 0};

            generateSQL();
        }
    });

    diagram.addEventListener(Events.clicked, function (sender, args) {
        turnOffHighlightSelected(selectedHighlightedTable, selectedHighlightedRow);
        tblClicked = null;
        rowClicked = -1;
        rowDeselected();

    });

    canvas.addEventListener('mousemove', function () {
        var point = PivotPoint.Point;
        point.x = diagram.pointerPosition.x;
        point.y = diagram.pointerPosition.y;
        var tableNode = diagram.getNodeAt(point);
        if (tableNode) {  // natrafiono na tabelę
            var hoverCell = tableNode.cellFromPoint({x: point.x, y: point.y});
            if (hoverCell == null)
                hoverCell = false;
            if (oldHoverTable) { // przejście z jednej tabeli na drugą tabele // bezpośrednio
                if (tableNode.getTag() != oldHoverTable.getTag()) {
                    turnOffHighlight(oldHoverTable, oldHoverCell.row);
                    oldHoverTable = false;
                    oldHoverCell = false;
                }
            }
            if (!oldHoverTable) // zabezpieczenie początkowe
                oldHoverTable = tableNode;
            if (!oldHoverCell) // zabezpieczenie początkowe
                oldHoverCell = hoverCell;
            if (hoverCell) { // najechanie na komorke w tabeli
                if (hoverCell.cell.getTag() != "ignore") { // najechanie na dowolny fragment tabeli poza kolumną scrollbara
                    if ((hoverCell.cell.getTag() == oldHoverCell.cell.getTag()) && (hoverCell.row == oldHoverCell.row)) {  // jesli ruszasz myszką ale nie zmieniasz wiersza w tabeli
                        if (isThisCellAlreadyHightlight(hoverCell.cell)) { // sprawdz czy wiersz na ktorego najechales jest pomalowany
                        } else { // jesli nie jest to pomaluj go
                            var hoverRow2 = hoverCell.row;
                            turnOnHighlight(tableNode, hoverRow2)
                        }
                    } else if (hoverCell.cell.getTag() != oldHoverCell.cell.getTag()) { // jesli ruszasz myszką i zmieniłeś wiersz w tabeli
                        var hoverRow = hoverCell.row; // przygotuj wiersz do pomalowania
                        turnOffHighlight(tableNode, oldHoverCell.row); // wyłącz podświetlenie ostatniego wiersza na którym była myszka
                        turnOnHighlight(tableNode, hoverRow); // podświetl wiersz na którego najechałeś myszką
                        oldHoverCell = hoverCell; // wszystkie operacje wykonano, przypisz do starego wiersza wartość nowego, od teraz to on będzie starym wierszem
                    }
                } else { // najechanie na scrollbara
                    turnOffHighlight(tableNode, hoverCell.row); // wylacz podswietlenie po najechaniu na scrollbara
                }
            } else {
                if (oldHoverCell) {  // najechanie z wiersza w tabeli na pustą przestrzeń w tabelce
                    turnOffHighlight(tableNode, oldHoverCell.row); // wylacz podswietlenie po najechaniu na puste miejsce w tabeli
                } else { // najechanie z pustej przestrzeni na pustą przestrzeń w tabelce
                    var test = 0;
                }
            }
        } else {  // nie natrafiono na tabelę
            if (oldHoverTable) { // wylacz podswietlenie w starej tabeli jesli najechales na pustą przestrzeń
                turnOffHighlight(oldHoverTable, oldHoverCell.row);
                oldHoverTable = false;
                oldHoverCell = false;
            }
        }

    });

    diagram.addEventListener(Events.nodeClicked, function (sender, args) {
        rowClicked = -1;
        // wyłączenie podświetlenia wiersza
        turnOffHighlightSelected(selectedHighlightedTable, selectedHighlightedRow);
        rowDeselected();

        tblClicked = args.getNode();

        if (tblClicked) {
            var cellClicked = tblClicked.cellFromPoint(args.getMousePosition());
            if (cellClicked) {
                rowClicked = cellClicked.row;

                // podswietlenie wiersza
                turnOnHighlightSelected(tblClicked, rowClicked);
                rowSelected();
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
            if (cellClicked && (cellClicked.column != 3)) {
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
        $('#btnRenameTable').button("option", "disabled", false);
        $('#btnDeleteTable').button("option", "disabled", false);
    });

    diagram.addEventListener(Events.nodeDeselected, function (sender, args) {
        $('#btnAddRow').button("option", "disabled", true);
        $('#btnRenameTable').button("option", "disabled", true);
        $('#btnDeleteTable').button("option", "disabled", true);
    });

    diagram.addEventListener(Events.linkSelected, function (sender, args) {
        $('#btnInfo').button("option", "disabled", false);
    });

    diagram.addEventListener(Events.linkDeselected, function (sender, args) {
        $('#btnInfo').button("option", "disabled", true);
    });

    canvas.addEventListener('wheel', function (e) {
        e.preventDefault(); // do not use scrollbars

        var point = PivotPoint.Point;
        point.x = diagram.pointerPosition.x;
        point.y = diagram.pointerPosition.y;
        var zoom = diagram.getZoomFactor();
        zoom -= e.deltaY / 15;
        if (zoom > 46 && zoom < 200) {
            diagram.setZoomFactorPivot(zoom, point)
        }
    }, {passive: false});


    // Prepare popup dialogs
    addRowDialog = $("#addRow-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 250,
        modal: true,
        buttons: {
            "OK": addRow,
            Cancel: function () {
                addRowDialog.dialog("close");
            }
        },
        close: function () {
            addRowType.val("NUMBER");
            addRowForm[0].reset();
        }
    });
    addRowForm = addRowDialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addRow();
    });
    addRowName = $("#addRow-fieldName");
    addRowType = $("#addRow-fieldType");


    editRowDialog = $("#editRow-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 250,
        modal: true,
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
        modal: true,
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


    $("#addRow-fieldType").selectmenu("destroy").selectmenu({style: "dropdown"}); // lista typów danych fix
    $("#editRow-fieldType").selectmenu("destroy").selectmenu({style: "dropdown"}); // lista typów danych fix
});

function addRowOpen() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    addRowDialog.dialog("open");
}

function addRow() {
    var table = tblClicked || diagram.getActiveItem();
    var counter, name, type, scrollbarCell;

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    table.addRow();

    var lastRow = table.cells.rows - 1;

    // use the cell indexer to access cells by their column and row
    counter = table.getCell(0, lastRow); // licznik
    counter.setTag(uniqueTagCell++);
    counter.setText(table.rows.length); // ilosc wierszy w tabeli
    name = table.getCell(1, lastRow); // nazwa
    name.setTag(uniqueTagCell++);
    name.setText(addRowName[0].value);
    type = table.getCell(2, lastRow);  // typ
    type.setTag(uniqueTagCell++);
    type.setText(addRowType[0].value);
    scrollbarCell = table.getCell(3, lastRow); // martwa komórka
    scrollbarCell.setTag("ignore");

    // align text in new cells
    counter.setTextAlignment(Alignment.Center);
    counter.setLineAlignment(Alignment.Far);
    name.setTextAlignment(Alignment.Near);
    name.setLineAlignment(Alignment.Far);
    type.setTextAlignment(Alignment.Near);
    type.setLineAlignment(Alignment.Far);

    // setFont to specific column
    counter.setFont(new Font("Arial", 2.8, false, false));
    name.setFont(new Font("Verdana", 3, false, false));
    type.setFont(new Font("Verdana", 3, false, false));

    // setTextColor to specific column
    counter.setTextColor('rgb(220,220,220)');
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
    selectedHighlightedRow = -1;
    selectedHighlightedTable = -1;
    rowDeselected();

    // update the numbering in the table after removing the row
    var counter;
    for (var r = 0; r < number_of_rows; ++r) {
        counter = table.getCell(0, r);
        counter.setText(r + 1);
    }

    // refresh SQL definition
    generateSQL();
}

function createTable() {
    // create a new table with the specified extent
    var table = diagram.getFactory().createTableNode(
        28 + tableCount * 8, 28 + tableCount * 8, 56, 72);  // kratka 4x4 ( położenie tabeli X, położenie tabeli Y, szerokość tabeli, długość tabeli) (zabezpieczenie przed nachodzeniem na siebie kolejnych tabel)
    //nadanie tagu
    table.setTag(uniqueTagTable++);
    //podstawowe ustawienia
    table.redimTable(4, 0);
    table.setScrollable(true);
    table.setConnectionStyle(ConnectionStyle.Rows);
    //nagłówek tabeli
    table.setText("Table" + tableCount++);
    table.setCaptionFont(new Font("Verdana", 3.5, true, true));
    table.setCaptionBackBrush("#191919");
    table.setCaptionHeight(7.5);
    //obramowanie tabeli
    table.setStrokeDashStyle(DashStyle.Solid);
    table.setStrokeThickness(1.5);
    table.setCellFrameStyle(CellFrameStyle.None);
    table.setStroke("#000000");
    //aktualizacja scrollbara
    table.scroller.updateLocation();
    table.scroller.updateContent();

    // set the first column to resize with the table
    table.columns[0] = {width: 5, columnStyle: 0};
    table.getColumn(1).columnStyle = ColumnStyle.AutoWidth;
    table.columns[2] = {width: 17, columnStyle: 0};
    table.columns[3] = {width: 4.9, columnStyle: 0};
    generateSQL();
}

function deleteTable() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    diagram.removeItem(table);

    rowClicked = -1;
    rowDeselected();

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
    diagram.undo();
    generateSQL();
}

function onRedo() {
    diagram.redo();
    generateSQL();
}

function zoomToFit() {
    diagram.zoomToFit();
    if (diagram.getZoomFactor() > 200)
        diagram.setZoomFactor(200);
    else {
        diagram.setZoomFactor(70);
    }
}

function resizeToFitText() {
    var listOfNodes = diagram.getNodes();
    for (var i = 0; i < listOfNodes.length; i++) {
        var table = listOfNodes[i];
        table.resizeToFitText(false,false);
        table.columns[3].width = 4.9;
        table.bounds.width = table.bounds.width + 5;

        if(table.rows.length == 0){
            table.bounds.width = 52;
            table.bounds.height = 16;
            table.updateCanvasElements();
            table.scroller.updateLocation();
        }
        table.updateCanvasElements();
        table.scroller.updateLocation();
        table.scroller.updateContent();
    }
    diagram.repaint();
}

function turnOnHighlightSelected(highlightedTable, rowHighlighted) {
    selectedHighlightedRow = rowHighlighted;
    selectedHighlightedTable = highlightedTable;
    setTextToHighlighted(highlightedTable, rowHighlighted,"#00ff46",true);
}

function turnOffHighlightSelected(highlightedTable, rowHighlighted) {
    if ((highlightedTable != -1) && (rowHighlighted != -1)) {
        setTextToNormal(highlightedTable, rowHighlighted);
        selectedHighlightedRow = -1;
        selectedHighlightedTable = -1;
    }
}

function turnOnHighlight(highlightedTable, rowHighlighted) {
    if ((selectedHighlightedRow != -1) && (selectedHighlightedTable != -1)) {
        if ((rowHighlighted != selectedHighlightedRow)) {
            setTextToHighlighted(highlightedTable, rowHighlighted, "#00cd45", false);
        } else if (highlightedTable.getTag() != selectedHighlightedTable.getTag()) {
            setTextToHighlighted(highlightedTable, rowHighlighted, "#00cd45", false);
        }
    } else { // jesli nie wybrano zadnego wiersza to robisz co chcesz
        setTextToHighlighted(highlightedTable, rowHighlighted, "#00cd45", false);
    }
}

function turnOffHighlight(highlightedTable, rowHighlighted) {

    if ((selectedHighlightedRow != -1) && (selectedHighlightedTable != -1)) {
        if ((rowHighlighted != selectedHighlightedRow)) {
            setTextToNormal(highlightedTable, rowHighlighted);
        } else if (highlightedTable.getTag() != selectedHighlightedTable.getTag()) {
            setTextToNormal(highlightedTable, rowHighlighted);
        }
    } else { // jesli nie wybrano zadnego wiersza to robisz co chcesz
        setTextToNormal(highlightedTable, rowHighlighted);
    }

}

function setTextToNormal(table, row) {
    table.getCell(0, row).setTextColor('rgb(225,225,225)');
    table.getCell(1, row).setTextColor('white');
    table.getCell(2, row).setTextColor('rgb(255,91,98)');
    table.getCell(0, row).setFont(new Font("Arial", 2.8, false, false, false));
    table.getCell(1, row).setFont(new Font("Verdana", 3, false, false, false));
    table.getCell(2, row).setFont(new Font("Verdana", 3, false, false, false));
}

function setTextToHighlighted(table, row, textColor, underline) {
    for (var i = 0; i < 3; i++) {
        var cell = table.getCell(i, row);
        cell.setTextColor(textColor);
    }
    table.getCell(0, row).setFont(new Font("Arial", 2.8, false, false, underline));
    table.getCell(1, row).setFont(new Font("Verdana", 3, false, false, underline));
    table.getCell(2, row).setFont(new Font("Verdana", 3, false, false, underline));
}


function isThisCellAlreadyHightlight(cell) {
    if (cell.getTextColor() == "#00cd45")
        return true;
    else
        return false;
}

function gridSlider() {
    if (gridSliderFlag) {
        diagram.setShowGrid(false);
        gridSliderFlag = false;
    } else {
        diagram.setShowGrid(true);
        gridSliderFlag = true;
    }
}

function rulerSlider() {


    var ruler = copyRuler;
    if (rulerSliderFlag) {
        ruler.setHorizontalScaleVisible(false);
        ruler.setVerticalScaleVisible(false);
        rulerSliderFlag = false;
    } else {
        ruler.setHorizontalScaleVisible(true);
        ruler.setVerticalScaleVisible(true);
        rulerSliderFlag = true;
    }
}




function rowSelected() {
    $('#btnEditRow').button("option", "disabled", false);
    $('#btnDeleteRow').button("option", "disabled", false);
}

function rowDeselected() {
    $('#btnEditRow').button("option", "disabled", true);
    $('#btnDeleteRow').button("option", "disabled", true);
}



