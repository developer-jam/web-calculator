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

    function updateScreen(){$("#cal-screen").val(screenText);}

    function isNumber(testChar){
        var numberRegEx = /[0-9]/g; //Regular expression for digits 0 - 9
        
        return numberRegEx.test(testChar);
    }

    function screenHasAnswer(){
        var equalToRegEx = /=/m;

        return equalToRegEx.test(screenText);
    }

    function lastIsNumber(){//Checks if the last character on screen is a number
        var lastChar = screenText.slice(screenText.length - 1);
        
        return isNumber(lastChar); //True or False return from function with RegEx
    }

    function lastIsPower(){
        var lastChar = screenText.slice(screenText.length - 1);

        return lastChar == "²";
    }

    function lastIsPeriod(){
        var lastChar = screenText.slice(screenText.length - 1);

        return lastChar == ".";
    }

    function addToExpr(inputValue){
        calExpr.push(inputValue);
        castedValue = 0;
    }

    function popFromExpr(){
        var exprLength = screenText.length;

        if(exprLength < operators[operators.length - 1]){
            calExpr.pop(); calExpr.pop();
            operators.pop();
        }
    }

    function doCal(operator, position){
        var calDone = false;

        switch(operator){
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
                //No default case...
        }

        calExpr.splice(position + 1, 1);
        calExpr.splice(position, 1);

        return calDone;
    }

    function equalTo(){
        if(!(screenHasAnswer())){
            var solution = ""
            var storedExprLength = calExpr.length;

            if(lastIsNumber() || lastIsPower() || !(screenText == "")){
                //check for and peform divisions (/)...
                if(storedExprLength == 0){
                
                castedValue = Number(screenText.slice(0, screenText.length - 1));
                castedValue = Math.pow(castedValue,2);
                addToExpr(castedValue);
                solution = "= " + String(calExpr[0]);
                calExpr.pop();
                }
                else{
                    if(lastIsPower()){
                        castedValue = Number(screenText.slice(operators[operators.length -1] + 1, screenText.length - 1));
                        castedValue = Math.pow(castedValue,2);
                        addToExpr(castedValue);
                    }
                    else{
                        castedValue = Number(screenText.slice(operators[operators.length -1] + 1, screenText.length));
                        addToExpr(castedValue);
                    }

                    storedExprLength = calExpr.length;

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
                
                    solution = "= " + String(calExpr[0]);
                    calExpr.pop();
                }
            }
            else solution = "Error, invalid input!";

            screenText += "\n\n" + solution;

            updateScreen();
        }
    }

    function clearAll(){
        screenText = "";

        while(operators.length > 0){operators.pop();}
        while(calExpr.length > 0){calExpr.pop();}
        updateScreen();
    }

    function backspace(){
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

    function btnPress(pressedChar){
        if(screenHasAnswer()){
            clearAll();
        }

        if(isNumber(pressedChar)){
            if(!(lastIsPower())){
                if(!(screenText == "" || lastIsNumber() || lastIsPeriod())){//Screen is not blank or the last char on screen is not a number
                    pressedChar = " " + pressedChar;
                }
                
                screenText += pressedChar;
            }
        }
        else{//If pressed key is not a digit
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
                            //console.log(calExpr[0]);
                        }
                        else{
                            castedValue = Number(screenText.slice(0, screenText.length));
                            addToExpr(castedValue);
                            //console.log(calExpr[0]);
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