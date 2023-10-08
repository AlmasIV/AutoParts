"use strict";

class Product{
    constructor(id){
        this.id = id;
        this.amount = 1;
    }
}

const bag = new Map();

let product, isCreated = false;

document.addEventListener("DOMContentLoaded", function(){
    const sellingButtons = document.querySelectorAll(".sellingBtn");
    let productId;
    sellingButtons.forEach(button => {
        button.addEventListener("click", function(){
            productId = button.getAttribute("data-product-id");
            addToBag(productId);
        });
    });
});

function addToBag(id){
    product = new Product(id);
    if(bag.has(product.id)){
        bag.get(product.id).amount++;
    }
    else{
        bag.set(product.id, product);
    }
}

const bagBtn = document.getElementById("bag");
const productsDesc = document.getElementById("test");

bagBtn.addEventListener("mouseover", function(){
    productsDesc.style.display = "block";
    productsDesc.classList.add("smoothTransition");
});
bagBtn.addEventListener("mouseout", function(){
    productsDesc.style.display = "none";
});