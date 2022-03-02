var cols = 25;
var rows = 25;
var w, h;
var grid = new Array(cols);

var openSet = [];
var closeSet = [];
var start, end;
var path=[];


function Spot(i, j){
    this.x = i;
    this.y = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors= [];
    this.previous = null;
    this.wall = false;

    if(random(1) <0.5){
        this.wall = true;
    }

    this.show = function(col){
        fill(col);
        if(this.wall){
            fill(0);
        }

        noStroke();
        rect(this.x*w, this.y*h, w-1, h-1);
    }

    this.addNeighbor = function(grid){
        var i = this.x;
        var j = this.y;
        
        // neighbor left
        if(i<cols-1){
            this.neighbors.push(grid[i+1][j])
        }

        // neighbor right
        if(i>0){
            this.neighbors.push(grid[i-1][j])
        }

        // neighbor bottom
        if(j<rows-1){
            this.neighbors.push(grid[i][j+1])
        }

        // neighbor top
        if(j>0){
            this.neighbors.push(grid[i][j-1])
        }

        //neighbor right-top
        if(i>0 && j>0){
            this.neighbors.push(grid[i-1][j-1])
        }

        //neighbor left-top
        if(i<cols-1 && j>0){
            this.neighbors.push(grid[i+1][j-1])
        }

        //neighbor right-bottom
        if(i>0 && j<rows-1){
            this.neighbors.push(grid[i-1][j+1])
        }

        //neighbor left-bottom
        if(i<cols-1 && j<rows-1){
            this.neighbors.push(grid[i+1][j+1])
        }
    }
}

function removeFromArray(array, element){
    for(var i = array.length - 1; i>=0; i--){
        if(array[i]==element){
            array.splice(i, 1);
        }
    }
}

function heuristic(a, b){
    var d = dist(a.i, a.j, b.i, b.j);
    // var d= abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

function setup(){
    createCanvas(400, 400);
    console.log("A*");

    w = width/cols;
    h = height/rows;

    for(var i =0; i<cols; i++){
        grid[i] = new Array(cols);
    }

    for(var i =0; i<cols; i++){
        for(var j =0; j<rows; j++){
            grid[i][j] = new Spot(i, j);
        }
    }

    for(var i =0; i<cols; i++){
        for(var j =0; j<rows; j++){
            grid[i][j].addNeighbor(grid);
        }
    }

    start = grid[0][0];
    end = grid[24][24];

    start.wall = false;
    end.wall = false;

    openSet.push(start);


    console.log(grid);
}


function draw(){

    if(openSet.length >0){

        // we can keep going
        var lowest = 0;

        for(var i =0; i<openSet.length; i++){
            if( openSet[i].f < openSet[lowest].f){
                lowest = i;
            }
        }

        var current = openSet[lowest];

        if(current === end){
            noLoop();
            console.log("Done!");
        }

        removeFromArray(openSet, current)
        closeSet.push(current);

        var neighbors = current.neighbors;
        for(var i = 0; i<neighbors.length; i++){
            var neighbor = neighbors[i];

            if(!closeSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g + 1;
                var newPath = false;

                if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g = tempG;
                        newPath = true;
                    }
                }else{
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if(newPath){
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }

    }else{
        // no solution
        console.log("No Solution");
        noLoop();
        return;
    }

    
    background(0);

    for(var i =0; i<cols; i++){
        for(var j =0; j<rows; j++){
            grid[i][j].show(color(255));
        }
    }
    
    for(var i =0; i<openSet.length; i++){
        openSet[i].show(color(0, 255, 0));
    }

    for(var i =0; i<closeSet.length; i++){
        closeSet[i].show(color(0, 0, 255));
    }

    path =[];

    var temp = current;
    path.push(temp);
    while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }

    for(var i =0; i<path.length; i++){
        path[i].show(color(0, 255, 0));
    }
    
}