$(document).ready(function() {

  var walls = [];
  var mazeWidth  = 0;
  var mazeHeight = 0;
  var gridWidth  = 0;
  var gridHeight = 0;
  generateMaze();

  function addCell(cellId){
    $("#" + cellId).css("background-color", "white");
  }


  function addWall(wall){
    wallId = wall.wallId;
    nextCell = wall.nextCell;
    if($("#" + nextCell).css("background-color") == "rgb(0, 0, 0)"){
      $("#" + wallId).css("background-color", "white");
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
    if(c-1 > 0){
      walls.push({wallId: coordToId(r,c-1), nextCell: coordToId(r, c-2)});
    }
    if(r+1 < gridHeight-1){
      walls.push({wallId: coordToId(r+1,c), nextCell: coordToId(r+2, c)});
    }
    if(c+1 < gridWidth-1){
      walls.push({wallId: coordToId(r,c+1), nextCell: coordToId(r, c+2)});
    }
  }

  function coordToId(r, c){
    return gridWidth*r + c;
  }

  function generateMaze() {
    mazeWidth  = parseInt($("#width").val());
    mazeHeight = parseInt($("#height").val());
    gridWidth  = 2*mazeWidth + 1;
    gridHeight = 2*mazeHeight + 1;


    $("#maze").html("");
    console.log($("#maze").html());
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
        $("#" + coordToId(r,c)).css("background-color", "black");
      }
    }

    walls = [];
    addCell(coordToId(1,1));
    addBorderWalls(coordToId(1,1));

    while(walls.length > 0){
      var wall = walls.splice(Math.floor(Math.random()*walls.length), 1)[0];
      addWall(wall);
    }
  }

  $("#generate").click(generateMaze);
});