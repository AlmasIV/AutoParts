"use strict";

let itemCount = 0;

let product;

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

const mainSellBtn = document.getElementById("mainSell");
mainSellBtn.addEventListener("click", showSummaryWindow);

function addToBag(id){
    itemCount ++;
    updateProductCount(id);
}

const productCount = document.getElementById("bagCount");
const productsDesc = document.getElementById("productsDesc");
const itemsInfo = document.getElementById("itemsInfo");

// Holds pure data about products.
const detailedProducts = new Map();

// Holds HTML elements (e.g. selected products).
const createdProducts = new Map();

// Used in last summary modal window.
const cacheOfFinalProducts = new Map();

function updateProductCount(id){
    productCount.textContent = itemCount;
    if(itemCount > 0){
        productsDesc.textContent = "Selling " + itemCount + " items in total.";
        mainSellBtn.disabled = false;
        if(id !== null){
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
                createdProducts.get(id).querySelector("span.productAmount").textContent = detailedProducts.get(id).amount;
            }
        }
    }
    else{
        mainSellBtn.disabled = true;
        productsDesc.textContent = "You have no products here.";
    }
}

function createProductProperty(element, className, text){
    let property = document.createElement(element);
    if(className !== null){
        property.classList.add(className);
    }
    if(text !== null){
        property.textContent = text;
    }
    return property;
}

function createProduct(id){
    let paragraph, removeIcon, container, detailedProduct;

    detailedProduct = detailedProducts.get(id);

    container = createProductProperty("div", "productContainer", null);
    container.id = id + "bugProduct";

    paragraph = createParagraph("Name: ", "productName", detailedProduct.name);
    container.appendChild(paragraph);
    
    paragraph = createParagraph("Applicability: ", "productApplicability", detailedProduct.applicability);
    container.appendChild(paragraph);
    
    paragraph = createParagraph("Company: ", "productCompany", detailedProduct.company);
    container.appendChild(paragraph);

    paragraph = createParagraph("Price: ", "productPrice", detailedProduct.price);
    container.appendChild(paragraph);

    paragraph = createParagraph("Amount: ", "productAmount", detailedProduct.amount);
    container.appendChild(paragraph);

    removeIcon = createDeletionIcon();
    container.appendChild(removeIcon);

    createdProducts.set(id, container);

    itemsInfo.appendChild(container);
}

function createParagraph(pText, propClass, propValue){
    let paragraph = createProductProperty("p", null, pText);
    let prop = createProductProperty("span", propClass, propValue);
    paragraph.appendChild(prop);
    return paragraph;
    
}

function createDeletionIcon(){
    let removeIcon = createProductProperty("span", "removeFromBagIcon", "delete");
    removeIcon.classList.add("material-symbols-outlined");
    removeIcon.addEventListener("click", removeItemHandler);

    return removeIcon;

    function removeItemHandler(event){
        let itemContainer = event.target.parentNode;
        let itemId = parseInt(itemContainer.id).toString();
        event.target.removeEventListener("click", removeItemHandler);
        itemCount = itemCount - detailedProducts.get(itemId).amount;
        createdProducts.delete(itemId);
        detailedProducts.delete(itemId);
        itemContainer.remove();
        updateProductCount(null);
    }
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

const modalContainer = document.getElementById("modalContainer");

let prod, oldAmount, newAmount;
function showSummaryWindow(){
    modalContainer.style.display = "block";
    let cachedProduct, finalProduct;
    let tempKey, tempValue;
    
}

document.getElementById("modalCancelIcon").addEventListener("click", function(){
    modalContainer.style.display = "none";
});