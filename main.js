$(document).ready(function(){

    $(".cell").click(function(){

        if(! $(this).hasClass("set")){

            $(this).addClass("set cross");

            console.log("clicked: "+$(this).data("grid"));

            Play();
        }
    })
})

function Play(){

    var lines = [

        // vertical
        new LineObject(["0_0", "0_1", "0_2"], 0, 0),
        new LineObject(["1_0", "1_1", "1_2"], 0, 0),
        new LineObject(["2_0", "2_1", "2_2"], 0, 0),

        // horizontal
        new LineObject(["0_0", "1_0", "2_0"], 0, 0),
        new LineObject(["0_1", "1_1", "2_1"], 0, 0),
        new LineObject(["0_2", "1_2", "2_2"], 0, 0),

        // diagonal
        new LineObject(["0_0", "1_1", "2_2"], 0, 0),
        new LineObject(["0_2", "1_1", "2_0"], 0, 0)
    ];

    var stop = false;

    // setup scores for all lines
    for(var x = 0; x < lines.length; x++){

        for(var y = 0; y < (lines[x].SetSum); y++){

            var cell = lines[x].Cell(y);

            if($(cell).hasClass("cross")){

                lines[x].UserScore += 1;

            }else if($(cell).hasClass("circle")){

                lines[x].AIScore += 1;
            }
        }
    }

    // look for critical matches
    for(var x = 0; x < lines.length; x++){

        for(var y = 0; y < (lines[x].SetSum); y++){

            if(! stop){

                if(lines[x].UserScore == 3){ // USER WON

                    Result("You won!");

                    console.log("user win: "+lines[x].CellSet[y]+" ("+lines[x].CellSet[0]+" "+lines[x].CellSet[1]+" "+lines[x].CellSet[2]+")");
                    stop = true;

                }else if(lines[x].AIScore == 2){ // AI WON

                    for(z = 0; z < 3; z++){

                        var cell = lines[x].Cell(z);

                        if( ! $(cell).hasClass("set") ){

                            $(cell).addClass("set circle");

                            Result("AI won!");

                            console.log("ai win: "+lines[x].CellSet[y]+" ("+lines[x].CellSet[0]+" "+lines[x].CellSet[1]+" "+lines[x].CellSet[2]+")");
                            stop = true;
                        }
                    }
                }
            }
        }
    }

    // look for additional matches
    for(var x = 0; x < lines.length; x++){

        for(var y = 0; y < (lines[x].SetSum); y++){

            if(! stop){

                if(lines[x].UserScore == 2){ // DEFEND

                    for(z = 0; z < 3; z++){

                        var cell = lines[x].Cell(z);

                        if( ! $(cell).hasClass("set") ){

                            $(cell).addClass("set circle");
                            lines[x].AIScore += 1;

                            console.log("defend: "+lines[x].CellSet[z]);
                            stop = true;
                        }
                    }

                }else if( $(".set").length == 9){ // TIE

                    Result("It's a TIE");

                    console.log("tie");
                    stop = true;
                }
            } 
        }
    }

    // if no AI click was done, do a random one
    while(! stop){

        var lineRandom = RandomNumber(lines.length);
        var setRandom = RandomNumber(lines[lineRandom].CellSet.length);
        var gridRandom = lines[lineRandom].CellSet[setRandom];
        var cellRandom = ".cell[data-grid='"+gridRandom+"']";

        if( ! $(cellRandom).hasClass("set") ){

            $(cellRandom).addClass("set circle");
            lines[lineRandom].AIScore += 1;

            console.log("random: "+gridRandom);
            stop = true;
        }
    }

    //ScoreTroubleShooting(lines);
}

function ScoreTroubleShooting(lines){

    console.log("user: \n verti> "+lines[0].UserScore+"; "+lines[1].UserScore+"; "+lines[2].UserScore+
                     " \n horiz> "+lines[3].UserScore+"; "+lines[4].UserScore+"; "+lines[5].UserScore+
                     " \n diago> LtoR "+lines[6].UserScore+"; RtoL "+lines[7].UserScore);

    console.log("ai: \n verti> "+lines[0].AIScore+"; "+lines[1].AIScore+"; "+lines[2].AIScore+
                    "\n horiz> "+lines[3].AIScore+"; "+lines[4].AIScore+"; "+lines[5].AIScore+
                    "\n diago> LtoR "+lines[6].AIScore+"; RtoL "+lines[7].AIScore);
}


function RandomNumber(upTo){

    return Math.floor(Math.random() * upTo);
}

function Result(text){

    setTimeout(function(){
        alert(text);
        Reset();
    }, 200)
}

function Reset(){

    setTimeout(function(){

        $(".cell").removeClass("set")
            .removeClass("cross")
            .removeClass("circle")
            .text("");

    }, 800);
}


function LineObject(array, user, ai){

    this.CellSet = array;
    this.UserScore = user;
    this.AIScore = ai;

    this.SetSum = array.length;

    this.Cell = function(arrayPos){
        return ".cell[data-grid=\""+array[arrayPos]+"\"]";
    }
}