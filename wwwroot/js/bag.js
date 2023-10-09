"use strict";

const bag = new Map();
let itemCount = 0;

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
    product = { id: id, amount: 1 };
    if(bag.has(product.id)){
        bag.get(product.id).amount++;
    }
    else{
        bag.set(product.id, product);
    }
    itemCount ++;
    UpdateProductCount(id);
}

const productCount = document.getElementById("bagCount");
const productsDesc = document.getElementById("productsDesc");
const itemsInfo = document.getElementById("itemsInfo");

const detailedProducts = new Map();

function UpdateProductCount(id){
    productCount.textContent = itemCount;
    if(itemCount > 0){
        productsDesc.textContent = "Selling " + itemCount + " items in total.";
        let tr, name, applicability, company, price;
        bag.forEach(function(value, key, bag){
            tr = document.querySelector(`main#autoPartsTable table tr[data-item-id="${key}"]`);
            name = tr.querySelector("td[headers='name']");
            applicability = tr.querySelector("td[headers='applicability']");
            company = tr.querySelector("td[headers='company']");
            price = tr.querySelector("td[headers='priceInTenge']");
            if(!detailedProducts.has(key)){
                detailedProducts.add(key, { name, applicability, company, price, amount: value.amount });
            }
        });
    }
    else{
        productsDesc.textContent = "You have no products here.";
    }
}

const bagBtn = document.getElementById("bag");

let isBagBtnActive = false;

bagBtn.addEventListener("mouseover", showProductsDesc);
bagBtn.addEventListener("mouseout", function(){
    if(!isBagBtnActive){
        hideProductsDesc();
    }
});
bagBtn.addEventListener("click", function(){
    if(!isBagBtnActive){
        showProductsDesc();
        bagBtn.classList.add("activeBag");
        isBagBtnActive = true;
    }
    else{
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