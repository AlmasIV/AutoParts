// This JS file is used in the Products and in the Upload pages. It validates inputs for auto parts.

"use strict";

function Result(isValid, message){
    if(!new.target){
        throw new TypeError("Calling Result constructor without the 'new' keyword is invalid.");
    }
    if(typeof isValid !== "boolean"){
        throw new TypeError(`'isValid' must be boolean. It was '${typeof isValid}'.`);
    }
    if(typeof message !== "string"){
        throw new TypeError(`'message must be string. It was '${typeof message}'.`);
    }
    this.isValid = isValid;
    this.message = message;
}

function validateInputString(str){
    if(typeof str !== "string"){
        throw new TypeError(`'str' must be a string. It was '${typeof str}'.`);
    }
    if(str.startsWith(" ") || str.endsWith(" ")){
        return new Result(false, "The input cannot start or end with whitespace.");
    }
    if(str.length < 3){
        return new Result(false, "The input's minimal length is 3.");
    }
    let letter;
    for(letter of str){
        if(letter.toLowerCase() === letter.toUpperCase()){
            if(!"0123456789-(),.|/\\'\"[]{}:; #`".includes(letter)){
                return new Result(false, "The input can contain letters, or these characters: 0123456789-(),.|/\\'\"[]{}:;#`");
            }
        }
    }
    return new Result(true, "");
}

function validateInputNumber(number, minimalNumber, maxNumber){
    if(number.length === 0 || !/^\d{0,8}(?:\.\d{1,2})?$/.test(number) || Number(number) < minimalNumber || Number(number) > maxNumber){
        return new Result(false, `The input must contain numbers (possibly with a fraction up to 2 decimal points) only between ${minimalNumber} and ${maxNumber}.`);
    }
    return new Result(true, "");
}

export const inputs = [...document.querySelectorAll("div.input-container label + input")];
const errorSpans = [...document.querySelectorAll("div.input-container input + span.error-message")];

const initialValues = [];

const inputTimerIdDictionary = new Map();

inputs.forEach((input) => {
    inputTimerIdDictionary.set(input.name, -1);
    initialValues.push(input.value);
});

// Validate string inputs.
let i;
for(i = 0; i < 6; i ++){
    inputs[i].addEventListener("input", initializeValidation);
}

function initializeValidation(event){
    let input, result, isSame;
    input = event.target;
    clearTimeout(inputTimerIdDictionary.get(input.name));
    inputTimerIdDictionary.set(input.name, setTimeout(() => {
        switch(inputs.indexOf(input)){
            case 0:
            case 1:
            case 2:
                result = validateInputString(input.value);
                isSame = initialValues[inputs.indexOf(input)] === input.value;
                break;
            case 3:
            case 4:
            case 5:
                result = validateInputNumber(input.value, input.getAttribute("min"), input.getAttribute("max"));
                isSame = Number(initialValues[inputs.indexOf(input)]) === Number(input.value);
                break;
        }
        if(result.isValid){
            errorSpans[inputs.indexOf(input)].textContent = "";
            if(!isSame){
                indicateSuccess(input);
            }
            else{
                indicateInitial(input);
            }
        }
        else{
            indicateFailure(input, result.message);
        }
    }, 250));
}

function indicateSuccess(input){
    input.classList.remove("failure");
    input.classList.add("success");
}

function indicateFailure(input, errorMessage){
    input.classList.remove("success");
    input.classList.add("failure");
    errorSpans[inputs.indexOf(input)].textContent = errorMessage;
}

function indicateInitial(input){
    input.classList.remove("success");
    input.classList.remove("failure");
}

export function hasAnyUnique(){
    return inputs.some((value) => value.classList.contains("success"));
}

export function allValid(){
    return inputs.every((value) => !value.classList.contains("failure"));
}