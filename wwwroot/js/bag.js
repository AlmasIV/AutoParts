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
const productsDesc = document.getElementById("productsDesc");
const bagText = document.getElementById("bagText");
const productCount = document.getElementById("bagCount");

let isBagBtnActive = false;

bagBtn.addEventListener("mouseover", showProductsDesc);
bagBtn.addEventListener("mouseout", function(){
    if(!isBagBtnActive){
        hideProductsDesc();
    }
});
bagBtn.addEventListener("click", function(){
    if(!isBagBtnActive){
        console.log("I an here.");
        showProductsDesc();
        bagBtn.classList.add("activeBag");
        isBagBtnActive = true;
    }
    else{
        console.log("I am here!");
        hideProductsDesc();
        bagBtn.classList.remove("activeBag");
        isBagBtnActive = false;
    }
});

function showProductsDesc(){
    productsDesc.style.display = "block";
}
function hideProductsDesc(){
    productsDesc.style.display = "none";
}