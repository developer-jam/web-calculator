/*
    Author: github.com/iamjam2
    Description: JavaScript file for GitHub Project - Basic calculator made with web technologies
    Licence: None... knock yourself out if you wanna use this for anything.
*/

$(document).ready(function(){
    var screenText = "";
    var castedValue = 0;
    const calExpr = [];
    const operators = [];

    function updateScreen(){$("#cal-screen").val(screenText);} //Updates screen from screenText variable...

    function isNumber(testChar){
        var numberRegEx = /[0-9]/g; //Regular expression for digits 0 - 9 with global search modifier...
        
        return numberRegEx.test(testChar);
    }

    function screenHasAnswer(){
        var equalToRegEx = /=/m; //Regular expression to find the equal character with multi-line search modifier...

        return equalToRegEx.test(screenText);
    }

    function lastIsNumber(){ //Checks if the last character on screen is a number...
        var lastChar = screenText.slice(screenText.length - 1);
        
        return isNumber(lastChar); //True or False return from function with RegEx
    }

    function lastIsPower(){ //Checks if the last character on the screen is a power...
        var lastChar = screenText.slice(screenText.length - 1);

        return lastChar == "²";
    }

    function lastIsPeriod(){ //Checks if the last character on the screen is a period...
        var lastChar = screenText.slice(screenText.length - 1);

        return lastChar == ".";
    }

    function addToExpr(inputValue){ //Adds values and characters to an array holding the full expression/equation to be calculated...
        calExpr.push(inputValue);
        castedValue = 0;
    }

    function popFromExpr(){ //removes items from the arrays correctly as per the displayed expression/equation, when backspace is used..
        var exprLength = screenText.length;

        if(exprLength < operators[operators.length - 1]){
            calExpr.pop(); calExpr.pop();
            operators.pop();
        }
    }

    function doCal(operator, position){ //Peforms the calculations from what's stored on the array...
        var calDone = false; //Confirms that the calculation has been done and saved to the array correctly (Error handling to be added here)...

        switch(operator){ //Calculations are done and the answer is saved to the array block on the left side, ex: [1][+][2] becomes [3][+][2]
            case "/":
                calExpr[position - 1] = calExpr[position - 1] / calExpr[position + 1];
                calDone = true;
                break;
            case "%":
                calExpr[position - 1] = calExpr[position - 1] % calExpr[position + 1];
                calDone = true;
                break;
            case "x":
                calExpr[position - 1] = calExpr[position - 1] * calExpr[position + 1];
                calDone = true;
                break;
            case "+":
                calExpr[position - 1] = calExpr[position - 1] + calExpr[position + 1];
                calDone = true;
                break;
            case "-":
                calExpr[position - 1] = calExpr[position - 1] - calExpr[position + 1];
                calDone = true;
                break;
            default:
                //No default case, input is limited by the buttons on the calculator...
        }

        calExpr.splice(position + 1, 1); //Removes the array value on the right side block after the calculation is performed, ex: the above [3][+][2] becomes [3][+]
        calExpr.splice(position, 1); //Removes the operator from the array after the calculation is performed, ex: the above [3][+] becomes [3] the answer from the calculation.

        return calDone;
    }

    function equalTo(){ //Runs when the equal button is pressed...
        castedValue = 0;
        
        if(!(screenHasAnswer())){
            var solution = ""
            var storedExprLength = calExpr.length;

            if((lastIsNumber() || lastIsPower()) && !(screenText == "")){ //Last character on screen must be either a number or a power or the screen and the screen must not be blank... 
                if(storedExprLength == 0){ //If nothing is stored on the array yet then no operator has been added to the calculation.  
                    if(lastIsPower()){ //Only the square of a number is being calculated...
                        castedValue = Number(screenText.slice(0, screenText.length - 1));
                        castedValue = Math.pow(castedValue,2);
                        addToExpr(castedValue);
                        solution = "= " + String(calExpr[0]);
                        calExpr.pop();
                    }
                    else{ //Only a plain number is on the screen...
                        addToExpr(Number(screenText));
                        solution = "= " + String(calExpr[0]);
                        calExpr.pop();
                    }
                }
                else{ //Else there is an operator in the calculation...
                    if(lastIsPower()){
                        castedValue = Number(screenText.slice(operators[operators.length -1] + 1, screenText.length - 1));
                        castedValue = Math.pow(castedValue,2);
                        addToExpr(castedValue);
                    }
                    else{
                        castedValue = Number(screenText.slice(operators[operators.length -1] + 1, screenText.length));
                        addToExpr(castedValue);
                    }

                    storedExprLength = calExpr.length; //The last value is added to the array, update the saved length of the array..
                    
                    //Loop through the array and perform calculations according to the correct mathematical precidence...
                    for(let count = 1; count < storedExprLength -1 ; count += 2){
                        if(calExpr[count] == "/"){ if(doCal("/", count)){ count -= 2; storedExprLength = calExpr.length;}}
                    }

                    for(let count = 1; count < storedExprLength -1 ; count += 2){
                        if(calExpr[count] == "%"){ if(doCal("%", count)){ count -= 2; storedExprLength = calExpr.length;}}
                    }

                    for(let count = 1; count < storedExprLength -1 ; count += 2){
                        if(calExpr[count] == "x"){ if(doCal("x", count)){ count -= 2; storedExprLength = calExpr.length;}}
                    }

                    for(let count = 1; count < storedExprLength -1 ; count += 2){
                        if(calExpr[count] == "+"){ if(doCal("+", count)){ count -= 2; storedExprLength = calExpr.length;}}
                    }

                    for(let count = 1; count < storedExprLength -1 ; count += 2){
                        if(calExpr[count] == "-"){ if(doCal("-", count)){ count -= 2; storedExprLength = calExpr.length;}}
                    }
                    
                    //After these loops, only 1 array block remains with the final answer...
                    solution = "= " + String(calExpr[0]);
                    calExpr.pop();
                }
            }
            else solution = "Error, invalid input!"; //The entered expression/equation cannot be calculated...

            screenText += "\n\n" + solution; //Display the solution calculated or feedback... 

            updateScreen();
        }
    }

    function clearAll(){ //Clears the screen and all arrays...
        screenText = "";

        while(operators.length > 0){operators.pop();}
        while(calExpr.length > 0){calExpr.pop();}
        updateScreen();
    }

    function backspace(){ //Clears the last character on screen or the entire screen and arrays if there was a solution displayed...
        if(screenHasAnswer()){
            clearAll();
        }
        else{
            var tempText = "";

            if(!(screenText == "")) tempText = screenText.slice(0, screenText.length - 1);
        
            tempText = tempText.trim();
            screenText = tempText;

            popFromExpr()
            updateScreen();
        }
    }

    function btnPress(pressedChar){ //Computes what to do with each button pressed...
        if(screenHasAnswer()){ //If an answer is displayed, the screen and arrays should first be cleared...
            clearAll();
        }

        if(isNumber(pressedChar)){ //If the button pressed is a number...
            if(!(lastIsPower())){
                if(!(screenText == "" || lastIsNumber() || lastIsPeriod())){//Screen is not blank or the last char on screen is not a number
                    pressedChar = " " + pressedChar;
                }
                
                screenText += pressedChar;
            }
        }
        else{ //If the button pressed is not a number...
            if(!(screenText == "")  && (lastIsNumber() || lastIsPower())){//Non-numeric chars can only go after numbers and powers
                if(pressedChar == "^"){//If non-numeric character is a power
                    if(!(lastIsPower())) screenText += "²";
                }
                else if(pressedChar == "."){//If non-numeric character is a period
                    if(!(lastIsPower())) screenText += ".";
                }
                else{//If non-numeric character pressed is not either a power or a period
                    if(operators.length === 0){//if there's no operator(s) in the expression already
                        if(lastIsPower()){
                            castedValue = Number(screenText.slice(0, screenText.length - 1));
                            castedValue = Math.pow(castedValue,2);
                            addToExpr(castedValue);
                        }
                        else{
                            castedValue = Number(screenText.slice(0, screenText.length));
                            addToExpr(castedValue);
                        }
                    }
                    else{//If there already is an operator in the expression
                        if(lastIsPower()){
                            castedValue = Number(screenText.slice(operators[operators.length -1] + 1, screenText.length - 1));
                            castedValue = Math.pow(castedValue,2);
                            addToExpr(castedValue);
                        }
                        else{
                            castedValue = Number(screenText.slice(operators[operators.length -1] + 1, screenText.length));
                            addToExpr(castedValue);
                        }
                    }

                    screenText += " " + pressedChar;
                    operators.push(screenText.length);
                    addToExpr(pressedChar);

                }
            }
        }

        updateScreen();
    }

    //********************************Button click functions********************************
    $("#clear-all").click(function(){ clearAll();})
    $("#delete").click(function(){ backspace();})
    $("#equal-to").click(function(){ equalTo();})

    //Digit buttons
    $("#one").click(function(){ btnPress("1");})
    $("#two").click(function(){ btnPress("2");})
    $("#three").click(function(){ btnPress("3");})
    $("#four").click(function(){ btnPress("4");})
    $("#five").click(function(){ btnPress("5");})
    $("#six").click(function(){ btnPress("6");})
    $("#seven").click(function(){ btnPress("7");})
    $("#eight").click(function(){ btnPress("8");})
    $("#nine").click(function(){ btnPress("9");})
    $("#zero").click(function(){ btnPress("0");})

    $("#period").click(function(){ btnPress(".")})
    
    //Operand buttons
    $("#plus").click(function(){ btnPress("+");})
    $("#minus").click(function(){ btnPress("-");})
    $("#multiply").click(function(){ btnPress("x");})
    $("#divide").click(function(){ btnPress("/");})
    $("#modulus").click(function(){ btnPress("%");})
    $("#power-two").click(function(){btnPress("^");})
})
