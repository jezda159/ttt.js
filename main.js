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
    for(x = 0; x < lines.length; x++){

        for(y = 0; y < (lines[x].CellSet.length); y++){

            var grid = lines[x].CellSet[y];
            var cell = ".cell[data-grid='"+grid+"']";

            if($(cell).hasClass("cross")){

                lines[x].UserScore += 1;
            
            }else if($(cell).hasClass("circle")){

                lines[x].AIScore += 1;
            }
        }
    }

    // look for critical matches
    for(x = 0; x < lines.length; x++){

        for(y = 0; y < (lines[x].CellSet.length); y++){

            if(! stop){

                if(lines[x].UserScore == 3){ // USER WON

                    setTimeout(function(){
                        alert("YOU won");
                        Reset();
                    }, 200)

                    console.log("user win: "+grid+
                        " ("+lines[x].CellSet[0]+" "+lines[x].CellSet[1]+" "+lines[x].CellSet[2]+")");
                    stop = true;

                }else if(lines[x].AIScore == 2){ // AI WON

                    for(z = 0; z < 3; z++){

                        var grid = lines[x].CellSet[z];
                        var cell = ".cell[data-grid=\""+grid+"\"]";

                        if( ! $(cell).hasClass("set") ){

                            $(cell).addClass("set circle");

                            setTimeout(function(){
                                alert("AI won");
                                Reset();
                            }, 200);

                            console.log("ai win: "+grid+
                                " ("+lines[x].CellSet[0]+" "+lines[x].CellSet[1]+" "+lines[x].CellSet[2]+")");
                            stop = true;
                        }
                    }
                }
            }
        }
    }

    // look for additional matches
    for(x = 0; x < lines.length; x++){

        for(y = 0; y < (lines[x].CellSet.length); y++){

            if(! stop){

                if(lines[x].UserScore == 2){ // DEFEND

                    for(z = 0; z < 3; z++){

                        var grid = lines[x].CellSet[z];
                        var cell = ".cell[data-grid=\""+grid+"\"]";

                        if( ! $(cell).hasClass("set") ){

                            $(cell).addClass("set circle");
                            lines[x].AIScore += 1;

                            console.log("defend: "+grid);
                            stop = true;
                        }
                    }

                }else if( $(".set").length == 9){ // TIE

                    setTimeout(function(){
                        alert("it's a TIE");
                        Reset();
                    }, 200)

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

    // SCORE TROUBLE SHOOTING
    /*console.log("user: \n | "+lines[0].UserScore+"; "+lines[1].UserScore+"; "+lines[2].UserScore+
                     " \n - "+lines[3].UserScore+"; "+lines[4].UserScore+"; "+lines[5].UserScore+
                     " \n \\ "+lines[6].UserScore+"; / "+lines[7].UserScore);
    console.log("ai: \n | "+lines[0].AIScore+"; "+lines[1].AIScore+"; "+lines[2].AIScore+
                     " \n - "+lines[3].AIScore+"; "+lines[4].AIScore+"; "+lines[5].AIScore+
                     " \n \\ "+lines[6].AIScore+"; / "+lines[7].AIScore);
    */
}

function RandomNumber(upTo){

    return Math.floor(Math.random() * upTo);
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
}