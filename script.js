let settings = {
    xCol:11,
    yCol:31,
    cellSize: 20,
    pathVisible: false
}

let maze = {
    plan: [[],[],[],[],[],[],[],[],[],[],[]]
}

let excavator = {
    stack: [],
    numSteps: 0
}

let player = {
  stack: [],
  numSteps: 0,
  position: [1,1],
  aspect: '℗'
}

let prize = {
  position: [settings.xCol-2, settings.yCol-2],
  aspect: 'X'
}

let checkpoints = {
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4:0,
    stage5: 0,
    stage6: 0,
    stage7: 0,
    stage8: 0
}

let currentView;

/*
Object for cell

{
    type: oWall / iWall / room
}
*/

function setGrid() {

    for(let i = 0; i < settings.xCol; i++) { //rows
        for (let j = 0; j < settings.yCol; j++) { //columns

            if(i === 0 || i === settings.xCol - 1) {

                maze.plan[i].push({type: 'wall'});

            } else if(i % 2 === 0) {

                maze.plan[i].push({type: 'wall'});

            } else if(j === 0 || j === settings.yCol) {

                maze.plan[i].push({type: 'wall'});

            } else if(j % 2 === 0) {

                maze.plan[i].push({type: 'wall'});

            } else {

                maze.plan[i].push({type: 'room', isExcavated: false, isWalked: false, isSolution: false});

            }

        }
    }
    
}

function printMaze() {
    for (let i = 0; i < maze.plan.length; i++) {
        let line = '';
        for (let j = 0; j < maze.plan[i].length; j++) {

            if(maze.plan[i][j].type === 'wall') {
                line = line + '█';
            } else if (maze.plan[i][j].type === 'room') {
                if (maze.plan[i][j].isExcavated === false) {
                    line = line + checkRoomEntity(i, j);
                } else if (maze.plan[i][j].isExcavated === true){
                    line = line + checkRoomEntity(i, j);
                }

            } else if (maze.plan[i][j].type === 'pathway') {
                    line = line + '□';
            }

        }
        console.log(line);
    }
}

//Checks if there is an entity in the room. Can be either player or prize
function checkRoomEntity(i, j) {
  if (i === prize.position[0] && j === prize.position[1]) {
      return prize.aspect;
  }
  if (i === player.position[0] && j === player.position[1]) {
      return player.aspect;
  }
  if (maze.plan[i][j].isWalked === true) {
    if (maze.plan[i][j].isSolution === true) {
      return 'x'
    } else {
      return 'o'
    }
  }
  return ' ';
}

function moveExcavator(arr) {

    let posX = arr[0];
    let posY = arr[1];

    maze.plan[posX][posY].isExcavated = true;

    let availableRooms = [0,0,0,0];

    //Check how many rooms are available on each move direction

    
    
    

    if (posY - 2 > 0 && maze.plan[posX][posY-2].type === 'room' && maze.plan[posX][posY-2].isExcavated === false) {
        availableRooms[0] = 1;
    }
    if(posX + 2 < maze.plan.length && maze.plan[posX+2][posY].type === 'room' && maze.plan[posX+2][posY].isExcavated === false) {
        availableRooms[1] = 1;
    }
    if(posY + 2 < maze.plan[posX].length && maze.plan[posX][posY+2].type === 'room' && maze.plan[posX][posY+2].isExcavated === false) {
        availableRooms[2] = 1;
    }
    if(posX - 2 > 0 && maze.plan[posX-2][posY].type === 'room' && maze.plan[posX-2][posY].isExcavated === false) {
        availableRooms[3] = 1;
    }    

    /**
     1 - Move Up
     2 - Move Right
     3 - Move Down
     4 - Move Left
     */

    let move = randomizer(availableRooms);

    let nextX = 0;

    let nextY = 0;

    if (move === 1) {
        nextX = 0;
        nextY = -2;
        maze.plan[posX][posY-1].type = 'room';
        maze.plan[posX][posY-1].isExcavated = true;
        maze.plan[posX][posY-1].isWalked = false;
        maze.plan[posX][posY-1].isSolution = false;
    } else if(move === 2) {
        nextX = 2;
        nextY = 0;
        maze.plan[posX+1][posY].type = 'room';
        maze.plan[posX+1][posY].isExcavated = true;
        maze.plan[posX+1][posY].isWalked = false;
        maze.plan[posX+1][posY].isSolution = false;
    } else if(move === 3) {
        nextX = 0;
        nextY = 2;
        maze.plan[posX][posY+1].type = 'room';
        maze.plan[posX][posY+1].isExcavated = true;
        maze.plan[posX][posY+1].isWalked = false;
        maze.plan[posX][posY+1].isSolution = false;
    } else if(move === 4) {
        nextX = -2;
        nextY = 0;
        maze.plan[posX-1][posY].type = 'room';
        maze.plan[posX-1][posY].isExcavated = true;
        maze.plan[posX-1][posY].isWalked = false;
        maze.plan[posX-1][posY].isSolution = false;
    }

    let totalAvailableRooms = 0;

    for (let i = 0; i < availableRooms.length; i++) {
        if (availableRooms[i] === 1) {
            totalAvailableRooms++;
        }
    }

    if (totalAvailableRooms > 4 || totalAvailableRooms < 1) {
        return [0, 0];
    } else {
        return [posX + nextX, posY + nextY];
    }

}

function movePlayer(arr) {

  let posX = arr[0];
  let posY = arr[1];

  maze.plan[posX][posY].isWalked = true;

  let availableRooms = [0,0,0,0];

  //Check how many rooms are available on each move direction    

    if ( maze.plan[posX][posY-1].type === 'room' && maze.plan[posX][posY-1].isWalked === false) {
        availableRooms[0] = 1;
    }
    if ( maze.plan[posX+1][posY].type === 'room' && maze.plan[posX+1][posY].isWalked === false) {
        availableRooms[1] = 1;
    }
    if( maze.plan[posX][posY+1].type === 'room' && maze.plan[posX][posY+1].isWalked === false) {
        availableRooms[2] = 1;
    }
    if( maze.plan[posX-1][posY].type === 'room' && maze.plan[posX-1][posY].isWalked === false) {
        availableRooms[3] = 1;
    }

    let move = randomizer(availableRooms);

    let nextX = 0;

    let nextY = 0;

    if (move === 1) {
        nextX = 0;
        nextY = -1;
    } else if(move === 2) {
        nextX = 1;
        nextY = 0;
    } else if(move === 3) {
        nextX = 0;
        nextY = 1;
    } else if(move === 4) {
        nextX = -1;
        nextY = 0;
    }

    let totalAvailableRooms = 0;

    for (let i = 0; i < availableRooms.length; i++) {
        if (availableRooms[i] === 1) {
            totalAvailableRooms++;
        }
    }

    if (totalAvailableRooms > 4 || totalAvailableRooms < 1) {
        return [0, 0];
    } else {
        return [posX + nextX, posY + nextY];
    }



}


function randomizer(arr) {
    let helper = [];

    for (let i = 0; i < arr.length; i++) {
        if(arr[i] === 1) {
            helper.push(i+1)
        }
    }

    let randomNum = helper[Math.floor(Math.random() * helper.length)];

    return randomNum;
}




function mazeGenerator() {
    // Restart excavator
    excavator.stack = [[1,1]];
    let nextMove = [];

    while (excavator.stack.length > 0) {
        nextMove = moveExcavator(excavator.stack[excavator.stack.length - 1]);

        if (nextMove[0] === 0 && nextMove[1] === 0) {
            excavator.stack.pop();
        } else {
            excavator.stack.push(nextMove);
        }

        excavator.numSteps++;

        if (excavator.numSteps > 400) {
            break;
        }
    }

}


function pathFinder() {
    player.stack = [[1,1]];
    let nextMove = [];

    while (player.stack.length > 0) {
        nextMove = movePlayer(player.stack[player.stack.length - 1]);

        if (nextMove[0] === 0 && nextMove[1] === 0) {
            player.stack.pop();
        } else if (nextMove[0] === prize.position[0] && nextMove[1] === prize.position[1]) {
            player.stack.push(nextMove);
            finalSolution();
            player.position = [1,1];
            break;
        } else {
            player.stack.push(nextMove);
        }

        player.numSteps++;

        if (player.numSteps > 800) {
            break;
        }
    }
}


function finalSolution() {

    for(let i = 0; i < player.stack.length; i++) {

        maze.plan[player.stack[i][0]][player.stack[i][1]].isSolution = true;

    }
}

function drawMaze() {

    let cx = document.getElementById("mazeCanvas").getContext("2d");

    cx.clearRect(0,0, cx.canvas.width, cx.canvas.height);

    for (let i = 0; i < settings.xCol; i++) {
        for (let j = 0; j < settings.yCol; j++) {
            
            if (maze.plan[i][j].type === 'wall') {
                cx.fillStyle = fillStyles.light_grey;
                cx.fillRect(i*settings.cellSize, j*settings.cellSize, settings.cellSize, settings.cellSize);
            }
            
            if (maze.plan[i][j].isSolution && settings.pathVisible ) {
                cx.fillStyle = fillStyles.yellow; 
                cx.fillRect(i*settings.cellSize, j*settings.cellSize, settings.cellSize, settings.cellSize);
            }   
        }
    }

    cx.fillStyle = fillStyles.pink;
    cx.fillRect(player.position[0] * settings.cellSize, player.position[1] * settings.cellSize, settings.cellSize, settings.cellSize);

}

let fillStyles = {
    beige: '#ebebe3',
    dark_grey: '#2b2b28',
    light_grey: '#cccccc',
    pink: '#FF0296',
    yellow: '#f0b917'
}

function setCheckpoints() {
    checkpoints.stage1 = Math.floor(player.stack.length * 1/8);
    checkpoints.stage2 = Math.floor(player.stack.length * 2/8);
    checkpoints.stage3 = Math.floor(player.stack.length * 3/8);
    checkpoints.stage4 = Math.floor(player.stack.length * 4/8);
    checkpoints.stage5 = Math.floor(player.stack.length * 5/8);
    checkpoints.stage6 = Math.floor(player.stack.length * 6/8);
    checkpoints.stage7 = Math.floor(player.stack.length * 7/8);
    checkpoints.stage8 = Math.floor(player.stack.length * 8/8);

    console.log(player.stack.length);
    
}


function showPath() {    
    settings.pathVisible = true;

    drawMaze();
}

document.addEventListener("keydown", event => {
    switch(event.keyCode) {
        case 37:
            // LEFT
            if (checkMove(player.position[0] - 1, player.position[1])) {
                player.position[0] -= 1;
            }
            break;
        case 38:
            // UP
            if (checkMove(player.position[0], player.position[1] - 1)) {
                player.position[1] -= 1;
            }
            break;
        case 39:
            // RIGHT
            if (checkMove(player.position[0] + 1, player.position[1])) {
                player.position[0] += 1;
            }
            break;
        case 40:
            // DOWN
            if (checkMove(player.position[0], player.position[1] + 1)) {
                player.position[1] += 1;
            }
            break;
        default:
            break;
    }
    drawMaze();
    checkStageDisplay();
});


function checkMove(x, y) {

    if (maze.plan[x][y].type === 'room') {
        return true;
    }

    return false;
}

function checkStageDisplay() {

    let stackPos = findStackIndex();    

    if (stackPos === -1) {return;}

    let trigger;

    if (stackPos <= 3) {
        trigger = document.getElementById('start');
    } else if (stackPos <= checkpoints.stage1 && stackPos > 3) {
        trigger = document.getElementById('stage1');
    } else if (stackPos <= checkpoints.stage2 && stackPos > checkpoints.stage1) {
        trigger = document.getElementById('stage2');
    } else if (stackPos <= checkpoints.stage3 && stackPos > checkpoints.stage2) {
        trigger = document.getElementById('stage3');
    } else if (stackPos <= checkpoints.stage4 && stackPos > checkpoints.stage3) {
        trigger = document.getElementById('stage4');
    } else if (stackPos <= checkpoints.stage5 && stackPos > checkpoints.stage4) {
        trigger = document.getElementById('stage5');
    } 

    transition(trigger);

}

function findStackIndex() {

    let index = 0;

    for (let i = 0; i < player.stack.length; i++) {

        if (player.stack[i][0] === player.position[0] && player.stack[i][1] === player.position[1]) {
            return index;
        }
        index++;
    }
    return -1;
}

function transition(newView) {

    if (currentView === newView) {
        return;
    }

    hide(currentView);
    window.setTimeout(function() {
        show(newView);
    }, 250)

}

function show(view) {
        // Triggers the transition from .section class
        view.classList.add('is-visible');
        view.style.opacity = 1;
        currentView = view;
}

function hide(view) {
    view.style.opacity = 0;

    window.setTimeout(function () {
        view.classList.remove('is-visible');
    }, 250)
}

function startDiv () {
    currentView = document.getElementById('start');
}

setGrid();

mazeGenerator();

pathFinder();

setCheckpoints();

drawMaze();

startDiv();
