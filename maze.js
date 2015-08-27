$(document).ready(function() {

  var walls = [];
  var mazeWidth  = 0;
  var mazeHeight = 0;
  var gridWidth  = 0;
  var gridHeight = 0;
  var algorithm = "prims"

  var BLACK  = "rgb(0, 0, 0)"
  var WHITE  = "rgb(255, 255, 255)"
  var YELLOW = "rgb(255, 255, 0)"

  generateMaze();

  function addCell(cellId){
    $("#" + cellId).css("background-color", WHITE);
  }

  function addWall(wall){
    wallId = wall.wallId;
    nextCell = wall.nextCell;
    if($("#" + nextCell).css("background-color") == BLACK){
      $("#" + wallId).css("background-color", WHITE);
      addCell(nextCell);
      addBorderWalls(nextCell);
    }
  }

  function addBorderWalls(cellId){
    var r = Math.floor(cellId / gridWidth);
    var c = cellId % gridWidth;
    if(r-1 > 0){
      walls.push({wallId: coordToId(r-1,c), nextCell: coordToId(r-2,c)});
    }
    if(r+1 < gridHeight-1){
      walls.push({wallId: coordToId(r+1,c), nextCell: coordToId(r+2, c)});
    }
    if(c-1 > 0){
      walls.push({wallId: coordToId(r,c-1), nextCell: coordToId(r, c-2)});
    }
    if(c+1 < gridWidth-1){
      walls.push({wallId: coordToId(r,c+1), nextCell: coordToId(r, c+2)});
    }
  }

  function coordToId(r, c){
    return gridWidth*r + c;
  }

  function chooseNextWallIndex(length){
    method = algorithm

    if(method == "dfs")
      return Math.max(walls.length - Math.ceil(Math.random()*4), 0);
    if(method == "prims")
      return Math.floor(Math.random()*walls.length);
    if(method == "horizontal")
      return Math.max(walls.length - Math.ceil(Math.random()*2), 0);
    if(method == "vertical")
      return Math.max(walls.length - Math.ceil(Math.random()*2) - 2, 0);
    if(method == "diagonal")
      return Math.max(walls.length - (Math.floor(Math.random()*2)*2 + 1), 0);
    if(method == "bfs")
      return Math.min(Math.floor(Math.random()*4), walls.length - 1);
  }

  function generateMaze() {
    mazeWidth  = parseInt($("#width").val());
    mazeHeight = parseInt($("#height").val());
    gridWidth  = 2*mazeWidth + 1;
    gridHeight = 2*mazeHeight + 1;
    algorithm = $("#algorithm").val();


    $("#maze").html("");
    $("#maze").css("width", (20*mazeWidth + 10));
    $("#maze").css("height", (20*mazeHeight + 10));



    for(r = 0; r < gridHeight; r++){
      $("#maze").append("<div class='row' id='row" + r + "'>\n</div>\n");
      for(c = 0; c < gridWidth; c++){
        $("#row" + r).append("<div class='cell' id='" + coordToId(r,c) + "'></div>\n");
      }
    }

    for(r = 0; r < gridHeight; r++){
      for(c = 0; c < gridWidth; c++){
        $("#" + coordToId(r,c)).css("background-color", BLACK);
      }
    }

    walls = [];

    var startingCellX = Math.floor(Math.random() * mazeHeight) * 2 + 1;
    var startingCellY = Math.floor(Math.random() * mazeWidth ) * 2 + 1;

    //console.log(startingCellX + " " + startingCellY)

    addCell(coordToId(startingCellX,startingCellY));
    addBorderWalls(coordToId(startingCellX,startingCellY));

    while(walls.length > 0){
      chosenIndex = chooseNextWallIndex(walls.length)
      var wall = walls.splice(chosenIndex, 1)[0];
      addWall(wall);
    }

    drawPath();

    // $("#" + coordToId(startingCellX,startingCellY)).css("background-color", "red");
  }

  function isEmpty(cellId){
    return $("#" + cellId).css("background-color") != BLACK
  }

  function addNeighbors(cellId, queue, parent){
    var r = Math.floor(cellId / gridWidth);
    var c = cellId % gridWidth;

    var id = coordToId(r-1,c)
    if(r-1 > 0 && isEmpty(id) && parent[id] == -1){
      queue.push(id);
      parent[id] = cellId;
    }
    id = coordToId(r+1,c)
    if(r+1 < gridHeight-1 && isEmpty(id) && parent[id] == -1){
      queue.push(id);
      parent[id] = cellId;
    }
    id = coordToId(r,c-1)
    if(c-1 > 0 && isEmpty(id) && parent[id] == -1){
      queue.push(id);
      parent[id] = cellId;
    }
    id = coordToId(r,c+1)
    if(c+1 < gridWidth-1  && isEmpty(id) && parent[id] == -1){
      queue.push(id);
      parent[id] = cellId;
    }
  }

  function drawPath(){
    startingCellId = coordToId(1, 1);
    endingCellId = coordToId(gridHeight-2, gridWidth-2);

    parent = [];
    for (r = 0; r < gridHeight; r++) {
      for(c = 0; c < gridWidth; c++) {
        parent.push(-1);
      }
    }

    queue = [];
    parent[startingCellId] = -2
    addNeighbors(startingCellId, queue, parent);

    while(queue.length > 0){
      cellId = queue.splice(0, 1)[0];
      if(cellId == endingCellId){
        break;
      }
      addNeighbors(cellId, queue, parent);
    }

    currentCellId = endingCellId;

    color = $("#path").prop("checked") ? YELLOW : WHITE;

    while(currentCellId != -2){
      $("#" + currentCellId).css("background-color", color);
      $("#" + currentCellId).css("opacity", "0.6");
      currentCellId = parent[currentCellId]
    }
  }

  $("#generate").click(generateMaze);

  $("#path").click(function() {
    drawPath();
  });

});