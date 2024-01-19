"use strict";

let itemCount = 0;

let product;

document.addEventListener("DOMContentLoaded", function(){
    const items = document.querySelectorAll("#autoPartsTable table tr:not(:first-child)");
    let amount, button, itemId, amountTd;
    items.forEach(row => {
        amountTd = row.querySelector("[headers='amount']");
        amount = amountTd.innerText;
        if(amount > 0){
            button = row.querySelector(".sellingBtn");
            button.addEventListener("click", function(){
                itemId = this.getAttribute("data-product-id");
                addToBag(itemId);
            });
        }
        else{
            row.setAttribute("disabled", "disabled");
            amountTd.style.color = "red";
        }
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
                let tr, name, applicability, company, price, priceInRubles;
                tr = document.querySelector(`main#autoPartsTable table tr[data-item-id="${id}"]`);
                name = tr.querySelector("td[headers='name']").textContent;
                applicability = tr.querySelector("td[headers='applicability']").textContent;
                company = tr.querySelector("td[headers='company']").textContent;
                price = tr.querySelector("td[headers='priceInTenge']").textContent;
                priceInRubles = tr.querySelector("td[headers='priceInRubles']").textContent;
                detailedProducts.set(id, { name, applicability, company, price, priceInRubles, amount: 1 });
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
    let removeIcon, container, detailedProduct;

    detailedProduct = detailedProducts.get(id);

    container = createProductProperty("div", "productContainer", null);
    container.id = id + "bugProduct";

    fillContainer(container, detailedProduct);

    removeIcon = createDeletionIcon();
    container.appendChild(removeIcon);

    createdProducts.set(id, container);

    itemsInfo.appendChild(container);
}

function fillContainer(container, detailedProduct){
    let paragraph;

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
    removeIcon.setAttribute("title", "Remove Item")

    return removeIcon;

    function removeItemHandler(event){
        let itemContainer = event.target.parentNode;
        let itemId = parseInt(itemContainer.id).toString();
        event.target.removeEventListener("click", removeItemHandler);
        itemCount = itemCount - detailedProducts.get(itemId).amount;
        removeProduct(itemId);
        cacheOfFinalProducts.delete(itemId);
        itemContainer.remove();
        updateProductCount(null);
    }
}

function removeProduct(id){
    createdProducts.delete(id);
    detailedProducts.delete(id);
    let cachedProduct = cacheOfFinalProducts.get(id);
    if(cachedProduct){
        cachedProduct.value.remove();
        cacheOfFinalProducts.delete(id);
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
const modalWindow = modalContainer.firstElementChild;

function showSummaryWindow(){
    modalContainer.style.display = "block";
    let cachedProduct, container, paragraph;
    detailedProducts.forEach(function(value, id){
        cachedProduct = cacheOfFinalProducts.get(id);
        if(cachedProduct){
            cachedProduct = cachedProduct.value;
            if(cachedProduct.amount !== value.amount){
                cachedProduct.amount = value.amount;
            }
        }
        else{
            cacheOfFinalProducts.set(id, { isCreated: false, value });
        }
    });
    cacheOfFinalProducts.forEach(function(value, id){
        if(value.isCreated !== true){
            container = createProductProperty("div", "finalProduct", null);
            paragraph = fillContainer(container, detailedProducts.get(id));
            value.isCreated = true;
            value.value = container;
            modalWindow.appendChild(container);
        }
    });
}

document.getElementById("modalCancelIcon").addEventListener("click", function(){
    modalContainer.style.display = "none";
});

const finalSellBtn = document.getElementById("modalBtnWrapper").querySelector("button");
finalSellBtn.addEventListener("click", makeSellingRequest);

function convertItemsToJSON(){
    const collectionOfItems = [];
    
    detailedProducts.forEach((value, key) => {
        const singleItem = {
            id: key,
            name: value.name,
            applicability: value.applicability,
            company: value.company === "Unknown" ? null : value.company,
            priceInTenge: value.price,
            priceInRubles: value.priceInRubles,
            amount: value.amount
        };
        collectionOfItems.push(singleItem);
    });
    return JSON.stringify(collectionOfItems);
}

async function makeSellingRequest(){
    console.log(convertItemsToJSON());
    try{
        const response = await fetch("/", {
            method: "POST",
            body: convertItemsToJSON(),
            headers: {
                "Content-Type": "application/json",
                "RequestVerificationToken": document.getElementById("RequestVerificationToken").value
            }
        });
        if(!response.ok){
            console.log("Something went wrong!");
        }
        else{
            console.log("Everything is okk.");
            const responseData = await response.json();
            console.log(responseData);
        }
    }
    catch(error){
        console.log("An error occurred! " + error.message);
    }
}