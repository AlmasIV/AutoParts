"use strict";

export function Result(isValid, message){
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