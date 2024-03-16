// This JS file is used in the Products page.

"use strict";

import { hasAnyUnique, allValid, inputs } from "./autoPartValidation.js";

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const editTimerIdDictionary = new Map();

inputs.forEach((element) => {
    editTimerIdDictionary.set(element.name, -1);
    element.addEventListener("input", triggerEditToggle);
});

function triggerEditToggle(event){
    let input = event.target;
    clearTimeout(editTimerIdDictionary.get(input.name));
    editTimerIdDictionary.set(input.name, setTimeout(() => {
        if(allValid() && hasAnyUnique()){
            editBtn.removeAttribute("disabled");
        }
        else{
            editBtn.setAttribute("disabled", "disabled");
        }
    }, 300));
}
