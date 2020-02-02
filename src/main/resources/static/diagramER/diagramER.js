/// <reference path="MindFusion.Diagramming-vsdoc.js" />
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
var HandlesStyle = MindFusion.Diagramming;
var Shape = MindFusion.Diagramming.Shape;

var diagram, overview;
var tableCount = 0, rowClicked = -1;
var tblClicked = null, currentLink = null;
var addRowDialog = null, addRowForm = null, addRowName = null, addRowType = null, addRowPK = null, addRowUK = null,
    addRowNN = null, editRowPK = null, editRowUK = null, editRowNN = null;
var editRowDialog = null, editRowForm = null, editRowName = null, editRowType = null;
var renameTableDialog = null, renameTableForm = null, renameTableCaption = null;
var infoDialog = null, infoText = null;
var feedbackDialog = null;
var btnAddRow, btnEditRow, btnDeleteRow, btnRenameTable, btnInfo;

var highlightedTable = false;
var gridSliderFlag = true;
var rulerSliderFlag = true;
var oldHoverTable, oldHoverCell;
var uniqueTagCell = 0;
var uniqueTagTable = 0;
var selectedHighlightedRow = false;
var selectedHighlightedTable = -1;
var youCanNotConnectNormalPool = false;
var link_youCanNotConnectNormalPool = null;
var oneToOne = new Shape({outline: '', decoration: 'M13,110 L87,110 M13,80 L87,80', id: 'OneToOne'});
var noShape = new Shape({outline: '', decoration: 'M0,0 L0,0', id: 'NoShape'});

var copyRuler;
var editedDiagramJson;

$(document).ready(function () {
    // create a Diagram component that wraps the "diagram" canvas
    diagram = MindFusion.AbstractionLayer.createControl(Diagram, null, null, null, $("#diagram")[0]);
    //diagram = Diagram.create(document.getElementById("diagram"));
    //diagram.setBounds(new Rect(0, 0, 600, 207));
    diagram.setBounds(new Rect(0, 0, 700, 700));
    diagram.setUndoEnabled(true);
    diagram.setShowGrid(true);

    // create an Overview component that wraps the "overview" canvas
    var overview = MindFusion.AbstractionLayer.createControl(MindFusion.Diagramming.Overview,
        null, null, null, document.getElementById("overview"));
    overview.setDiagram(diagram);

    // create an Ruler component that wraps the "ruler" div
    var ruler = MindFusion.Diagramming.Ruler.create(document.getElementById("ruler"));
    ruler.setDiagram(diagram);
    ruler.setBackColor("#272c32");
    ruler.setForeColor("#616161");
    ruler.setTextColor("rgb(194,84,254)");
    ruler.setPointerColor("#00ff41");
    ruler.setProjectionColor("#3a0030");
    //ruler.scaleSize = 0;
    copyRuler = ruler;

    // set some Diagram properties.
    diagram.setBehavior(Behavior.LinkTables);
    diagram.setAllowSelfLoops(false);
    diagram.setBackBrush('rgba(64,69,75,0.87)');
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
        color1: 'rgba(54,59,65,0.92)',
        color2: 'rgb(39,44,50)',
        angle: 30
    });
    //ustawienia tekstu wszystkich tabel
    tableNodeStyle.setFontName('Verdana');
    tableNodeStyle.setTextColor({type: 'SolidBrush', color: "#000000"});
    tableNodeStyle.setFontSize(4);
    tableNodeStyle.setTextColor("#ffffff");

    var linkStyle = new Style();
    linkStyle.setStroke('rgb(255,255,255)');
    diagram.setLinkHeadShape('NoShape');
    diagram.setLinkBaseShape('NoShape');
    diagram.setLinkHeadShapeSize(3);
    diagram.setLinkBaseShapeSize(3);

    theme.styles['std:TableNode'] = tableNodeStyle;
    theme.styles['std:DiagramLink'] = linkStyle;

    diagram.setTheme(theme);

    // set table scrollbars
    TableNode.prototype.useScrollBars = true;
    ScrollBar.prototype.background = "rgba(33,39,45,0.89)";
    ScrollBar.prototype.foreground = "rgba(66,71,77,0.87)";


    // Set diagram event listeners
    diagram.addEventListener(Events.nodeCreated, function (sender, args) {   // tabele tworzone za pomocą myszki
        var table = args.getNode();

        if (table) {
            diagram.addEventListener(Events.nodeCreating, tableNodeCreatingHandler);
            generateSQL();
        }
    });

    var tableNodeCreatingHandler = function (sender, args) {
        var table = args.getNode();
        //nadanie tagu
        table.setTag(uniqueTagTable++);
        //podstawowe ustawienia
        table.redimTable(7, 0);
        table.setScrollable(true);
        table.setConnectionStyle(ConnectionStyle.Rows);
        //nagłówek tabeli
        table.setText("Table" + tableCount++);
        table.setCaptionFont(new Font("Verdana", 3.5, true, true));
        table.setCaptionBackBrush("#1a1f25");
        table.setCaptionHeight(7.5);
        //obramowanie tabeli
        table.setStrokeDashStyle(DashStyle.Solid);
        table.setStrokeThickness(1.5);
        table.setCellFrameStyle(CellFrameStyle.None);
        table.setStroke("#21272D");
        //aktualizacja scrollbara
        table.scroller.updateLocation();
        table.scroller.updateContent();
        //ustawienie haków
        table.setHandlesStyle(2);

        // set the first column to resize with the table
        table.columns[0] = {width: 5, columnStyle: 0};
        table.getColumn(1).columnStyle = ColumnStyle.AutoWidth;
        table.getColumn(2).columnStyle = ColumnStyle.AutoWidth;
        table.columns[3] = {width: 0, columnStyle: 0};
        table.columns[4] = {width: 0, columnStyle: 0};
        table.columns[5] = {width: 0, columnStyle: 0};
        table.columns[6] = {width: 4.9, columnStyle: 0};

        diagram.removeEventListener(Events.nodeCreating, tableNodeCreatingHandler);
    };
    diagram.addEventListener(Events.nodeCreating, tableNodeCreatingHandler);




    diagram.addEventListener(Events.clicked, function (sender, args) {
        turnOffHighlightSelected(selectedHighlightedTable, selectedHighlightedRow);
        tblClicked = null;
        rowClicked = -1;

    });

    diagram.addEventListener(Events.nodeDeleted, function (sender, args) {
        generateSQL();
    });

    canvas.addEventListener('mousemove', function () {
        if (youCanNotConnectNormalPool) {
            youCanNotConnectNormalPool = false;
            diagram.removeItem(link_youCanNotConnectNormalPool);
        }

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

    diagram.addEventListener(Events.linkDeleted, function (sender, args) {
        var tableOrigin = args.link.getOrigin();
        var rowOrigin = args.link.getOriginIndex();
        var getcel = tableOrigin.getCell(1, rowOrigin);

        if(tableOrigin.getCell(3, rowOrigin).getText() == "true")
            getcel.setText("🔑 " + regex(getcel.getText()));
        else if(tableOrigin.getCell(4, rowOrigin).getText() == "true")
            getcel.setText(regex(getcel.getText()) + " 🔹");
        else
            getcel.setText(regex(getcel.getText()));

        generateSQL();
    });

    diagram.addEventListener(Events.linkCreating, function (sender, args) {
        if (args.link.originConnection.row == -1) {
            args.setCancel(true);
            args.cancelDrag();
            return;
        } else if (args.link.targetConnection != null) {
            if (args.link.targetConnection.row == -1) {
                args.setCancel(true);
            }
        }
    });

    diagram.addEventListener(Events.linkCreated, function (sender, args) {
        var linkCreated = args.getLink();
        var tableDestination = linkCreated.getDestination();
        var tableOrigin = linkCreated.getOrigin();
        var rowDestination = linkCreated.getDestinationIndex();
        var rowOrigin = linkCreated.getOriginIndex();
        if (
            ((tableDestination.getCell(3, rowDestination).getText() == "true") || (tableDestination.getCell(4, rowDestination).getText() == "true"))
            &&
            ((tableOrigin.getCell(3, rowOrigin).getText() == "true") || (tableOrigin.getCell(4, rowOrigin).getText() == "true"))
        ) {
            linkCreated.setBaseShape('OneToOne');
            linkCreated.setHeadShape('OneToOne');
            var fk = tableOrigin.getCell(1, rowOrigin).getText();
            if(tableOrigin.getCell(3, rowOrigin).getText() == "true")
                tableOrigin.getCell(1, rowOrigin).setText("🗝" + fk);
            else
                tableOrigin.getCell(1, rowOrigin).setText("🗝 " + fk);
        }
        else if (
            ((tableDestination.getCell(3, rowDestination).getText() == "true") || (tableDestination.getCell(4, rowDestination).getText() == "true"))
            &&
            ((tableOrigin.getCell(3, rowOrigin).getText() == "false") && (tableOrigin.getCell(4, rowOrigin).getText() == "false"))
        ) {
            linkCreated.setBaseShape('RevWithLine');
            linkCreated.setHeadShape('OneToOne');
            var fk = tableOrigin.getCell(1, rowOrigin).getText();
            tableOrigin.getCell(1, rowOrigin).setText("🗝 " + fk);
        } else {
            youCanNotConnectNormalPool = true;
            link_youCanNotConnectNormalPool = linkCreated;
            var fk = tableOrigin.getCell(1, rowOrigin).getText();
            tableOrigin.getCell(1, rowOrigin).setText("🗝 " + fk);
        }
        generateSQL();
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
        if (zoom > 67.2 && zoom < 200) {
            diagram.setZoomFactorPivot(zoom, point)
        }
        if (zoom < 67.2) {
            zoom = 72;
            diagram.setZoomFactorPivot(zoom, point)
        }
    }, {passive: false});


    // Prepare popup dialogs
    addRowDialog = $("#addRow-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 270,
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
    addRowPK = $("#addRowPK");
    addRowUK = $("#addRowUK");
    addRowNN = $("#addRowNN");


    editRowDialog = $("#editRow-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 270,
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
    editRowPK = $("#editRowPK");
    editRowUK = $("#editRowUK");
    editRowNN = $("#editRowNN");

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
        width: 440,
        modal: true,
        buttons: {
            "OK": function () {
                infoDialog.dialog("close");
            }
        }
    });
    infoText = infoDialog.find("p");

    feedbackDialog = $("#feedback-dialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 1035,
        modal: true,
        buttons: {
            "OK": function () {
                feedbackDialog.dialog("close");
            }
        }
    });

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

    $("#addRow-fieldType").selectmenu("destroy").selectmenu({style: "dropdown"});
    $("#editRow-fieldType").selectmenu("destroy").selectmenu({style: "dropdown"});

    if(typeof schemaERD !== 'undefined'){
        loadFromJson(schemaERD);
        generateSQL();
    }
});

function addRowOpen() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table))
        return;

    addRowDialog.dialog("open");
}

function addRow() {
    var table = tblClicked || diagram.getActiveItem();
    var counter, name, type, pk, uk, nn, scrollbarCell;

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
    pk = table.getCell(3, lastRow); // pk
    pk.setText(addRowPK[0].checked);
    uk = table.getCell(4, lastRow); // uk
    uk.setText(addRowUK[0].checked);
    nn = table.getCell(5, lastRow); // nn
    if (addRowNN[0].checked == true)
        nn.setText("NOT NULL");
    scrollbarCell = table.getCell(6, lastRow); // martwa komórka
    scrollbarCell.setTag("ignore");

    if(pk.getText() == "true")
        name.setText("🔑 " + addRowName[0].value)
    if(uk.getText() == "true")
        name.setText(addRowName[0].value + " 🔹")

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
    pk.setFont(new Font("Verdana", 0, false, false));
    uk.setFont(new Font("Verdana", 0, false, false));
    nn.setFont(new Font("Verdana", 0, false, false));

    // setTextColor to specific column
    counter.setTextColor('rgb(220,220,220)');
    type.setTextColor('rgb(255,91,98)');

    // close the dialog
    addRowDialog.dialog("close");

    // refresh SQL definition
    generateSQL();
}

function editRowOpen() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table) || rowClicked < 0)
        return;

    editRowName.val(regex(table.getCell(1, rowClicked).getText()));
    editRowType.val(table.getCell(2, rowClicked).getText());
    if (table.getCell(3, rowClicked).getText() == "true") {
        editRowPK.attr("checked", true);
    } else
        editRowPK.attr("checked", false);
    if (table.getCell(4, rowClicked).getText() == "true") {
        editRowUK.attr("checked", true);
    } else
        editRowUK.attr("checked", false);
    if (table.getCell(5, rowClicked).getText() == "NOT NULL") {
        editRowNN.attr("checked", true);
    } else
        editRowNN.attr("checked", false);

    editRowType.selectmenu("refresh");
    editRowDialog.dialog("open");
}

function editRow() {
    var table = tblClicked || diagram.getActiveItem();

    if (!table || !AbstractionLayer.isInstanceOfType(TableNode, table) || rowClicked < 0)
        return;

    var getcel = table.getCell(1, rowClicked);
    var textcel = table.getCell(1, rowClicked).getText();
    // use the cell indexer to access cells by their column and row
    table.getCell(1, rowClicked).setText(editRowName[0].value);
    table.getCell(2, rowClicked).setText(editRowType[0].value);
    table.getCell(3, rowClicked).setText(editRowPK[0].checked);
    table.getCell(4, rowClicked).setText(editRowUK[0].checked);
    if(editRowNN[0].checked == true)
        table.getCell(5, rowClicked).setText("NOT NULL");
    else
        table.getCell(5, rowClicked).setText("");

    var PK_state = editRowPK[0].checked, UK_state = editRowUK[0].checked;

    if((PK_state == true) && (isThisFieldIsForeignKey(textcel)))
        getcel.setText("🗝🔑 " + regex(getcel.getText()));
    else if((PK_state == true) && !(isThisFieldIsForeignKey(textcel)))
        getcel.setText("🔑 " + regex(getcel.getText()));
    else if((PK_state == false) && (isThisFieldIsForeignKey(textcel)))
        getcel.setText("🗝 " + regex(getcel.getText()));
    else
        getcel.setText(regex(getcel.getText()));

    if((UK_state == true) && (isThisFieldIsForeignKey(textcel)))
        getcel.setText("🗝 " + regex(getcel.getText()) + " 🔹");
    else if((UK_state == true) && !(isThisFieldIsForeignKey(textcel)))
        getcel.setText(regex(getcel.getText()) + " 🔹");
    else if((UK_state == false) && (PK_state == false) && (isThisFieldIsForeignKey(textcel)))
        getcel.setText("🗝 " + regex(getcel.getText()));
    else if((UK_state == false) && (PK_state == false) && !(isThisFieldIsForeignKey(textcel)))
        getcel.setText(regex(getcel.getText()));

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
    table.redimTable(7, 0);
    table.setScrollable(true);
    table.setConnectionStyle(ConnectionStyle.Rows);
    //nagłówek tabeli
    table.setText("Table" + tableCount++);
    table.setCaptionFont(new Font("Verdana", 3.5, true, true));
    table.setCaptionBackBrush("#1a1f25");
    table.setCaptionHeight(7.5);
    //obramowanie tabeli
    table.setStrokeDashStyle(DashStyle.Solid);
    table.setStrokeThickness(1.5);
    table.setCellFrameStyle(CellFrameStyle.None);
    table.setStroke("#21272D");
    //aktualizacja scrollbara
    table.scroller.updateLocation();
    table.scroller.updateContent();
    //ustawienie haków
    table.setHandlesStyle(2);

    // set the first column to resize with the table
    table.columns[0] = {width: 5, columnStyle: 0};
    table.getColumn(1).columnStyle = ColumnStyle.AutoWidth;
    table.getColumn(2).columnStyle = ColumnStyle.AutoWidth;
    table.columns[3] = {width: 0, columnStyle: 0};
    table.columns[4] = {width: 0, columnStyle: 0};
    table.columns[5] = {width: 0, columnStyle: 0};
    table.columns[6] = {width: 4.9, columnStyle: 0};
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

    var origin = false, destination = false;
    var tableDestination = link.getDestination();
    var tableOrigin = link.getOrigin();
    var rowDestination = link.getDestinationIndex();
    var rowOrigin = link.getOriginIndex();

    var text = '';
    text += "ALTER TABLE " + tableOrigin.getText();
    text += " ADD CONSTRAINT " + tableOrigin.getText() + "_FK";
    text += " FOREIGN KEY " + "(";
    if ((tableOrigin.getCell(3, rowOrigin).getText() == "true") && (!origin)) {
        text = addFieldToGeneratedText(3, tableOrigin, text);
        origin = true;
    }
    else if ((tableOrigin.getCell(4, rowOrigin).getText() == "true") && (!origin)) {
        text = addFieldToGeneratedText(4, tableOrigin, text);
        origin = true;
    }
    else if (!origin){
        text += regex(tableOrigin.getCell(1, rowOrigin).getText());
        origin = true;
    }
    text += ")" + "\n";
    text += "REFERENCES " + tableDestination.getText() + " (";
    if ((tableDestination.getCell(3, rowDestination).getText() == "true") && (!destination)) {
        text = addFieldToGeneratedText(3, tableDestination, text);
        destination = true;
    }
    if ((tableDestination.getCell(4, rowDestination).getText() == "true") && (!destination)) {
        text = addFieldToGeneratedText(4, tableDestination, text);
        destination = true;
    }
    text += ");";

    $('#generatedSqlFK')[0].innerHTML = text;

    infoDialog.dialog("open");
}

function generateSQL() {
    var text = '';

    // enumerate all tables in the current diagram
    ArrayList.forEach(diagram.nodes, function (table) {
        text += "CREATE TABLE " + table.getText() + " (\n";

        // enumerate all rows of a table
        for (var r = 0; r < table.cells.rows; ++r) {
            // get text of cells in current row
            text += "\t" + regex(table.getCell(1, r).getText()) + " " + table.getCell(2, r).getText();
            if((table.getCell(5, r).getText()) == "NOT NULL")
                text += " NOT NULL";
            if (r < table.cells.rows - 1)
                text += ",\r\n";
        }
        text += "\r\n);\r\n";
    });

    // alter table Primary Key
    var flag_PK = true;
    ArrayList.forEach(diagram.nodes, function (table) {
        for (var r = 0; r < table.cells.rows; ++r) {
            if (table.getCell(3, r).getText() == "true" && flag_PK)
            {
                text += "\nALTER TABLE " + table.getText();
                text += " ADD CONSTRAINT " + table.getText() + "_PK " + "PRIMARY KEY " + "(";
                flag_PK = false;
            }
            if (table.getCell(3, r).getText() == "true" && !flag_PK)
            {
                text += regex(table.getCell(1, r).getText());
                if (isThereMoreThanOne(table, 3) > 1 && r < counterOfPrimaryAndUniqueKeys(table, 3))
                    text += ", ";
            }
        }
        if (!flag_PK) {
            text += ");";
            flag_PK = true;
        }
    });

    // alter table Unique Key
    var flag_UK = true;
    var iterator_numbersUK = 0;
    ArrayList.forEach(diagram.nodes, function (table) {
        for (var r = 0; r < table.cells.rows; ++r) {
            if (table.getCell(4, r).getText() == "true" && flag_UK) // sprawdz czy wiersz to unique key
            {
                text += "\nALTER TABLE " + table.getText();
                text += " ADD CONSTRAINT " + table.getText() + "_UK" + ++iterator_numbersUK + " UNIQUE " + "(";
                flag_UK = false;
            }
            if (table.getCell(4, r).getText() == "true" && !flag_UK) // sprawdz czy wiersz to unique key
            {
                text += regex(table.getCell(1, r).getText());
                if (isThereMoreThanOne(table, 4) > 1 && r < counterOfPrimaryAndUniqueKeys(table, 4))
                    text += ", ";
            }
        }
        if (!flag_UK) {
            text += ");";
            flag_UK = true;
        }
    });

    // alter table Foreign Key
    var iterator_numbersFK = 0;
    ArrayList.forEach(diagram.links, function (link) {
            var origin = false, destination = false;
            var tableDestination = link.getDestination();
            var tableOrigin = link.getOrigin();
            var rowDestination = link.getDestinationIndex();
            var rowOrigin = link.getOriginIndex();

            text += "\nALTER TABLE " + tableOrigin.getText();
            text += " ADD CONSTRAINT " + tableOrigin.getText() + "_FK" + ++iterator_numbersFK;
            text += " FOREIGN KEY " + "(";

            if ((tableOrigin.getCell(3, rowOrigin).getText() == "true") && (!origin)) {
                text += regex(tableOrigin.getCell(1, rowOrigin).getText());
                text = addFieldToGeneratedText(3, tableOrigin, text);
                origin = true;
            }
            else if ((tableOrigin.getCell(4, rowOrigin).getText() == "true") && (!origin)) {
                text += regex(tableOrigin.getCell(1, rowOrigin).getText());
                text = addFieldToGeneratedText(4, tableOrigin, text);
                origin = true;
            }
            else if (!origin){
                text += regex(tableOrigin.getCell(1, rowOrigin).getText());
                origin = true;
            }
            text += ")" + "\n";
            text += "REFERENCES " + tableDestination.getText() + " (";
            if ((tableDestination.getCell(3, rowDestination).getText() == "true") && (!destination)) {
                text += regex(tableDestination.getCell(1, rowDestination).getText());
                text = addFieldToGeneratedText(3, tableDestination, text);
                destination = true;
            }
            if ((tableDestination.getCell(4, rowDestination).getText() == "true") && (!destination)) {
                text += regex(tableDestination.getCell(1, rowDestination).getText());
                text = addFieldToGeneratedText(4, tableDestination, text);
                destination = true;
            }
            text += ");";

    });

    ArrayList.forEach(diagram.links, function (link) {
        var tableDestination = link.getDestination();
        var tableOrigin = link.getOrigin();
        var rowDestination = link.getDestinationIndex();
        var rowOrigin = link.getOriginIndex();

        var i = 0;
        for (var r = 0; r < tableOrigin.cells.rows; ++r) {
            if((tableOrigin.getCell(3, r).getText() == "true") || (tableOrigin.getCell(4, r).getText() == "true")){
                if(tableOrigin.rows[r].outgoingLinks.length == 1){
                    i++;
                }
            }
        }
        if(i>1){
            for (var r = 0; r < tableOrigin.cells.rows; ++r) {
                if((tableOrigin.getCell(3, r).getText() == "true") || (tableOrigin.getCell(4, r).getText() == "true")){
                    if(tableOrigin.rows[r].outgoingLinks.length == 1){

                        tableOrigin.rows[r].outgoingLinks[0].setBaseShape('RevWithLine');
                        tableOrigin.rows[r].outgoingLinks[0].setHeadShape('OneToOne');
                    }
                }
            }
        }
    });

    $('#generatedSql')[0].innerHTML = text;
}

function genereteSqlHidden() {
    var text = '';

    text = "CREATE USER " + "\"" + $('#schema_name').val() + "\"" + " IDENTIFIED BY \"null\" DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP QUOTA 25 M ON USERS ACCOUNT UNLOCK;\n";
    text += "GRANT CONNECT TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";
    text += "GRANT CREATE SESSION TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";
    text += "GRANT CREATE TABLE TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";
    text += "GRANT CREATE VIEW TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";
    text += "GRANT CREATE PROCEDURE TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";
    text += "GRANT CREATE SEQUENCE TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";
    text += "GRANT CREATE TRIGGER TO " + "\"" + $('#schema_name').val() + "\"" + ";\n";

    // enumerate all tables in the current diagram
    ArrayList.forEach(diagram.nodes, function (table) {
        text += "CREATE TABLE " + "\"" + $('#schema_name').val() + "\"" + "." + table.getText() + " (";

        // enumerate all rows of a table
        for (var r = 0; r < table.cells.rows; ++r) {
            // get text of cells in current row
            text += "" + regex(table.getCell(1, r).getText()) + " " + table.getCell(2, r).getText();
            if((table.getCell(5, r).getText()) == "NOT NULL")
                text += " NOT NULL";
            if (r < table.cells.rows - 1)
                text += ",";
        }
        text += ");\n";
    });

    // alter table Primary Key
    var flag_PK = true;
    ArrayList.forEach(diagram.nodes, function (table) {
        for (var r = 0; r < table.cells.rows; ++r) {
            if (table.getCell(3, r).getText() == "true" && flag_PK)
            {
                text += "ALTER TABLE " + "\"" + $('#schema_name').val() + "\"" + "." + table.getText() + " ADD CONSTRAINT " + table.getText() + "_PK " + "PRIMARY KEY " + "(";
                flag_PK = false;
            }
            if (table.getCell(3, r).getText() == "true" && !flag_PK)
            {
                text += regex(table.getCell(1, r).getText());
                if (isThereMoreThanOne(table, 3) > 1 && r < counterOfPrimaryAndUniqueKeys(table, 3))
                    text += ", ";
            }
        }
        if (!flag_PK) {
            text += ");\n";
            flag_PK = true;
        }
    });

    // alter table Unique Key
    var flag_UK = true;
    var iterator_numbersUK = 0;
    ArrayList.forEach(diagram.nodes, function (table) {
        for (var r = 0; r < table.cells.rows; ++r) {
            if (table.getCell(4, r).getText() == "true" && flag_UK) // sprawdz czy wiersz to unique key
            {
                text += "ALTER TABLE " + "\"" + $('#schema_name').val() + "\"" + "." + table.getText() + " ADD CONSTRAINT " + table.getText() + "_UK" + ++iterator_numbersUK + " UNIQUE " + "(";
                flag_UK = false;
            }
            if (table.getCell(4, r).getText() == "true" && !flag_UK) // sprawdz czy wiersz to unique key
            {
                text += regex(table.getCell(1, r).getText());
                if (isThereMoreThanOne(table, 4) > 1 && r < counterOfPrimaryAndUniqueKeys(table, 4))
                    text += ", ";
            }
        }
        if (!flag_UK) {
            text += ");\n";
            flag_UK = true;
        }
    });

    // alter table Foreign Key
    var iterator_numbersFK = 0;
    ArrayList.forEach(diagram.links, function (link) {
        var origin = false, destination = false;
        var tableDestination = link.getDestination();
        var tableOrigin = link.getOrigin();
        var rowDestination = link.getDestinationIndex();
        var rowOrigin = link.getOriginIndex();

        text += "ALTER TABLE " + "\"" + $('#schema_name').val() + "\"" + "." + tableOrigin.getText() + " ADD CONSTRAINT " + tableOrigin.getText() + "_FK" + ++iterator_numbersFK + " FOREIGN KEY " + "(";

        if ((tableOrigin.getCell(3, rowOrigin).getText() == "true") && (!origin)) {
            text += regex(tableOrigin.getCell(1, rowOrigin).getText());
            text = addFieldToGeneratedText(3, tableOrigin, text);
            origin = true;
        }
        else if ((tableOrigin.getCell(4, rowOrigin).getText() == "true") && (!origin)) {
            text += regex(tableOrigin.getCell(1, rowOrigin).getText());
            text = addFieldToGeneratedText(4, tableOrigin, text);
            origin = true;
        }
        else if (!origin){
            text += regex(tableOrigin.getCell(1, rowOrigin).getText());
            origin = true;
        }
        text += ")";
        text += " REFERENCES " + "\"" + $('#schema_name').val() + "\"" + "." + tableDestination.getText() + " (";
        if ((tableDestination.getCell(3, rowDestination).getText() == "true") && (!destination)) {
            text += regex(tableDestination.getCell(1, rowDestination).getText());
            text = addFieldToGeneratedText(3, tableDestination, text);
            destination = true;
        }
        if ((tableDestination.getCell(4, rowDestination).getText() == "true") && (!destination)) {
            text += regex(tableDestination.getCell(1, rowDestination).getText());
            text = addFieldToGeneratedText(4, tableDestination, text);
            destination = true;
        }
        text += ");\n";

    });

    ArrayList.forEach(diagram.links, function (link) {
        var tableDestination = link.getDestination();
        var tableOrigin = link.getOrigin();
        var rowDestination = link.getDestinationIndex();
        var rowOrigin = link.getOriginIndex();

        var i = 0;
        for (var r = 0; r < tableOrigin.cells.rows; ++r) {
            if((tableOrigin.getCell(3, r).getText() == "true") || (tableOrigin.getCell(4, r).getText() == "true")){
                if(tableOrigin.rows[r].outgoingLinks.length == 1){
                    i++;
                }
            }
        }
        if(i>1){
            for (var r = 0; r < tableOrigin.cells.rows; ++r) {
                if((tableOrigin.getCell(3, r).getText() == "true") || (tableOrigin.getCell(4, r).getText() == "true")){
                    if(tableOrigin.rows[r].outgoingLinks.length == 1){

                        tableOrigin.rows[r].outgoingLinks[0].setBaseShape('RevWithLine');
                        tableOrigin.rows[r].outgoingLinks[0].setHeadShape('OneToOne');
                    }
                }
            }
        }
    });

    return text;
}

function isThisFieldIsForeignKey(str) {
    if(str.search("🗝") > -1)
        return true;
    else
        return false;
}

function regex(text) {
    textRegex = text.match(/[A-Za-z0-9_]+/g);
    return textRegex;
}

function addFieldToGeneratedText(primaryOrUnique, table, text){
    for (var r = 0; r < table.cells.rows; ++r) {
        if ((table.getCell(primaryOrUnique, r).getText() == "true") && (table.rows[r].outgoingLinks.length == 0) && (table.rows[r].incomingLinks.length == 0)) {
            text += ", ";
            text += regex(table.getCell(1, r).getText());
        }
    }
    return text;
}

function isThereMoreThanOne(table, cell) {
    var i = 0;
    for (var r = 0; r < table.cells.rows; ++r) {
        if (table.getCell(cell, r).getText() == "true") {
            i++;
        }
    }
    return i;
}

function counterOfPrimaryAndUniqueKeys(table, cell) {
    var lastRow = 0;
    for (var r = 0; r < table.cells.rows; ++r) {
        if (table.getCell(cell, r).getText() == "true") {
            lastRow = r;
        }
    }
    return lastRow;
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
        table.resizeToFitText(false, false);
        table.columns[3].width = 0;
        table.columns[4].width = 0;
        table.columns[5].width = 0;
        table.columns[6].width = 4.9;
        table.bounds.width = table.bounds.width - 15;

        if (table.rows.length == 0) {
            table.bounds.width = 52;
            table.bounds.height = 16;
            table.updateCanvasElements();
            table.scroller.updateLocation();
        }
        table.updateCanvasElements();
        table.scroller.updateLocation();
        table.scroller.updateContent();
    }
    ArrayList.forEach(diagram.links, function (link) {
        for (var l = 0; l < diagram.links.length; ++l) {
            link.fixRowConnections();
        }
    });
    diagram.repaint();
}

function resizeToFitLinks() {
    diagram.routeAllLinks();
}

function turnOnHighlightSelected(highlightedTable, rowHighlighted) {
    selectedHighlightedRow = rowHighlighted;
    selectedHighlightedTable = highlightedTable;
    setTextToHighlighted(highlightedTable, rowHighlighted, "#00ff46", true);
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

function refreshCanvas() {
    setTimeout(function () {
        if (copyRuler.getHorizontalScaleVisible() == true) {
            copyRuler.setHorizontalScaleVisible(true);
            copyRuler.setVerticalScaleVisible(true);
        }
        diagram.repaint();
    }, 300);
}

function rowSelected() {
    $('#btnEditRow').button("option", "disabled", false);
    $('#btnDeleteRow').button("option", "disabled", false);
}

function rowDeselected() {
    $('#btnEditRow').button("option", "disabled", true);
    $('#btnDeleteRow').button("option", "disabled", true);
}

function exportAsPNG(id){
    var flag;
    if(diagram.getShowGrid()){
        diagram.setShowGrid(false);
        flag = true;
    }
    else{
        flag = false;
    }
    if($('#filenamePng').val() != "")
        document.getElementById(id).setAttribute("download", $('#filenamePng').val() +".png");
    var downloadPng = document.getElementById("downloadPng");
    var image = document.getElementById("diagram").toDataURL("image/png").replace("image/png", "image/octet-stream");
    downloadPng.setAttribute("href", image);

    if(flag)
        diagram.setShowGrid(true);
}

function exportAsJSON(id) {
    if($('#filenameJson').val() != "")
        document.getElementById(id).setAttribute("download", $('#filenameJson').val() +".txt");
    var json = diagram.toJson();
    var data = "text/plain;charset=utf-8," + encodeURIComponent(json);
    var downloadJson = document.getElementById("downloadJson");
    downloadJson.setAttribute("href", "data:" + data + "");
}

function onFileLoad() {
    var file = document.getElementById("FileReader").files[0];
    var textType = /text.*/;
    var fileDisplayArea = document.getElementById("FileContent");
    if(file.type == "text/plain"){
        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                diagram.fromJson(reader.result);
            }
            reader.readAsText(file);
            setTimeout(function () {
                generateSQL();
            }, 100);
        }
        else {
            fileDisplayArea.innerText = "File not supported!"
        }
    }
    else {
        fileDisplayArea.innerText = "File not supported!"
    }
}

function genereteDatabase(generatedSql) {
    document.getElementById("createSchemaFeedback").value = "";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = xhttp.responseText;
            var responseJSON = JSON.parse(response);
            var feedback = responseJSON.feedback;

            if(feedback != null){
                for(var r = 0; r < feedback.lista.length ; ++r){
                    document.getElementById("createSchemaFeedback").value += feedback.lista[r] + "\n";
                }
                document.getElementById("createSchemaSqlGeneratedCode").value = genereteSqlHidden();
            }
            if(feedback.updateFlag){
                document.getElementById("createSchemaFinalFeedback").value = "Schemat został pomyślnie utworzony!";
                ifOperationWasSuccessed('#createSchemaFeedback');
                ifOperationWasSuccessed('#createSchemaFinalFeedback');
                saveSchemaInDatabase($('#schema_name').val(), diagram.toJson());
            }
            else if(!feedback.updateFlag){
                document.getElementById("createSchemaFinalFeedback").value = "Nie udało się utworzyć schematu!";
                ifOperationWasNotSuccessed('#createSchemaFeedback');
                ifOperationWasNotSuccessed('#createSchemaFinalFeedback');
                dropUserIfOperationWasNotSuccessed(genereteSqlHidden().split( " ")[2]);
            }
            feedbackDialog.dialog("open");
        }
    };

    xhttp.open("POST", "/user/executeSQL", true);
    xhttp.send(genereteSqlHidden());
}

function dropUserIfOperationWasNotSuccessed(username) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    };

    xhttp.open("POST", "/user/dropUser", true);
    xhttp.send(username);
}

function saveSchemaInDatabase(schemaName, diagramJson) {
    var data = new FormData();
    data.append("schemaName", schemaName);
    data.append("diagramJson", diagramJson);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    };

    xhttp.open("POST", "/user/saveSchemaInDatabase", true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(Object.fromEntries(data)));
}

function loadFromJson(schemaERD) {
    diagram.fromJson(schemaERD);
}