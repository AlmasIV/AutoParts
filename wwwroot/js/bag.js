"use strict";

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
    itemCount ++;
    updateProductCount(id);
}

const productCount = document.getElementById("bagCount");
const productsDesc = document.getElementById("productsDesc");
const itemsInfo = document.getElementById("itemsInfo");

const detailedProducts = new Map();

function updateProductCount(id){
    productCount.textContent = itemCount;
    if(itemCount > 0){
        productsDesc.textContent = "Selling " + itemCount + " items in total.";

        if(!detailedProducts.has(id)){
            let tr, name, applicability, company, price;
            tr = document.querySelector(`main#autoPartsTable table tr[data-item-id="${id}"]`);
            name = tr.querySelector("td[headers='name']").textContent;
            applicability = tr.querySelector("td[headers='applicability']").textContent;
            company = tr.querySelector("td[headers='company']").textContent;
            price = tr.querySelector("td[headers='priceInTenge']").textContent;
            detailedProducts.set(id, { name, applicability, company, price, amount: 1 });
            createProduct(id);
        }
        else{
            detailedProducts.get(id).amount ++;
            displayProductAmount(id);
        }
    }
    else{
        productsDesc.textContent = "You have no products here.";
    }
}

const createdProducts = new Map();

function createProduct(id){
    let detailedProduct = detailedProducts.get(id);

    let container = document.createElement("div");
    container.classList.add("productContainer");
    container.id = "product_" + id;
    
    let name = document.createElement("p");
    name.classList.add("productName");
    name.textContent = "Name: " + detailedProduct.name;
    container.appendChild(name);

    let applicability = document.createElement("p");
    applicability.classList.add("productApplicability");
    applicability.textContent = "Applicability: " + detailedProduct.applicability;
    container.appendChild(applicability);

    let company = document.createElement("p");
    company.classList.add("productCompany");
    company.textContent = "Company: " + detailedProduct.company;
    container.appendChild(company);

    let price = document.createElement("p");
    price.classList.add("productPrice");
    price.textContent = "Price: " + detailedProduct.price;
    container.appendChild(price);

    let amount = document.createElement("p");
    amount.classList.add("productAmount");
    amount.textContent = "Amount: " + detailedProduct.amount;
    container.appendChild(amount);

    createdProducts.set(id, container);

    itemsInfo.appendChild(container);
}
function displayProductAmount(id){
    createdProducts.get(id).querySelector("p.productAmount").textContent = "Amount: " + detailedProducts.get(id).amount;
}

function removeProductFromList(){

}

const bagBtn = document.getElementById("bag");

let isBagBtnActive = false;
let timeOutId;

bagBtn.addEventListener("mouseover", function(){
    timeOutId = setTimeout(showProductsDesc, 500);
});
bagBtn.addEventListener("mouseout", function(){
    clearTimeout(timeOutId);
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
    itemsInfo.style.display = "block";
}
function hideProductsDesc(){
    productsDesc.style.display = "none";
    itemsInfo.style.display = "none";
}