// 4*4界面
var board = new Array();

// 分数
var score = 0;

var hasConflicted = new Array();


// newgame();

$(document).ready(function(){
    newgame();
});


function newgame(){
    // 初始化棋盘格
    init();
    // 随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}
function init(){
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++)
        {
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    
    for (var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++)
        {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;

    updateScore(score);
}

function updateBoardView(){

    $(".number-cell").remove();
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++)
        {
            $("#grid-container").append('<div class = "number-cell" id = "number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+"-"+j);

            if (board[i][j] == 0){
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                // 居中
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            }
            else{
                // 同grid-cell一致覆盖它
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                // 居中
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
}
function generateOneNumber(){
    if(nospace(board))
        return false;
    // 随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));// 0,1,2,3
    var randy = parseInt(Math.floor(Math.random() * 4));// 0,1,2,3


    var times = 0;
    while(times < 50){
        if(board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random() * 4));// 0,1,2,3
        randy = parseInt(Math.floor(Math.random() * 4));// 0,1,2,3

        times++;
    }

    if (times == 50)
    {
        for (var i = 0; i < 4; i++){
            for (var j = 0; j < 4; j++)
            {
                if ( board[i][j] == 0)
                {
                    randx = i;
                    randy = j;
                }
            }
        }
    }    
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2:4;  //50/50
    //显示
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    
    return true;
}
$(document).keydown(function(event){
    switch(event.keyCode){
        case 37://left
            // console.log("!!!!!");
            if(moveLeft()){
                setTimeout("generateOneNumber()",210); 
                setTimeout("isgameover()",300); 
            }
            break;
        case 38://up
            if(moveUp()){
                setTimeout("generateOneNumber()",210); 
                setTimeout("isgameover()",300); 
            }
            // isgameover();
            break;
        case 39://right
            if(moveRight()){
                setTimeout("generateOneNumber()",210); 
                setTimeout("isgameover()",300); 
            }
            // isgameover();
            break;            
        case 40://down
            if(moveDown()){
                setTimeout("generateOneNumber()",210); 
                setTimeout("isgameover()",300); 
            }
            // isgameover();
            break;
        default:
            break;
    }
});

function isgameover(){
    if ( nospace(board) && nomove(board))
    // if (nospace(board))
    // if(nomove(board))
    {
        // console.log("not Game Over!");
        gameover();
    }
}

function gameover()
{
    // console.log("Game Over!");
    alert("Game Over!");
}

function moveLeft(){
    if(!canMoveLeft(board))
    {
        return false;
    }

    for (var i = 0; i < 4; i++){
        for (var j = 1; j < 4; j++)
        //最左不需要
        {
            if (board[i][j] != 0) //存在数字
            {
                for (var k = 0; k < j; k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k])
                    {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200); 
    return true;
}


function moveUp(){
    if(!canMoveUp(board))
    {
        return false;
    }

    for (var j = 0; j < 4; j++){
        for (var i = 1; i < 4; i++)
        //最上不需要
        {
            if (board[i][j] != 0) //存在数字
            {
                for (var k = 0; k < i; k++){
                    if(board[k][j] == 0 && newnoBlockHorizontal(j,k,i,board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && newnoBlockHorizontal(j,k,i,board) && !hasConflicted[k][j])
                    {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200); 
    return true;
}


function moveRight(){
    if(!canMoveRight(board))
    {
        return false;
    }

    for (var i = 3; i >= 0; i--){
        for (var j = 2; j >= 0; j--)
        //最右不需要
        {
            if (board[i][j] != 0) //存在数字
            {
                for (var k = 3; k > j; k--){
                    if(board[i][k] == 0 && noBlockHorizontalRight(i,k,j,board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontalRight(i,k,j,board) && !hasConflicted[i][k])
                    {
                        //move
                        console.log("11");
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200); 
    return true;
}


function moveDown(){
    if(!canMoveDown(board))
    {
        return false;
    }

    for (var j = 3; j >= 0; j--){
        for (var i = 2; i >= 0; i--)
        //最下不需要
        {
            if (board[i][j] != 0) //存在数字
            {
                for (var k = 3; k > i; k--){
                    if(board[k][j] == 0 && newnoBlockHorizontalDown(j,k,i,board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && newnoBlockHorizontalDown(j,k,i,board) && !hasConflicted[k][j])
                    {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200); 
    return true;
}
