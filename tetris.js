let canvas;           // what we will ne drawing on
let ctx;              //context
let gBArrayHeight = 20; //no of cell vertically
let gBArrayWidth = 12; //no of cells horizontally
let startX = 4; // starting x position
let startY = 0; // starting y position
let score = 0; 
let level = 1;
let winOrLose = "Playing";
let tetrisLogo;
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));  //multidimensional array for knowing positions
let curTetromino = [[1.0],[0,1],[1,1],[2,1]]; // first shape using array
let tetrominos = []; // hold all tetrominos
let tetrominoColors = ['purple','cyan','blue','yellow','orange','red'];
let curTetrominoColor;
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));  //multidimensional array to know where other squares are
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0)); //squares occupied
let DIRECTION = {
    IDLE:0,
    DOWN:1,
    LEFT:2,
    RIGHT:3
};
let direction;
class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
} //coordinates where to draw the shapes

document.addEventListener('DOMContentLoaded', SetUpCanvas);  // setupcanvas function to execute when content loaded on browser

function CreateCoordArray()//creating the coordinate array
{
    let xR = 0,yR = 19;
    let i = 0 , j = 0;
    for (let y = 9; y <= 446; y += 23){
        for(let x = 11; x <= 264; x += 23)
        {
            coordinateArray[i][j] = new Coordinates(x,y); //[0,0] X:11,Y:9//[1,0] X:34,Y:9
            i++;
        }
        j++;
        i=0;
    }
}  

function SetUpCanvas()//main canvas
{
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    // scale up to fit the screen 
    ctx.scale(1,1); 

    //background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);;

    //gameboard rectangle
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    //logo
    tetrisLogo = new Image(161,54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";

    // Set font for score label text and draw
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);
 
    // Draw score rectangle
    ctx.strokeRect(300, 107, 161, 24);
 
    // Draw score
    ctx.fillText(score.toString(), 310, 127);
    
    // Draw level label text
    ctx.fillText("LEVEL", 300, 157);
 
    // Draw level rectangle
    ctx.strokeRect(300, 171, 161, 24);
 
    // Draw level
    ctx.fillText(level.toString(), 310, 190);
 
    // Draw next label text
    ctx.fillText("WIN / LOSE", 300, 221);
 
    // Draw playing condition
    ctx.fillText(winOrLose, 310, 261);
 
    // Draw playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95);
    
    // Draw controls label text
    ctx.fillText("CONTROLS", 300, 354);
 
    // Draw controls rectangle
    ctx.strokeRect(300, 366, 161, 104);
 
    // Draw controls text
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);

    document.addEventListener('keydown', HandleKeyPress); //to handle key presses
    CreateTetrominos();//create array
    CreateTetromino();//array to hold all tetrominos
    CreateCoordArray();//reference table
    DrawTetromino();
} 

function DrawTetrisLogo()//drawing logo
{
    ctx.drawImage(tetrisLogo,300,8,161,54);
}

function DrawTetromino(){
    
    for(let i = 0; i < curTetromino.length; i++)//sqaures to be filled to create  tetromino
    {
        let x = curTetromino[i][0] + startX;//to center
        let y = curTetromino[i][1] + startY;//to top
        gameBoardArray[x][y] = 1;//add shape to gameboard
        let coorX = coordinateArray[x][y].x;//positions in reference table
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);//draw squares
    }
}

function HandleKeyPress(key)
{
    if(winOrLose != "Game Over")
    {
    // a keycode (LEFT)
    if(key.keyCode === 65)
    {
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision())
        {
            DeleteTetromino();
            startX--;
            DrawTetromino();
        } 
 
    // d keycode (RIGHT)
    } 
    else if(key.keyCode === 68)
    { 
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision())
        {
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }
 
    // s keycode (DOWN)
    } 
    else if(key.keyCode === 83)
    {
        MoveTetrominoDown();
        //e keycode rotation of Tetromino
    } 
    else if(key.keyCode === 69)
    {
        RotateTetromino();
    }
    }
}

function MoveTetrominoDown()
{
    direction = DIRECTION.DOWN;
    if(!CheckForVerticalCollision())
    {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
    
}

window.setInterval(function()
{
    if(winOrLose != "Game Over")
    {
        MoveTetrominoDown();
    }
}, 1000);//automatically makes tetrominos to fall every second

function DeleteTetromino()// change to white
{
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;//Delete Tetromino square from the gameboard array
        // Draw white where colored squares used to be
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos()//create shapes
{
    // Push T 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino()//createsthe tetrominos
{
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino]; 
}

function HittingTheWall()//stop movement when hits the wall
{
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}

function CheckForVerticalCollision()
{
    // Make a copy of the tetromino so that I can move a fake
    // Tetromino and check for collisions before I move the real
    // Tetromino
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions
    let collision = false;
 
    // Cycle through all Tetromino squares
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        let square = tetrominoCopy[i];// Get each square of the Tetromino and adjust the square // position so I can check for collisions
        let x = square[0] + startX;// Move into position based on the changing upper left// hand corner of the entire Tetromino shape
        let y = square[1] + startY;
 
        // If moving down increment y to check for a collison
        if(direction === DIRECTION.DOWN)
        {
            y++;
        }
 
        // Check if I'm going to hit a previously set piece
        if(typeof stoppedShapeArray[x][y+1] === 'string')
        {
            DeleteTetromino();// If so delete Tetromino
            startY++;// Increment to put into place and draw
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        // Check for game over and if so set game over text
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {
 
            // Add stopped Tetromino to stopped shape array
            // so I can check for future collisions
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
 
            // Check for completed rows
            CheckForCompletedRows();
 
            CreateTetromino();
 
            // Create the next Tetromino and draw it and reset direction
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
}

function CheckForHorizontalCollision()
{
    var tetrominoCopy = curTetromino;
    var collision = false;
 
    // Cycle through all Tetromino squares
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        var square = tetrominoCopy[i];// Get the square and move it into position using// the upper left hand coordinates
        var x = square[0] + startX;
        var y = square[1] + startY;
 
        // Move Tetromino clone square into position based
        // on direction moving
        if (direction == DIRECTION.LEFT)
        {
            x--;
        }
        else if (direction == DIRECTION.RIGHT)
        {
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];// Get the potential stopped square that may exist
        if (typeof stoppedShapeVal === 'string')// If it is a string we know a stopped square is there
        {
            collision=true;
            break;
        }
    }
 
    return collision;
}

function CheckForCompletedRows()
{
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for(let y=0;y<gBArrayHeight;y++) //traverse rows
    {
        let completed = true;
        for(let x=0;x<gBArrayWidth;x++)
        {
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === 'undefined'))
            {
                completed = false;
                break;
            }
        }
        if(completed)
        {
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for(let i=0;i<gBArrayWidth;i++)
            {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX ,coorY ,21,21);

            }
        }
    }
    if(rowsToDelete > 0)
    {
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = square; // Draw color into stopped

                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for(let i=0;i<tetrominoCopy.length;i++)
    {
        curTetrominoBU = [...curTetromino] // copy values but not give reference
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX,newY]);
    }
    DeleteTetromino();
    try
    {
        curTetromino = newRotation;
        DrawTetromino;
    }
    catch(e)
    {
        if(e instanceof TypeError)
        {
            curTetromino = curTetrominoBU;
            DeleteTetromino;
            DrawTetromino;
        }
    }
}

function GetLastSquareX()
{
    let lastX = 0;
    for(let i=0;i<curTetromino.length;i++)
    {
        let square = curTetromino[i]
        if(square[0] > lastX)
        {
            lastX = square[0];
        }
    }
    return lastX;
}
//1:08:30