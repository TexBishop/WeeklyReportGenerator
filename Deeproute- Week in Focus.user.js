// ==UserScript==
// @author       Tex Bishop
// @name         Deeproute: Week in Focus
// @version      0.1
// @namespace    DeepRoute
// @include      http://deeproute.com/?js=weekbyweek*
// @include      http://www.deeproute.com/?js=weekbyweek*
// @include      http://deeproute.com/default.asp?js=weekbyweek*
// @include      http://www.deeproute.com/default.asp?js=weekbyweek*
// @grant		 GM_xmlhttpRequest
// @connect	     deeproute.com
// @connect	     yomomma.info
// @description  Parse week's box scores and create report.
// ==/UserScript==

'use strict';

//==================================================================
// Generate a random integer between min and max (inclusive).
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           The generated integer
//==================================================================
function getRndInteger(min, max)
{
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//==================================================================
// Fetch a random mama joke from http://api.yomomma.info/
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           The joke.
//==================================================================
GM_xmlhttpRequest ( {
    method:         "GET",
    url:            "http://api.yomomma.info/",
    responseType:   "json",
    synchronous:    true,
    onload:         function(rspObj){
        var jokeObject = rspObj.response;
        getMamaJoke.joke = jokeObject.joke;
    }
} );
function getMamaJoke()
{
    return getMamaJoke.joke;
}

//==================================================================
// Fetch a random miscellaneous joke from https://sv443.net
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           The joke.
//==================================================================
function getJoke()
{
    var jokeText, jokeObject, jokeSetup, jokeDelivery;
    var request = new XMLHttpRequest();
    request.open("GET", "https://sv443.net/jokeapi/category/miscellaneous?blacklistFlags=", false);
    request.send(null);
    if (request.status === 200){
       jokeObject = JSON.parse(request.responseText);}

    if (jokeObject.type === "single")
    {
        jokeText = jokeObject.joke;
        jokeText = jokeText.replace(/(\n\n|\n)/gm, "\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ...\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ");
    }
    else
    {
        jokeSetup = jokeObject.setup;
        jokeSetup = jokeSetup.replace(/(\n\n|\n)/gm, "\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ...\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ");

        jokeDelivery = jokeObject.delivery;
        jokeDelivery = jokeDelivery.replace(/(\n\n|\n)/gm, "\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ...\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ");

        jokeText = jokeSetup + "\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ...\n[COLOR=green][B]LANDIS[/B][/COLOR]:    " + jokeDelivery;
    }

    return jokeText;
}

//==================================================================
// Fetch a random dad joke from https://icanhazdadjoke.com/
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           The joke.
//==================================================================
function getDadJoke()
{
    var dadJoke;
    var request = new XMLHttpRequest();
    request.open("GET", "https://icanhazdadjoke.com/", false);
    request.setRequestHeader("Accept", "text/plain");
    request.send(null);
    if (request.status === 200){
        dadJoke = request.responseText;}

    // Handle newlines built into the joke
    dadJoke = dadJoke.replace(/(\n\n|\n)/gm, "\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ...\n[COLOR=green][B]LANDIS[/B][/COLOR]:    ");

    return dadJoke;
}

//==================================================================
// Fetch a random response to Landis' lame jokes.
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           Funk's response.
//==================================================================
function funkResponse()
{
    var response = ["... you're so lame dude.",
                    "*rolls eyes*",
                    "... dude, you older than dirt.",
                    "... I think you and my grandpa might get along.",
                    "... that's lamer than those ducks you used to throw me.",
                    "... the ancient history museum called.  They want their joke back.",
                    "*facepalm* ... dude.",
                    "... I thought we were friends, dude.  Why you do this to me?",
                    "*double facepalm* ... just go away.  Please.",
                    "... ladies and gentlemen, presenting the Mayor of Lamesville, James Lame-dis."];
    var choice = getRndInteger(0, response.length - 1);
    return response[choice];
}

//==================================================================
// Fetch a random response to Landis' lame jokes.
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           Funk's response.
//==================================================================
function landisResponse()
{
    var response = ["Now, well, that's just inappropriate.",
                    "I'll have you know my mother is a fine woman, sir!",
                    "But my mother isn't that fat.  She diets regularly.  I don't get it.",
                    "What do you have against my mother?  She sent you those brownies!",
                    "Mother may love her bon-bons, but she isn't THAT big!  How dare you?",
                    "That doesn't sound terribly feasible.",
                    "But isn't your mother bigger than mine?  Pot calling the kettle black."];
    var choice = getRndInteger(0, response.length - 1);
    return response[choice];
}

//==================================================================
// Global variables:  Used to store compiled statistics by player.
// These arrays hold objects representing players.
//==================================================================
var offense = [];
var defense = [];
var specialTeams = [];

// Variables used for players chosen to be in report
var chosenPassing;
var chosenRushing;
var chosenReceiving;
var chosenDual;
var chosenDefense;
var chosenSpecialTeams;

// Seasonal info.  Flips to true, if this is run on week All, without a full complement of games.
var partial = false;
var weeksParsed = 0;

//==================================================================
// Global variables:  Used to store parsing results, one for each
// category / section being parsed.
//==================================================================
var passing = [];
var rushing = [];
var receiving = [];
var twoPoints = [];
var fumbles = [];
var tackles = [];
var passD = [];
var kicking = [];
var punting = [];
var kReturns = [];
var pReturns = [];

//==================================================================
// Compare and choose which players to include in the report.
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           nothing
//==================================================================
function choosePlayers()
{
    //================================================
    // Compare and choose offensive players
    //================================================
    var topPassing = -1, secondPassing = -1, bumPassing = -1;
    var topRushing = -1, secondRushing = -1, bumRushing = -1;
    var topReceiving = -1, secondReceiving = -1, bumReceiving = -1;
    var topDual = -1;

    for (let i = 0; i < offense.length; i++)
    {
        // Evaluate dual score
        if (topDual === -1)
        {
            if (offense[i].dualScore > 0){
                topDual = i;}
        }
        else
        {
            if (offense[topDual].dualScore < offense[i].dualScore){
                topDual = i;}
        }

        // Evaluate passing score
        if (topPassing === -1)
        {
            topPassing = i;
        }
        else
        {
            if (secondPassing === -1)
            {
                secondPassing = i;
                if (offense[topPassing].passingScore < offense[secondPassing].passingScore){
                    [topPassing, secondPassing] = [secondPassing, topPassing];}
            }
            else if (offense[secondPassing].passingScore < offense[i].passingScore)
            {
                secondPassing = i;
                if (offense[topPassing].passingScore < offense[secondPassing].passingScore){
                    [topPassing, secondPassing] = [secondPassing, topPassing];}
            }
        }
        if (bumPassing === -1)
        {
            if (offense[i].position === "QB"){
                bumPassing = i;}
        }
        else if (offense[bumPassing].passingScore > offense[i].passingScore && offense[i].position === "QB")
        {
            if (document.getElementById('imonweek').getAttribute("value") != "All"){
                bumPassing = i;}
            else if (offense[i].passingArray[1] > weeksParsed * 5){
                bumPassing = i;}
        }

        // Evaluate rushing score.  Do not replicate the topDual player.
        if (topRushing === -1)
        {
            topRushing = i;
        }
        else
        {
            if (secondRushing === -1)
            {
                secondRushing = i;
                if (offense[topRushing].rushingScore < offense[secondRushing].rushingScore){
                    [topRushing, secondRushing] = [secondRushing, topRushing];}
            }
            else if (offense[secondRushing].rushingScore < offense[i].rushingScore && topDual != i)
            {
                secondRushing = i;
                if (offense[topRushing].rushingScore < offense[secondRushing].rushingScore){
                    [topRushing, secondRushing] = [secondRushing, topRushing];}
            }
        }
        if (bumRushing === -1)
        {
            if (offense[i].position === "RB" || offense[i].position === "FB"){
                bumRushing = i;}
        }
        else if (offense[bumRushing].rushingScore > offense[i].rushingScore && (offense[i].position === "HB" || offense[i].position === "FB"))
        {
            if (document.getElementById('imonweek').getAttribute("value") != "All"){
                bumRushing = i;}
            else if (offense[i].rushingArray[0] > weeksParsed * 3){
                bumRushing = i;}
        }

        // Evaluate receiving score.  Do not replicate the topDual player.
        if (topReceiving === -1)
        {
            topReceiving = i;
        }
        else
        {
            if (secondReceiving === -1)
            {
                secondReceiving = i;
                if (offense[topReceiving].receivingScore < offense[secondReceiving].receivingScore){
                    [topReceiving, secondReceiving] = [secondReceiving, topReceiving];}
            }
            else if (offense[secondReceiving].receivingScore < offense[i].receivingScore && topDual != i)
            {
                secondReceiving = i;
                if (offense[topReceiving].receivingScore < offense[secondReceiving].receivingScore){
                    [topReceiving, secondReceiving] = [secondReceiving, topReceiving];}
            }
        }
        if (bumReceiving === -1)
        {
            if (offense[i].position === "WR"){
                bumReceiving = i;}
        }
        else if (offense[bumReceiving].receivingScore > offense[i].receivingScore && offense[i].position === "WR")
        {
            if (document.getElementById('imonweek').getAttribute("value") != "All"){
                bumReceiving = i;}
            else if (offense[i].receivingArray[1] > weeksParsed * 3){
                bumReceiving = i;}
        }
    }

    // Assign chosen offensive players to the pertinent global variables
    chosenPassing = {top: offense[topPassing], second: offense[secondPassing], bum: offense[bumPassing]};
    chosenRushing = {top: offense[topRushing], second: offense[secondRushing], bum: offense[bumRushing]};
    chosenReceiving = {top: offense[topReceiving], second: offense[secondReceiving], bum: offense[bumReceiving]};
    if (topDual === -1){
        chosenDual = {top: "undefined"};}
    else{
        chosenDual = {top: offense[topDual]};}

    //================================================
    // Compare and choose defensive players
    //================================================
    var topDefense = -1, secondDefense = -1, thirdDefense = -1, fourthDefense = -1, bumDefense = -1;
    for (let i = 0; i < defense.length; i++)
    {
        if (topDefense === -1){
            topDefense = i;}
        else if (secondDefense === -1)
        {
            secondDefense = i;
            if (defense[topDefense].score < defense[secondDefense].score)
            {
                [topDefense, secondDefense] = [secondDefense, topDefense];
            }
        }
        else if (thirdDefense === -1)
        {
            thirdDefense = i;
            if (defense[secondDefense].score < defense[thirdDefense].score)
            {
                [secondDefense, thirdDefense] = [thirdDefense, secondDefense];
                if (defense[topDefense].score < defense[secondDefense].score)
                {
                    [topDefense, secondDefense] = [secondDefense, topDefense];
                }
            }
        }
        else if (fourthDefense === -1)
        {
            fourthDefense = i;
            if (defense[thirdDefense].score < defense[fourthDefense].score)
            {
                [thirdDefense, fourthDefense] = [fourthDefense, thirdDefense];
                 if (defense[secondDefense].score < defense[thirdDefense].score)
                 {
                     [secondDefense, thirdDefense] = [thirdDefense, secondDefense];
                     if (defense[topDefense].score < defense[secondDefense].score)
                     {
                         [topDefense, secondDefense] = [secondDefense, topDefense];
                     }
                 }
            }
        }
        else if (defense[fourthDefense].score < defense[i].score)
        {
            fourthDefense = i;
            if (defense[thirdDefense].score < defense[fourthDefense].score)
            {
                [thirdDefense, fourthDefense] = [fourthDefense, thirdDefense];
                 if (defense[secondDefense].score < defense[thirdDefense].score)
                 {
                     [secondDefense, thirdDefense] = [thirdDefense, secondDefense];
                     if (defense[topDefense].score < defense[secondDefense].score)
                     {
                         [topDefense, secondDefense] = [secondDefense, topDefense];
                     }
                 }
            }
        }

        if (bumDefense === -1)
        {
            bumDefense = i;
        }
        else if (defense[bumDefense].score > defense[i].score){
            bumDefense = i;}
    }

    // Assign chosen defensive players to the global variable
    chosenDefense = {top: defense[topDefense],
                     second: defense[secondDefense],
                     third: defense[thirdDefense],
                     fourth: defense[fourthDefense],
                     bum: defense[bumDefense]};

    //================================================
    // Compare and choose special teams players
    //================================================
    var topSpecial = -1, bumSpecial = -1;
    for (let i = 0; i < specialTeams.length; i++)
    {
        if (topSpecial === -1){
            topSpecial = i;}
        else if (specialTeams[topSpecial].score < specialTeams[i].score){
            topSpecial = i;}

        if (bumSpecial === -1){
            bumSpecial = i;}
        else if (specialTeams[bumSpecial].score > specialTeams[i].score){
            bumSpecial = i;}
    }

    // Assign chosen defensive players to the global variable
    chosenSpecialTeams = {top: specialTeams[topSpecial], bum: specialTeams[bumSpecial]};
}

//==================================================================
// Determine if a player is already in the given array.
//
// Parameters
// ----------------
// category           The given array to check.
// player             The name of the player to search for.
//
// ----------------
// Returns:           The position in the array, if found.
//                    Otherwise, returns -1;
//==================================================================
function findPlayer(category, playerLink)
{
    for (let i = 0; i < category.length; i++)
    {
        if (category[i].link === playerLink){
            return i;}
    }

    // Player not found, return error code
    return -1;
}

//==================================================================
// Create a new offensive player object in the offense array.
//
// Parameters
// ----------------
// dataSet            The array containing the data being used for
//                    this player.  Used for name and page link.
//
// ----------------
// Returns:           The index number the new player is stored in.
//==================================================================
function initializeOffensivePlayer(dataSet)
{
    var passingData, rushingData, receivingData, twoPointData, fumbleData;

    var index = offense.length;
    passingData = [0, 0, 0, 0, 0, 0, 0];
    rushingData = [0, 0, 0, 0, 0];
    receivingData = [0, 0, 0, 0, 0, 0];
    twoPointData = [0, 0, 0];
    fumbleData = [0, 0, 0, 0, 0, 0];
    offense[index] = {
        link: dataSet[0],
        name: dataSet[1],
        position: dataSet[2],
        gameLink: dataSet[3],
        vsInfo: dataSet[4],
        teamName: dataSet[5],
        passingArray: passingData,
        rushingArray: rushingData,
        receivingArray: receivingData,
        twoPointArray: twoPointData,
        fumbleArray: fumbleData,
        passingScore: 0,
        rushingScore: 0,
        receivingScore: 0,
        dualScore: 0,
        twoPointScore: 0,
        fumbleScore: 0
    };

    return index;
}

//==================================================================
// Create a new defensive player object in the defense array.
//
// Parameters
// ----------------
// dataSet            The array containing the data being used for
//                    this player.  Used for name and page link.
//
// ----------------
// Returns:           The index number the new player is stored in.
//==================================================================
function initializeDefensivePlayer(dataSet)
{
    var tackleData, passDData, fumbleData;

    var index = defense.length;
    tackleData = [0, 0, 0, 0, 0];
    passDData = [0, 0, 0, 0, 0];
    fumbleData = [0, 0, 0, 0, 0, 0];
    defense[index] = {
        link: dataSet[0],
        name: dataSet[1],
        position: dataSet[2],
        gameLink: dataSet[3],
        vsInfo: dataSet[4],
        teamName: dataSet[5],
        tackleArray: tackleData,
        passDArray: passDData,
        fumbleArray: fumbleData,
        score: 0
    };

    return index;
}

//==================================================================
// Create a new special teams player object in the specialTeams array.
//
// Parameters
// ----------------
// dataSet            The array containing the data being used for
//                    this player.  Used for name and page link.
//
// ----------------
// Returns:           The index number the new player is stored in.
//==================================================================
function initializeSpecialTeamsPlayer(dataSet)
{
    var kickingData, puntingData, kReturnData, pReturnData;

    var index = specialTeams.length;
    kickingData = [0, 0, 0, 0];
    puntingData = [0, 0, 0, 0, 0];
    kReturnData = [0, 0, 0, 0];
    pReturnData = [0, 0, 0, 0, 0];
    specialTeams[index] = {
        link: dataSet[0],
        name: dataSet[1],
        position: dataSet[2],
        gameLink: dataSet[3],
        vsInfo: dataSet[4],
        teamName: dataSet[5],
        kickingArray: kickingData,
        puntingArray: puntingData,
        kReturnArray: kReturnData,
        pReturnArray: pReturnData,
        score: 0
    };

    return index;
}

//==================================================================
// Compile offensive data by player, and store in the offense array.
//
// Parameters
// ----------------
// category           A text representation of data category.
// dataSet            The array containing the data to compile.
//
// ----------------
// Returns:           nothing
//==================================================================
function buildOffense(category, dataSet)
{
    var data, index;
    for (let i = 0; i < dataSet.length; i++)
    {
        data = dataSet[i].slice(6);
        index = findPlayer(offense, dataSet[i][0]);
        if (index < 0){
            index = initializeOffensivePlayer(dataSet[i]);}

        switch(category)
        {
            case "passing":
                for (let i = 0; i < data.length; i++){
                    offense[index].passingArray[i] += data[i];}
                break;
            case "rushing":
                for (let i = 0; i < data.length; i++){
                    offense[index].rushingArray[i] += data[i];}
                break;
            case "receiving":
                for (let i = 0; i < data.length; i++){
                    offense[index].receivingArray[i] += data[i];}
                break;
            case "twoPoints":
                for (let i = 0; i < data.length; i++){
                    offense[index].twoPointArray[i] += data[i];}
                break;
            case "fumbles":
                for (let i = 0; i < data.length; i++){
                    offense[index].fumbleArray[i] += data[i];}
                break;
        }
    }
}

//==================================================================
// Compile defensive data by player, and store in the defense array.
//
// Parameters
// ----------------
// category           A text representation of data category.
// dataSet            The array containing the data to compile.
//
// ----------------
// Returns:           nothing
//==================================================================
function buildDefense(category, dataSet)
{
    var data, index;
    for (let i = 0; i < dataSet.length; i++)
    {
        data = dataSet[i].slice(6);
        index = findPlayer(defense, dataSet[i][0]);
        if (index < 0){
            index = initializeDefensivePlayer(dataSet[i]);}

        switch(category)
        {
            case "tackles":
                for (let i = 0; i < data.length; i++){
                    defense[index].tackleArray[i] += data[i];}
                break;
            case "passD":
                for (let i = 0; i < data.length; i++){
                    defense[index].passDArray[i] += data[i];}
                break;
            case "fumbles":
                for (let i = 0; i < data.length; i++){
                    defense[index].fumbleArray[i] += data[i];}
                break;
        }
    }
}

//==================================================================
// Compile special teams data by player, and store in the
// specialTeams array.
//
// Parameters
// ----------------
// category           A text representation of data category.
// dataSet            The array containing the data to compile.
//
// ----------------
// Returns:           nothing
//==================================================================
function buildSpecialTeams(category, dataSet)
{
    var data, index;
    for (let i = 0; i < dataSet.length; i++)
    {
        data = dataSet[i].slice(6);
        index = findPlayer(specialTeams, dataSet[i][0]);
        if (index < 0){
            index = initializeSpecialTeamsPlayer(dataSet[i]);}

        switch(category)
        {
            case "kicking":
                for (let i = 0; i < data.length; i++){
                    specialTeams[index].kickingArray[i] += data[i];}
                break;
            case "punting":
                for (let i = 0; i < data.length; i++){
                    specialTeams[index].puntingArray[i] += data[i];}
                break;
            case "kick returns":
                for (let i = 0; i < data.length; i++)
                {
                    if (i < data.length - 1){
                        specialTeams[index].kReturnArray[i] += data[i];}
                    else
                    {
                        if (specialTeams[index].kReturnArray[i] < data[i]){
                            specialTeams[index].kReturnArray[i] = data[i]}
                    }
                }
                break;
            case "punt returns":
                for (let i = 0; i < data.length; i++)
                {
                    if (i < data.length - 1){
                        specialTeams[index].pReturnArray[i] += data[i];}
                    else
                    {
                        if (specialTeams[index].pReturnArray[i] < data[i]){
                            specialTeams[index].pReturnArray[i] = data[i]}
                    }
                }
                break;
        }
    }
}

//==================================================================
// Calculate offensive scores for the given player.
// Scores are divided into passing, receiving, rushing, and
// dual threat, since we need to choose players to highligh from
// each of those categories.
//
// Parameters
// ----------------
// data               The player record to calculate from.
//
// ----------------
// Returns:           An object holding all four calculated scores.
//==================================================================
function calculateOffensiveScore(data)
{
    var passingScore = 0, rushingScore = 0, receivingScore = 0, twoPointScore = 0, fumbleScore = 0, dualScore = 0;

    //================================================
    // Calculate score from passing data
    //================================================
    if (data.passingArray[1] != 0)
    {
        var ydsPerCmp = 0;
        if (data.passingArray[0] != 0){
            ydsPerCmp = data.passingArray[2] / data.passingArray[0];}

        var ydsPerAtm = 0, tdsPerAtm = 0, intsPerAtm = 0;
        if (data.passingArray[1] != 0)
        {
            ydsPerAtm = data.passingArray[2] / data.passingArray[1];
            tdsPerAtm = data.passingArray[3] / data.passingArray[1];
            intsPerAtm = data.passingArray[4] / data.passingArray[1];
        }

        var cmpPercent = data.passingArray[0] / data.passingArray[1];
        var passerRating = ((cmpPercent - 0.3)*5 + (ydsPerAtm - 3)*0.25 + tdsPerAtm*20 + (2.375 - intsPerAtm*25))/6 * 100;
        //passingScore += ((ydsPerCmp - 9) + (cmpPercent*100 - 55)/5) * (data.passingArray[1] / 15);
        passingScore += (passerRating - 80) / 10 * Math.floor(data.passingArray[1] / 10);
        passingScore += data.passingArray[3] * 6;//  Touchdowns
        passingScore += data.passingArray[2] / 25;// Yards
        passingScore -= data.passingArray[4] * 3;//  Interceptions
        passingScore -= data.passingArray[5];//      Sacks
    }

    //================================================
    // Calculate score from rushing data
    //================================================
    if (data.rushingArray[0] != 0)
    {
        var ydsPerCry = data.rushingArray[1] / data.rushingArray[0];
        rushingScore += (ydsPerCry - 4) * Math.floor(data.rushingArray[0]/4);
        rushingScore += data.rushingArray[1] / 10;// Yards
        rushingScore += data.rushingArray[2] * 6;//  Touchdowns
    }

    //================================================
    // Calculate score from receiving data
    //================================================
    if (data.receivingArray[1] != 0)
    {
        var ydsPerCatch = 5;//  Base number to use, in case of zero completions
        if (data.receivingArray[0] != 0 && data.receivingArray[3] > 0){
            ydsPerCatch = data.receivingArray[3] / data.receivingArray[0];}

        var catchPercent = data.receivingArray[0] / data.receivingArray[1] * 100;
        var base = Math.floor((catchPercent - 50)/25);
        var adjustor = (base >= 0) ? base * (ydsPerCatch / 10) : base / (ydsPerCatch / 10);
        receivingScore += adjustor * Math.floor(data.receivingArray[1] / 3);
        receivingScore += data.receivingArray[3] / 10;//  Yards
        receivingScore += data.receivingArray[5] * 6;//   Touchdowns
    }

    //================================================
    // Calculate scores for two point converions and
    // penalty for fumbles.
    //================================================
    twoPointScore += data.twoPointArray[0] * 2 + data.twoPointArray[2] * 2;
    fumbleScore += (data.fumbleArray[0] + (data.fumbleArray[1] * 2)) * -1;

    //================================================
    // Combine the scores as appropriate, to get the
    // four scores that we need.  A player must
    // have at least an 8 in both rushing and receiving
    // to qualify as a dual threat.  If a player has
    // no touches in a category, keep the value at 0.
    //================================================
    if (data.rushingArray[0] != 0){
        rushingScore += twoPointScore + fumbleScore;}
    if (data.passingArray[1] != 0){
        passingScore += twoPointScore + fumbleScore + ((rushingScore > 0) ? rushingScore : 0);}
    if (data.receivingArray[1] != 0){
        receivingScore += twoPointScore + fumbleScore;}

    if (document.getElementById('imonweek').getAttribute("value") != "All")
    {
        if (rushingScore > 8 && receivingScore > 8){
            dualScore += rushingScore + receivingScore + twoPointScore + fumbleScore;}
    }
    else
    {
        if (rushingScore > 6 + (2 * weeksParsed) && receivingScore > 6 + (2 * weeksParsed)){
            dualScore += rushingScore + receivingScore + twoPointScore + fumbleScore;}
    }

    //================================================
    // Return an object holding all four calculated scores
    //================================================
    return {pass: passingScore, rush: rushingScore, receive: receivingScore, dual: dualScore, two: (data.fumbleArray[0] + (data.fumbleArray[1] * 2)), fumble: fumbleScore};
}

//==================================================================
// Calculate a defensive score for the given player.
//
// Parameters
// ----------------
// data               The player record to calculate from.
//
// ----------------
// Returns:           The calculated score.
//==================================================================
function calculateDefensiveScore(data)
{
    var tackleScore = 0, passDScore = 0, fumbleScore = 0;

    // Give cornerbacks points for tackle ratio instead of tackles
    if (data.position != "CB"){
        tackleScore += data.tackleArray[0] * 0.35;}// Tackles for non-CBs
    else
    {
        var tackleRatio = 0;
        if (data.tackleArray[0] != 0)
        {
            tackleRatio = (data.passDArray[0] - data.tackleArray[0]) / 2;
        }
        tackleScore += tackleRatio;
    }

    tackleScore += data.tackleArray[2] * 2;//     Tackles for loss
    tackleScore += data.tackleArray[3] * 3;//     Sacks
    tackleScore -= data.tackleArray[1] * 2;//     Missed tackles

    passDScore += data.passDArray[0] * 0.25;//    Good coverages
    passDScore += data.passDArray[1] * 1;//       Passes defended
    passDScore += data.passDArray[2] * 4;//       Interceptions
    passDScore += data.passDArray[4] * 6;//       Interception return TD

    fumbleScore += data.fumbleArray[2] * 1;//     Forced fumble
    fumbleScore += data.fumbleArray[3] * 2;//     Fumble recovery
    fumbleScore += data.fumbleArray[5] * 6;//     Fumble return TD

    return tackleScore + passDScore + fumbleScore;
}

//==================================================================
// Calculate a special teams score for the given player.
//
// Parameters
// ----------------
// data               The player record to calculate from.
//
// ----------------
// Returns:           The calculated score.
//==================================================================
function calculateSpecialTeamsScore(data)
{
    var kickingScore = 0, puntingScore = 0, kReturnScore = 0, pReturnScore = 0;

    var missedFGs = data.kickingArray[1] - data.kickingArray[0];
    var missedEPs = data.kickingArray[3] - data.kickingArray[2];
    kickingScore += data.kickingArray[0] * 3;//   Field goals made
    kickingScore += data.kickingArray[2] * 0.5;// Extra points made
    kickingScore -= missedFGs * 6;
    kickingScore -= missedEPs * 2;

    if (data.puntingArray[0] != 0)
    {
        var pAverage = data.puntingArray[2] / data.puntingArray[0];
        puntingScore += (data.puntingArray[0] / 5) * ((pAverage - 40 >= 0) ? (pAverage - 40) : 0);
        puntingScore -= data.puntingArray[4] * 3;// Blocked punts
    }

    pReturnScore += data.kReturnArray[1] / 20;//   Yards
    kReturnScore += data.kReturnArray[2] * 15 + ((data.kReturnArray[2] - 1 > 0) ? (data.kReturnArray[2] - 1) * 5 : 0);//   Return TD

    pReturnScore += data.pReturnArray[2] / 20;//   Yards
    pReturnScore += data.pReturnArray[3] * 15 + ((data.pReturnArray[3] - 1 > 0) ? (data.pReturnArray[3] - 1) * 5 : 0);//   Return TD

    var score = kickingScore + puntingScore + kReturnScore + pReturnScore;
    if (kickingScore > 0 && puntingScore > 0){
        score = (kickingScore + puntingScore) * 0.7 + kReturnScore + pReturnScore;}
    return score;
}

//==================================================================
// Compile stats by player, and calculate their scores.
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           nothing
//==================================================================
function calculatePlayerScores()
{
    //================================================
    // Transfer and compile offensive statistics by
    // player in the offense array.
    //================================================
    buildOffense("passing", passing);
    buildOffense("rushing", rushing);
    buildOffense("receiving", receiving);
    buildOffense("twoPoints", twoPoints);
    buildOffense("fumbles", fumbles);

    //================================================
    // Transfer and compile defensive statistics by
    // player in the defense array.
    //================================================
    buildDefense("tackles", tackles);
    buildDefense("passD", passD);
    buildDefense("fumbles", fumbles);

    //================================================
    // Transfer and compile special teams statistics by
    // player in the specialTeams array.
    //================================================
    buildSpecialTeams("kicking", kicking);
    buildSpecialTeams("punting", punting);
    buildSpecialTeams("kick returns", kReturns);
    buildSpecialTeams("punt returns", pReturns);

    //================================================
    // Calculate offensive scores
    //================================================
    for (let i = 0; i < offense.length; i++)
    {
        let scoreBox = calculateOffensiveScore(offense[i]);
        offense[i].passingScore = scoreBox.pass;
        offense[i].rushingScore = scoreBox.rush;
        offense[i].receivingScore = scoreBox.receive;
        offense[i].dualScore = scoreBox.dual;
        offense[i].twoPointScore = scoreBox.two;
        offense[i].fumbleScore = scoreBox.fumble;
    }

    //================================================
    // Calculate defensive scores
    //================================================
    for (let i = 0; i < defense.length; i++)
    {
        defense[i].score = calculateDefensiveScore(defense[i]);
    }

    //================================================
    // Calculate special teams scores
    //================================================
    for (let i = 0; i < specialTeams.length; i++)
    {
        specialTeams[i].score = calculateSpecialTeamsScore(specialTeams[i]);
    }
}

//==================================================================
// Parses a given box score to find the position for a given player.
//
// Parameters
// ----------------
// boxText            The html of the given box score page.
// playerID           The unique 5 digits that identify the player.
//
// ----------------
// Returns:           The player's position.
//==================================================================
function parsePosition(boxText, playerId)
{
    var positionHolder = "ST";
    var endIndex = 0;
    var endSection = boxText.indexOf("playstat5", 0);
    var getPosition = function(position)
    {
        if (position.includes("WR")){
            position = "WR";}
        else if (position.includes("TE")){
            position = "TE";}
        else if (position.includes("LB")){
            position = "LB";}
        else if (position.includes("DE")){
            position = "DE";}
        else if (position.includes("DT") || position === "NT"){
            position = "DT";}
        else if (position === "C1" || position === "C2" || position === "N1" || position === "N2" || position === "N3" || position === "N4"){
            position = "CB";}
        else if (position != "QB" &&
                 position != "HB" &&
                 position != "FB" &&
                 position != "SS" &&
                 position != "FS"){
            position = "ST";}
        return position;
    }
    do
    {
        //================================================
        // This do while loop is meant to handle cases
        // where the first snap played by a player is on
        // special teams, such as a returner.  Without this
        // loop, that player gets tagged as ST, instead of
        // his regular position, if he plays one.
        //------------------------------------------------
        // Also, added a check where it tries to find three
        // references in a row at the same position.
        // This should reduce cases where a player is
        // tagged incorrectly due to the first snap being
        // out of his natural position.  If a three in a
        // row match is not found, it will use whatever
        // the final value of position was.
        //================================================
        var index = boxText.indexOf(playerId, endIndex);
        endIndex = boxText.indexOf("!", index + 10);
        var position = boxText.substring(index + 10, endIndex);
        position = getPosition(position);

        var nextIndex = boxText.indexOf(playerId, endIndex);
        var nextEndIndex = boxText.indexOf("!", nextIndex + 10);
        var secondPosition = boxText.substring(nextIndex + 10, nextEndIndex);
        secondPosition = getPosition(secondPosition);

        var thirdIndex = boxText.indexOf(playerId, nextEndIndex);
        var thirdEndIndex = boxText.indexOf("!", thirdIndex + 10);
        var thirdPosition = boxText.substring(thirdIndex + 10, thirdEndIndex);
        thirdPosition = getPosition(thirdPosition);

        var matched = false;
        if (position === secondPosition && secondPosition === thirdPosition){
            matched = true;}

        //================================================
        // Used to store the first non-ST position found,
        // for the case in which a three in a row match is
        // never found, and the final value of position
        // was ST (Special Teams).
        //================================================
        if (position != "ST" && positionHolder === "ST"){
            positionHolder = position;}

    } while ((thirdIndex != -1 && position === "ST" && thirdIndex < endSection) || (thirdIndex != -1 && thirdIndex < endSection && matched === false));

    return ((position === "ST") ? positionHolder : position);
}

function parseGameInfo(boxText, playerLink)
{
    // Get boxscore link
    var index = boxText.indexOf("Box Score", 0);
    var gameID = boxText.substring(index - 27, index - 2);
    var link = "http://deeproute.com/?js=boxerinc&viewpbp=" + gameID;

    // Get team abbreviations and build vs. string
    index = boxText.indexOf("vscore", 0);
    index += 39;
    var endIndex = boxText.indexOf("\n", index);
    var teamOne = boxText.substring(index, endIndex - 1);

    index = boxText.indexOf("hscore", endIndex);
    index += 39;
    endIndex = boxText.indexOf("\n", index);
    var teamTwo = boxText.substring(index, endIndex - 1);
    var vsString = teamOne + " vs. " + teamTwo;

    // Find team name
    index = boxText.indexOf(playerLink, 0);
    index = boxText.lastIndexOf("stat", index);
    var identifier = boxText.substring(index + 7, index + 8);

    index = boxText.indexOf("lastplay", 0);
    index = boxText.indexOf("href=?js=myteamstats&year=", index);
    index = boxText.indexOf(">", index);
    index += 3;
    endIndex = boxText.indexOf("\n", index);
    var team;
    if (identifier === "1"){
        team = boxText.substring(index, endIndex - 1);}
    else
    {
        index = boxText.indexOf("href=?js=myteamstats&year=", index);
        index = boxText.indexOf(">", index);
        index += 3;
        endIndex = boxText.indexOf("\n", index);
        team = boxText.substring(index, endIndex - 1);
    }

    return {gameLink: link, vsInfo: vsString, teamName: team};
}

//==================================================================
// Parses a specific category on a given box scores page
//
// Parameters
// ----------------
// boxText            The html of the given box score page
// category           The global array variable that stores the results
// startString        The string to search for, that begins the category
// limitString        The string to search for, that ends the category
// stats              The number of stats to extract from the category
//
// ----------------
// Returns:           nothing
//==================================================================
function parseCategory(boxText, category, startString, limitString, stats)
{
    var linkBase = "http://deeproute.com/?js="
    var position, index, limit, endString, stringData, info;

    //================================================
    // Find starting point, and end of category section
    //================================================
    index = boxText.indexOf(startString, 0);
    limit = boxText.indexOf(limitString, index);

    //================================================
    // Loop through the section, grabbing the player
    // link url, name and stats.  Continue as long
    // as there are still players within the section.
    // Position will become -1 if the search for the
    // next player reaches the EoF.
    //================================================
    index = boxText.indexOf("oneplayer", index);
    for (let i = category.length; index < limit && index != -1; i++)
    {
        category[i] = [];

        // Get player URL
        endString = boxText.indexOf(">", index);
        stringData = boxText.substring(index, endString);
        category[i][0] = linkBase + stringData;

        // Get player name
        index = boxText.indexOf("\n", index);
        endString = boxText.indexOf("\n", index + 1);
        category[i][1] = boxText.substring(index + 1, endString - 1);

        // Get player position
        position = parsePosition(boxText, stringData.substring(stringData.length - 5));
        category[i][2] = position;

        // Get game info
        info = parseGameInfo(boxText, stringData);
        category[i][3] = info.gameLink;
        category[i][4] = info.vsInfo;
        category[i][5] = info.teamName;

        // Get player stats
        for (var j = 6; j < stats + 6; j++)
        {
            index = boxText.indexOf("center>", index + 1);
            endString = boxText.indexOf("\n", index);
            category[i][j] = parseInt(boxText.substring(index + 7, endString - 1), 10);
        }

        // Find next player, then check to see if position is beyond end of section
        index = boxText.indexOf("oneplayer", index);
    }
}

//==================================================================
// Parses each box score page for every statistical category.
//
// Parameters
// ----------------
// boxResults         An array containing the html of the box scores
//
// ----------------
// Returns:           nothing
//==================================================================
function parseStats(boxResults)
{
    var currentBox;
    for (let i = 0; i < boxResults.length; i++)
    {
        currentBox = boxResults[i];
        parseCategory(currentBox, passing, "statblP1", "statblR1", 7);
        parseCategory(currentBox, rushing, "statblR1", "statblV1", 5);
        parseCategory(currentBox, receiving, "statblV1", "statblS1", 6);
        parseCategory(currentBox, twoPoints, "statblS1", "statblF1", 3);
        parseCategory(currentBox, fumbles, "statblF1", "statblD1", 6);
        parseCategory(currentBox, tackles, "statblD1", "statblI1", 5);
        parseCategory(currentBox, passD, "statblI1", "statblK1", 5);
        parseCategory(currentBox, kicking, "statblK1", "statblU1", 4);
        parseCategory(currentBox, punting, "statblU1", "statblX1", 5);
        parseCategory(currentBox, kReturns, "statblX1", "statblZ1", 4);
        parseCategory(currentBox, pReturns, "statblZ1", "Z0-5", 5);
    }
}

//==================================================================
// Extract and build box score URLs from the schedule page
//
// Parameters
// ----------------
// pageText           The html of the schedule page
//
// ----------------
// Returns:           An array of the URLs
//==================================================================
function getBoxscoreURLs(pageText)
{
    var linkBase = "http://deeproute.com/?js=boxerinc&viewpbp=";
    var gameURLs = [];

    // Grab values from page
    var weekStatus = document.getElementById('imonstatus').getAttribute("value");
    var currentWeek = document.getElementById('imonweek').getAttribute("value");
    var league = document.getElementById('imonlg').getAttribute("value");
    var year = document.getElementById('imonyear').getAttribute("value");

    var gameCount;
    if (weekStatus != "P"){
        gameCount = [16];}
    else if (currentWeek === "4"){
        gameCount = [1];}
    else if (currentWeek === "3"){
        gameCount = [2];}
    else {
        gameCount = [4];}

    if (currentWeek === "All")
    {
        gameCount = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];
        if (weekStatus === "X"){
            gameCount = [16, 16, 16, 16];}
        else if (weekStatus === "P"){
            gameCount = [4, 4, 2, 1];}
    }

    //================================================
    // Begin building the tags to search for.
    // lineTag:  Used to identify the line containing
    //           the game link numer
    // numberTag:  Used to find the game link number
    //================================================
    var urlCount = 0;
    for (let i = 0; i < gameCount.length; i++)
    {
        var week = ((currentWeek === "All") ? i + 1 : currentWeek);
        var lineTag = weekStatus + "-" + week;
        var statusChar = "0";
        var numberTag = "0000";

        if (weekStatus === "X"){
            statusChar = "X";}
        else if (weekStatus === "P"){
            statusChar = "P";}

        // Handle one digit or two digit league number
        if (league - 9 > 0){
            numberTag += league + "0000" + league + statusChar + year;}
        else{
            numberTag += "0" + league + "00000" + league + statusChar + year;}

        // Handle one digit or two digit week number
        if (week - 9 > 0){
            numberTag += week;}
        else{
            numberTag += "0" + week;}

        //================================================
        // Extract the game link numbers for all 16 games
        //================================================
        var fullTag, rxTag, tempTag, rgxResult, tempString;
        var idTag = [], idString = [];
        for (let j = 0; j < gameCount[i]; j++)
        {
            // Extract the line from the page
            fullTag = lineTag + "-" + (j + 1) + "\" value=\"Y!(.*)";
            rxTag = new RegExp(fullTag);
            rgxResult = rxTag.exec(pageText);

            if (rgxResult != null)
            {
                tempString = rgxResult[1];

                // Extract and build the game link number
                rxTag = new RegExp(numberTag + "(.+?(?=\\^))");
                idTag[j] = (rxTag.exec(tempString))[1];
                idString[j] = numberTag + idTag[j];

                // Build the URL
                gameURLs[urlCount] = linkBase + idString[j];
                urlCount++;
            }
            else
            {
                // End both loops
                j = gameCount[i];
                i = gameCount.length;
                partial = true;
            }
        }
        weeksParsed++;
    }

    return gameURLs;
}

//==================================================================
// Write the weekly report using the data of the chosen players.
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           The written report as a string.
//==================================================================
function writeReport()
{
    var choice = getRndInteger(1, 3);
    var weekStatus = document.getElementById('imonstatus').getAttribute("value");
    var currentWeek = document.getElementById('imonweek').getAttribute("value");
    var weekString = "week " + currentWeek + " post-game";
    var ofTheString = "of the week";
    var thisString = "this week";
    var theString = "WEEK";
    if (weekStatus === "X"){
        weekString = "Preseason " + weekString + " post-game";}
    if (weekStatus === "P")
    {
        if (currentWeek === "1"){
            weekString = "Wild-card round post-game";}
        else if (currentWeek === "2"){
            weekString = "Divisional round post-game";}
        else if (currentWeek === "3"){
            weekString = "Championship game post-game";}
        else{
            weekString = "Superbowl post-game";}
    }
    if (currentWeek === "All")
    {
        if (weekStatus === "X")
        {
            ofTheString = "of the Preseason";
            thisString = "this Preseason";
            theString = "PRESEASON";
            if (partial === false){
                weekString = "post Preseason";}
            else{
                weekString = "mid-Preseason, year to date";}
        }
        else if (weekStatus === "P")
        {
            ofTheString = "of the Postseason";
            thisString = "this Postseason";
            theString = "POSTSEASON";
            if (partial === false){
                weekString = "post Playoff";}
            else{
                weekString = "mid-Playoff, year to date";}
        }
        else
        {
            ofTheString = "of the season";
            thisString = "this season";
            theString = "SEASON";
            if (partial === false){
                weekString = "end of season, regular season";}
            else{
                weekString = "mid-season, year to date";}
        }
    }

    var header = "[SIZE=6][FONT=Arial][COLOR=green][B]███ " + theString + " IN FOCUS ███████████[/B][/COLOR][/FONT][/SIZE]\n\n";
    header += "                    [SIZE=3]With [B]James Landis[/B] and [B]Harry Funk[/B][/SIZE]\n";
    header += "                   ______________________________________\n\n";
    header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    Welcome to the " + weekString + " evaluation!\n";

    if (choice === 1)
    {
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    Hey, Harry, have you heard this one?\n";
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    " + getDadJoke() + "\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       " + funkResponse() + "\n";
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    Oh, come on man, where's your sense of humor?\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       Let's get on to the football.  Here's our highlights of the day:\n\n\n";
    }
    else if (choice === 2)
    {
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    Hey, Harry, have you heard this one?\n";
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    " + getJoke() + "\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       " + funkResponse() + "\n";
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    Oh, come on man, where's your sense of humor?\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       Let's get on to the football.  Here's our highlights of the day:\n\n\n";
    }
    else
    {
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    Hey, Harry, have you heard this one?\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       Hell nah, not today.  It's my turn.\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       " + getMamaJoke() + ".\n";
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    " + landisResponse() + "\n";
        header += "[COLOR=green][B]FUNK[/B][/COLOR]:       You think your dad jokes are funny, but this ain't funny?\n";
        header += "[COLOR=green][B]LANDIS[/B][/COLOR]:    My jokes are better.  On to the football.  Here are our highlights of the day:\n\n\n";
    }

    var passingReport = "[SIZE=3][COLOR=green][U][B]██PASSING REPORT████[/B][/U][/COLOR][/SIZE]\n\n";
    passingReport += chosenPassing.top.position + " [URL=" + chosenPassing.top.link + "][COLOR=white][B]" + chosenPassing.top.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenPassing.top.teamName + " had the standout performance " + ofTheString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenPassing.top.gameLink + "][COLOR=white][B]" + chosenPassing.top.vsInfo + "[/B][/URL][/COLOR]!\n");
    passingReport += "[COLOR=green][B]CMP:[/B][/COLOR][COLOR=red] " + chosenPassing.top.passingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenPassing.top.passingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenPassing.top.passingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenPassing.top.passingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]INTS:[/B][/COLOR][COLOR=red] " + chosenPassing.top.passingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]SACKED:[/B][/COLOR][COLOR=red] " + chosenPassing.top.passingArray[5] + " [/COLOR]\n" +
        "[COLOR=green][B]SCRAMBLES:[/B][/COLOR][COLOR=red] " + chosenPassing.top.rushingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenPassing.top.rushingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenPassing.top.rushingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenPassing.top.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenPassing.top.fumbleArray[1] + " [/COLOR]\n\n";
    passingReport += chosenPassing.second.position + " [URL=" + chosenPassing.second.link + "][COLOR=white][B]" + chosenPassing.second.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenPassing.second.teamName + " also had a strong performance " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenPassing.second.gameLink + "][COLOR=white][B]" + chosenPassing.second.vsInfo + "[/B][/URL][/COLOR].\n");
    passingReport += "[COLOR=green][B]CMP:[/B][/COLOR][COLOR=red] " + chosenPassing.second.passingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenPassing.second.passingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenPassing.second.passingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenPassing.second.passingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]INTS:[/B][/COLOR][COLOR=red] " + chosenPassing.second.passingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]SACKED:[/B][/COLOR][COLOR=red] " + chosenPassing.second.passingArray[5] + " [/COLOR]\n" +
        "[COLOR=green][B]SCRAMBLES:[/B][/COLOR][COLOR=red] " + chosenPassing.second.rushingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenPassing.second.rushingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenPassing.second.rushingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenPassing.second.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenPassing.second.fumbleArray[1] + " [/COLOR]\n\n";
    passingReport += "[SIZE=1][COLOR=brown][U][B]BUM QB OF THE " + theString + "[/B][/U][/COLOR][/SIZE]\n";
    passingReport += chosenPassing.bum.position + " [URL=" + chosenPassing.bum.link + "][COLOR=white][B]" + chosenPassing.bum.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenPassing.bum.teamName + " stunk up the stadium " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenPassing.bum.gameLink + "][COLOR=white][B]" + chosenPassing.bum.vsInfo + "[/B][/URL][/COLOR].\n");
    passingReport += "[COLOR=green][B]CMP:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.passingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.passingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.passingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.passingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]INTS:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.passingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]SACKED:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.passingArray[5] + " [/COLOR]\n" +
        "[COLOR=green][B]SCRAMBLES:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.rushingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.rushingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.rushingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenPassing.bum.fumbleArray[1] + " [/COLOR]\n\n\n";

    var rushingReport = "[SIZE=3][COLOR=green][U][B]██RUSHING REPORT████[/B][/U][/COLOR][/SIZE]\n\n";
    rushingReport += chosenRushing.top.position + " [URL=" + chosenRushing.top.link + "][COLOR=white][B]" + chosenRushing.top.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenRushing.top.teamName + " had the standout performance " + ofTheString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenRushing.top.gameLink + "][COLOR=white][B]" + chosenRushing.top.vsInfo + "[/B][/URL][/COLOR]!\n");
    rushingReport += "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenRushing.top.rushingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenRushing.top.rushingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenRushing.top.rushingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenRushing.top.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenRushing.top.fumbleArray[1] + " [/COLOR]\n" +
        "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenRushing.top.receivingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenRushing.top.receivingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenRushing.top.receivingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenRushing.top.receivingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenRushing.top.receivingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenRushing.top.receivingArray[5] + " [/COLOR]\n\n";
    rushingReport += chosenRushing.second.position + " [URL=" + chosenRushing.second.link + "][COLOR=white][B]" + chosenRushing.second.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenRushing.second.teamName + " also had a strong performance " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenRushing.second.gameLink + "][COLOR=white][B]" + chosenRushing.second.vsInfo + "[/B][/URL][/COLOR].\n");
    rushingReport += "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenRushing.second.rushingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenRushing.second.rushingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenRushing.second.rushingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenRushing.second.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenRushing.second.fumbleArray[1] + " [/COLOR]\n" +
        "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenRushing.second.receivingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenRushing.second.receivingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenRushing.second.receivingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenRushing.second.receivingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenRushing.second.receivingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenRushing.second.receivingArray[5] + " [/COLOR]\n\n";
    rushingReport += "[SIZE=1][COLOR=brown][U][B]BUM RB OF THE " + theString + "[/B][/U][/COLOR][/SIZE]\n";
    rushingReport += chosenRushing.bum.position + " [URL=" + chosenRushing.bum.link + "][COLOR=white][B]" + chosenRushing.bum.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenRushing.bum.teamName + " looked lost out there " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenRushing.bum.gameLink + "][COLOR=white][B]" + chosenRushing.bum.vsInfo + "[/B][/URL][/COLOR].\n");
    rushingReport += "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.rushingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.rushingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.rushingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.fumbleArray[1] + " [/COLOR]\n" +
        "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.receivingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.receivingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.receivingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.receivingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.receivingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenRushing.bum.receivingArray[5] + " [/COLOR]\n\n\n";

    var receivingReport = "[SIZE=3][COLOR=green][U][B]██RECEIVING REPORT████[/B][/U][/COLOR][/SIZE]\n\n";
    receivingReport += chosenReceiving.top.position + " [URL=" + chosenReceiving.top.link + "][COLOR=white][B]" + chosenReceiving.top.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenReceiving.top.teamName + " had the standout performance " + ofTheString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenReceiving.top.gameLink + "][COLOR=white][B]" + chosenReceiving.top.vsInfo + "[/B][/URL][/COLOR]!\n");
    receivingReport += "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.receivingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.receivingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.receivingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.receivingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.receivingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.receivingArray[5] + " [/COLOR]\n" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenReceiving.top.fumbleArray[1] + " [/COLOR]\n\n";
    receivingReport += chosenReceiving.second.position + " [URL=" + chosenReceiving.second.link + "][COLOR=white][B]" + chosenReceiving.second.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenReceiving.second.teamName + " also had a strong performance " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenReceiving.second.gameLink + "][COLOR=white][B]" + chosenReceiving.second.vsInfo + "[/B][/URL][/COLOR].\n");
    receivingReport += "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.receivingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.receivingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.receivingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.receivingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.receivingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.receivingArray[5] + " [/COLOR]\n" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenReceiving.second.fumbleArray[1] + " [/COLOR]\n\n";
    receivingReport += "[SIZE=1][COLOR=brown][U][B]BUM RECEIVER OF THE " + theString + "[/B][/U][/COLOR][/SIZE]\n";
    receivingReport += chosenReceiving.bum.position + " [URL=" + chosenReceiving.bum.link + "][COLOR=white][B]" + chosenReceiving.bum.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenReceiving.bum.teamName + " didn't accomplish much " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenReceiving.bum.gameLink + "][COLOR=white][B]" + chosenReceiving.bum.vsInfo + "[/B][/URL][/COLOR].\n");
    receivingReport += "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.receivingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.receivingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.receivingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.receivingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.receivingArray[4] + " [/COLOR]" +
        "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.receivingArray[5] + " [/COLOR]\n" +
        "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.fumbleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenReceiving.bum.fumbleArray[1] + " [/COLOR]\n\n\n";

    var dualReport = "[SIZE=3][COLOR=green][U][B]██DUAL THREAT████[/B][/U][/COLOR][/SIZE]\n\n";
    if (chosenDual.top != "undefined")
    {
        dualReport += chosenDual.top.position + " [URL=" + chosenDual.top.link + "][COLOR=white][B]" + chosenDual.top.name + "[/B][/URL][/COLOR] " +
            "from team " + chosenDual.top.teamName + " had the notable dual threat performance " + ofTheString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenDual.top.gameLink + "][COLOR=white][B]" + chosenDual.top.vsInfo + "[/B][/URL][/COLOR]!\n");
        dualReport += "[COLOR=green][B]ATT:[/B][/COLOR][COLOR=red] " + chosenDual.top.rushingArray[0] + " [/COLOR]" +
            "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenDual.top.rushingArray[1] + " [/COLOR]" +
            "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenDual.top.rushingArray[2] + " [/COLOR]" +
            "[COLOR=green][B]FMBS:[/B][/COLOR][COLOR=red] " + chosenDual.top.fumbleArray[0] + " [/COLOR]" +
            "[COLOR=green][B]LOST:[/B][/COLOR][COLOR=red] " + chosenDual.top.fumbleArray[1] + " [/COLOR]\n" +
            "[COLOR=green][B]REC:[/B][/COLOR][COLOR=red] " + chosenDual.top.receivingArray[0] + " [/COLOR]" +
            "[COLOR=green][B]TGT:[/B][/COLOR][COLOR=red] " + chosenDual.top.receivingArray[1] + " [/COLOR]" +
            "[COLOR=green][B]DRP:[/B][/COLOR][COLOR=red] " + chosenDual.top.receivingArray[2] + " [/COLOR]" +
            "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenDual.top.receivingArray[3] + " [/COLOR]" +
            "[COLOR=green][B]YAC:[/B][/COLOR][COLOR=red] " + chosenDual.top.receivingArray[4] + " [/COLOR]" +
            "[COLOR=green][B]TDS:[/B][/COLOR][COLOR=red] " + chosenDual.top.receivingArray[5] + " [/COLOR]\n\n\n";
    }
    else
    {
        dualReport += "Unfortunately, no one qualified for this category " + thisString + ".\n\n\n";
    }

    var defensiveReport = "[SIZE=3][COLOR=green][U][B]██DEFENSIVE REPORT████[/B][/U][/COLOR][/SIZE]\n\n" +
        "We've chosen four players with standout performances to highlight " + thisString + ".\n\n";
    defensiveReport += chosenDefense.top.position + " [URL=" + chosenDefense.top.link + "][COLOR=white][B]" + chosenDefense.top.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenDefense.top.teamName + " had the standout performance " + ofTheString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenDefense.top.gameLink + "][COLOR=white][B]" + chosenDefense.top.vsInfo + "[/B][/URL][/COLOR]!\n");
    defensiveReport += "[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] " + chosenDefense.top.tackleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] " + chosenDefense.top.tackleArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] " + chosenDefense.top.tackleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] " + chosenDefense.top.tackleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.top.tackleArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] " + chosenDefense.top.passDArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] " + chosenDefense.top.passDArray[1] + " [/COLOR]" +
        "[COLOR=green][B]INT:[/B][/COLOR][COLOR=red] " + chosenDefense.top.passDArray[2] + " [/COLOR]" +
        "[COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.top.passDArray[3] + " [/COLOR]" +
        "[COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] " + chosenDefense.top.passDArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] " + chosenDefense.top.fumbleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] " + chosenDefense.top.fumbleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.top.fumbleArray[4] + " [/COLOR]" +
        "[COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] " + chosenDefense.top.fumbleArray[5] + " [/COLOR]\n\n";
    defensiveReport += chosenDefense.second.position + " [URL=" + chosenDefense.second.link + "][COLOR=white][B]" + chosenDefense.second.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenDefense.second.teamName + " made some plays " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenDefense.second.gameLink + "][COLOR=white][B]" + chosenDefense.second.vsInfo + "[/B][/URL][/COLOR].\n");
    defensiveReport += "[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] " + chosenDefense.second.tackleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] " + chosenDefense.second.tackleArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] " + chosenDefense.second.tackleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] " + chosenDefense.second.tackleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.second.tackleArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] " + chosenDefense.second.passDArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] " + chosenDefense.second.passDArray[1] + " [/COLOR]" +
        "[COLOR=green][B]INT:[/B][/COLOR][COLOR=red] " + chosenDefense.second.passDArray[2] + " [/COLOR]" +
        "[COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.second.passDArray[3] + " [/COLOR]" +
        "[COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] " + chosenDefense.second.passDArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] " + chosenDefense.second.fumbleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] " + chosenDefense.second.fumbleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.second.fumbleArray[4] + " [/COLOR]" +
        "[COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] " + chosenDefense.second.fumbleArray[5] + " [/COLOR]\n\n";
    defensiveReport += chosenDefense.third.position + " [URL=" + chosenDefense.third.link + "][COLOR=white][B]" + chosenDefense.third.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenDefense.third.teamName + " made some plays " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenDefense.third.gameLink + "][COLOR=white][B]" + chosenDefense.third.vsInfo + "[/B][/URL][/COLOR].\n");
    defensiveReport += "[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] " + chosenDefense.third.tackleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] " + chosenDefense.third.tackleArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] " + chosenDefense.third.tackleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] " + chosenDefense.third.tackleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.third.tackleArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] " + chosenDefense.third.passDArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] " + chosenDefense.third.passDArray[1] + " [/COLOR]" +
        "[COLOR=green][B]INT:[/B][/COLOR][COLOR=red] " + chosenDefense.third.passDArray[2] + " [/COLOR]" +
        "[COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.third.passDArray[3] + " [/COLOR]" +
        "[COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] " + chosenDefense.third.passDArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] " + chosenDefense.third.fumbleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] " + chosenDefense.third.fumbleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.third.fumbleArray[4] + " [/COLOR]" +
        "[COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] " + chosenDefense.third.fumbleArray[5] + " [/COLOR]\n\n";
    defensiveReport += chosenDefense.fourth.position + " [URL=" + chosenDefense.fourth.link + "][COLOR=white][B]" + chosenDefense.fourth.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenDefense.fourth.teamName + " made some plays " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenDefense.fourth.gameLink + "][COLOR=white][B]" + chosenDefense.fourth.vsInfo + "[/B][/URL][/COLOR].\n");
    defensiveReport += "[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.tackleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.tackleArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.tackleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.tackleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.tackleArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.passDArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.passDArray[1] + " [/COLOR]" +
        "[COLOR=green][B]INT:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.passDArray[2] + " [/COLOR]" +
        "[COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.passDArray[3] + " [/COLOR]" +
        "[COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.passDArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.fumbleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.fumbleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.fumbleArray[4] + " [/COLOR]" +
        "[COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] " + chosenDefense.fourth.fumbleArray[5] + " [/COLOR]\n\n";
    defensiveReport += "[SIZE=1][COLOR=brown][U][B]BUM DEFENDER OF THE " + theString + "[/B][/U][/COLOR][/SIZE]\n";
    defensiveReport += chosenDefense.bum.position + " [URL=" + chosenDefense.bum.link + "][COLOR=white][B]" + chosenDefense.bum.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenDefense.bum.teamName + " was a liability on the field " + thisString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenDefense.bum.gameLink + "][COLOR=white][B]" + chosenDefense.bum.vsInfo + "[/B][/URL][/COLOR].\n");
    defensiveReport += "[COLOR=green][B]TCK:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.tackleArray[0] + " [/COLOR]" +
        "[COLOR=green][B]MTCK:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.tackleArray[1] + " [/COLOR]" +
        "[COLOR=green][B]TFL:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.tackleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]SACK:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.tackleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]SYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.tackleArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]GCOV:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.passDArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PDEF:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.passDArray[1] + " [/COLOR]" +
        "[COLOR=green][B]INT:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.passDArray[2] + " [/COLOR]" +
        "[COLOR=green][B]IYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.passDArray[3] + " [/COLOR]" +
        "[COLOR=green][B]ITD:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.passDArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]FFUM:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.fumbleArray[2] + " [/COLOR]" +
        "[COLOR=green][B]FREC:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.fumbleArray[3] + " [/COLOR]" +
        "[COLOR=green][B]FYRD:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.fumbleArray[4] + " [/COLOR]" +
        "[COLOR=green][B]FTD:[/B][/COLOR][COLOR=red] " + chosenDefense.bum.fumbleArray[5] + " [/COLOR]\n\n\n";

    var specialTeamsReport = "[SIZE=3][COLOR=green][U][B]██SPECIAL TEAMS REPORT████[/B][/U][/COLOR][/SIZE]\n\n";
    specialTeamsReport += chosenSpecialTeams.top.position + " [URL=" + chosenSpecialTeams.top.link + "][COLOR=white][B]" + chosenSpecialTeams.top.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenSpecialTeams.top.teamName + " had the standout performance " + ofTheString +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenSpecialTeams.top.gameLink + "][COLOR=white][B]" + chosenSpecialTeams.top.vsInfo + "[/B][/URL][/COLOR]!\n");
    specialTeamsReport += "[COLOR=green][B]FG:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kickingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]FGA:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kickingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]XPM:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kickingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]XPA:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kickingArray[3] + " [/COLOR]\n" +
        "[COLOR=green][B]PUNTS:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.puntingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.puntingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]NET:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.puntingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]TB:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.puntingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]BLK:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.puntingArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]KRET:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kReturnArray[0] + " [/COLOR]" +
        "[COLOR=green][B]KYD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kReturnArray[1] + " [/COLOR]" +
        "[COLOR=green][B]KOTD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kReturnArray[2] + " [/COLOR]" +
        "[COLOR=green][B]KLNG:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.kReturnArray[3] + " [/COLOR]\n" +
        "[COLOR=green][B]PRET:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.pReturnArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PRYD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.pReturnArray[2] + " [/COLOR]" +
        "[COLOR=green][B]PRTD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.pReturnArray[3] + " [/COLOR]" +
        "[COLOR=green][B]PLNG:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.top.pReturnArray[4] + " [/COLOR]\n\n";
    specialTeamsReport += "[SIZE=1][COLOR=brown][U][B]BUM SPECIAL TEAMER OF THE " + theString + "[/B][/U][/COLOR][/SIZE]\n";
    specialTeamsReport += chosenSpecialTeams.bum.position + " [URL=" + chosenSpecialTeams.bum.link + "][COLOR=white][B]" + chosenSpecialTeams.bum.name + "[/B][/URL][/COLOR] " +
        "from team " + chosenSpecialTeams.bum.teamName + " incurred the wrath of the fans" +
        ((currentWeek === "All") ? ".\n" : ", in game [URL=" + chosenSpecialTeams.bum.gameLink + "][COLOR=white][B]" + chosenSpecialTeams.bum.vsInfo + "[/B][/URL][/COLOR].\n");
    specialTeamsReport += "[COLOR=green][B]FG:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kickingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]FGA:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kickingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]XPM:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kickingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]XPA:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kickingArray[3] + " [/COLOR]\n" +
        "[COLOR=green][B]PUNTS:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.puntingArray[0] + " [/COLOR]" +
        "[COLOR=green][B]YDS:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.puntingArray[1] + " [/COLOR]" +
        "[COLOR=green][B]NET:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.puntingArray[2] + " [/COLOR]" +
        "[COLOR=green][B]TB:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.puntingArray[3] + " [/COLOR]" +
        "[COLOR=green][B]BLK:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.puntingArray[4] + " [/COLOR]\n" +
        "[COLOR=green][B]KRET:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kReturnArray[0] + " [/COLOR]" +
        "[COLOR=green][B]KYD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kReturnArray[1] + " [/COLOR]" +
        "[COLOR=green][B]KOTD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kReturnArray[2] + " [/COLOR]" +
        "[COLOR=green][B]KLNG:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.kReturnArray[3] + " [/COLOR]\n" +
        "[COLOR=green][B]PRET:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.pReturnArray[0] + " [/COLOR]" +
        "[COLOR=green][B]PRYD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.pReturnArray[2] + " [/COLOR]" +
        "[COLOR=green][B]PRTD:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.pReturnArray[3] + " [/COLOR]" +
        "[COLOR=green][B]PLNG:[/B][/COLOR][COLOR=red] " + chosenSpecialTeams.bum.pReturnArray[4] + " [/COLOR]\n\n\n";


    return header + passingReport + rushingReport + receivingReport + dualReport + defensiveReport + specialTeamsReport;
}

//==================================================================
// Extract and build box score URLs from the schedule page
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           The constructed report
//==================================================================
function buildReport()
{
    //================================================
    // Construct URLs for the boxscore pages
    //================================================
    var reportText = document.body.innerHTML;
    var gameURLs = getBoxscoreURLs(reportText);

    //================================================
    // Grab the html for each box score page
    //================================================
    var boxResults = [];
    var request;
    for (let i = 0; i < gameURLs.length; i++)
    {
        request = new XMLHttpRequest();
        request.open("GET", gameURLs[i], false);
        request.send(null);
        if (request.status === 200){
            boxResults[i] = request.responseText;}
    }

    //================================================
    // Parse the results from the boxscores,
    // calculate the player's scores, then
    // choose which players to include in the report.
    //================================================
    parseStats(boxResults);
    calculatePlayerScores();
    choosePlayers();

    //================================================
    // Write and return the weekly report.
    //================================================
    return writeReport();
}

//==================================================================
// Main function.
// Builds interface, and starts the buildReport() function.
//
// Parameters
// ----------------
// none
//
// ----------------
// Returns:           nothing
//==================================================================
(function()
{
    var pageText = document.body.innerHTML;
    var target = document.getElementById('imonstatus');

    //================================================
    // Create the div that our button and text box
    // will be placed into.
    //================================================
    var reportDiv = document.createElement('div');
    reportDiv.align = "left";

    //================================================
    // Create the 'Create Report' button
    //================================================
	var runButton = document.createElement('BUTTON');
    var buttonText = document.createTextNode("Create Report");
    runButton.appendChild(buttonText);

    //================================================
    // Create the text box that the report will be
    // printed in.  Read only, initially invisible.
    //================================================
    var textBox = document.createElement("TEXTAREA");
    textBox.setAttribute("style", "width:100%");
    textBox.setAttribute("rows", "10");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("readOnly", true);
    textBox.style.fontSize = "10pt";
    textBox.style.fontFamily = "Courier New,Courier,monospace";
    textBox.style.display = "none";

    //================================================
    // When button is clicked: parse the box scores,
    // print the report to the text box, then make
    // the text box visible.
    //================================================
	runButton.addEventListener('click', function() {
        var reportText = buildReport();
        //var reportText = weekStatus + "  " + currentWeek + "  " + weekGameCount + "\n" + document.getElementById('imonstatus').getAttribute("value") + "  " +
        //    document.getElementById('imonweek').getAttribute("value") + "\n";
        textBox.appendChild(document.createTextNode(reportText));
        textBox.style.display = "block";
	});

    //================================================
    // Add the button and text box to the div
    //================================================
    reportDiv.appendChild(runButton);
    reportDiv.appendChild(document.createElement("br"));
    reportDiv.appendChild(textBox);

    //================================================
    // Add the div to the page
    //================================================
    if (target)
    {
        target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(reportDiv,
						target.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling);
    }

})();