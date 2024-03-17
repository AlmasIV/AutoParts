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

function validateInputPrice(price, minimalPrice){
    if(!/^[1-9][0-9]*$/.test(price)){
        return new Result(false, "Please enter a valid number.");
    }
    price = Number(price);
    if(Number.isNaN(price) || !Number.isFinite(price)){
        throw new TypeError("The 'price' must be a valid number.");
    }
    if(price < minimalPrice){
        return new Result(false, `The price must be at least ${minimalPrice}.`);
    }
    return new Result(true, "");
}

function validateInputAmount(amount){
    if(!/^[1-9][0-9]*$/.test(amount)){
        return new Result(false, "Please enter a valid number.");
    }
    if(amount < 0){
        return new Result(false, "The amount cannot be a negative number.");
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
                result = validateInputPrice(input.value, input.getAttribute("min"));
                isSame = Number(initialValues[inputs.indexOf(input)]) === Number(input.value);
                break;
            case 5:
                result = validateInputAmount(input.value);
                isSame = Number(initialValues[inputs.indexOf(input)]) === Number(input.value);
                break;
        }
        if(result.isValid || isSame){
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