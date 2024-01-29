"use strict";

let itemCount = 0;

// Holds amount value in the table.
const visualAmount = new Map();

document.addEventListener("DOMContentLoaded", function(){
    const items = document.querySelectorAll("#autoPartsTable table tr:not(:first-child)");
    let amount, button, amountTd;
    items.forEach(row => {
        amountTd = row.querySelector("[headers='amount']");
        amount = amountTd.innerText;
        if(amount > 0){
            button = row.querySelector(".sellingBtn");
            visualAmount.set(row.getAttribute("data-item-id"), row);
            button.addEventListener("click", selectProduct);
        }
        else{
            disableSelectButton(row);
        }
    });
});

function disableSelectButton(row){
    row.querySelector("td[headers='amount']").style.color = "red";
    const selectBtn = row.querySelector("td[headers='sell']");
    selectBtn.setAttribute("disable", "disable");
    selectBtn.removeEventListener("click", selectProduct);
}

function enableSelectButton(row){
    row.querySelector("td[headers='amount']").style.color = "black";
    row.querySelector("td[headers='sell']").removeAttribute("disable");
    row.querySelector("td[headers='sell']").addEventListener("click", selectProduct);
}

function selectProduct(event){ 
    let itemId = event.target.getAttribute("data-product-id");
    addToBag(itemId);
}

const openOrderButton = document.getElementById("openOrder");
openOrderButton.addEventListener("click", showSummaryWindow);

function addToBag(id){
    itemCount ++;

    // Removing 1 from the table, and adding that one to the Bag.
    const amountTd = visualAmount.get(id).querySelector("td[headers='amount']");
    let amount = amountTd.textContent - 1;
    amountTd.textContent = amount;
    if(amount === 0){
        disableSelectButton(visualAmount.get(id));
    }
    updateProductCount(id);
}

const productCount = document.getElementById("selectedItemsCount");
const orderSummary = document.getElementById("orderSummary");
const productInfo = document.getElementById("productInfo");

// Holds pure data about products.
const detailedProducts = new Map();

// Holds HTML elements (e.g. selected products).
const createdProducts = new Map();

// Used in last summary modal window.
const cacheOfFinalProducts = new Map();

function updateProductCount(id){
    productCount.textContent = itemCount;
    if(itemCount > 0){
        orderSummary.textContent = "Selling " + itemCount + " items in total.";
        openOrderButton.disabled = false;
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
        openOrderButton.disabled = true;
        orderSummary.textContent = "You have no products here.";
    }
}

function createElement(element, className = null, text = null){
    const _element = document.createElement(element);
    if(className !== null){
        _element.classList.add(className);
    }
    if(text !== null){
        _element.textContent = text;
    }
    return _element;
}
// I was stopped, here, keep improving bit by bit.
function createProduct(id){
    let removeIcon, container, detailedProduct;

    detailedProduct = detailedProducts.get(id);

    container = createElement("div", "productContainer", null);
    container.id = id + "bugProduct";

    fillContainer(container, detailedProduct);

    removeIcon = createDeletionIcon();
    container.appendChild(removeIcon);

    createdProducts.set(id, container);

    productInfo.appendChild(container);
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
    let paragraph = createElement("p", null, pText);
    let prop = createElement("span", propClass, propValue);
    paragraph.appendChild(prop);
    return paragraph;
}

function createDeletionIcon(){
    let removeIcon = createElement("span", "removeFromBagIcon", "delete");
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
        enableSelectButton(visualAmount.get(itemId));
    }
}

function removeProduct(id){
    createdProducts.delete(id);
    const visualRow = visualAmount.get(id);
    const amountCell = visualRow.querySelector("td[headers='amount']");
    let amountNumber = Number(amountCell.textContent);
    if(amountNumber === 0){
        amountCell.style.color = "black";
        visualRow.removeAttribute("disabled");
        visualRow.querySelector("td[headers='sell']").addEventListener("click", selectProduct);
    }
    amountNumber += detailedProducts.get(id).amount;
    amountCell.textContent = amountNumber;
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
    timeOutId = setTimeout(showOrderSummary, 500);
});
bagBtn.addEventListener("mouseout", function(){
    clearTimeout(timeOutId);
    if(!isBagBtnActive){
        hideOrderSummary();
    }
});
bagBtn.addEventListener("click", function(){
    if(!isBagBtnActive){
        showOrderSummary();
        bagBtn.classList.add("activeBag");
        isBagBtnActive = true;
    }
    else{
        hideOrderSummary();
        bagBtn.classList.remove("activeBag");
        isBagBtnActive = false;
    }
});

function showOrderSummary(){
    orderSummary.style.display = "block";
    productInfo.style.display = "block";
}
function hideOrderSummary(){
    orderSummary.style.display = "none";
    productInfo.style.display = "none";
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
            container = createElement("div", "finalProduct", null);
            paragraph = fillContainer(container, detailedProducts.get(id));
            value.isCreated = true;
            value.value = container;
            modalWindow.appendChild(container);
        }
    });
}

document.getElementById("modalCancelIcon").addEventListener("click", closeSummaryWindow);

function closeSummaryWindow(){
    modalContainer.style.display = "none";
}

const finalSellBtn = document.getElementById("modalBtnWrapper").querySelector("button");
finalSellBtn.addEventListener("click", makeSellingRequest);

function convertItemsToJSON(){
    const collectionOfItems = [];
    let totalPrice = 0;
    
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
        totalPrice += singleItem.priceInTenge * singleItem.amount;
        collectionOfItems.push(singleItem);
    });
    return JSON.stringify({ orderedParts: collectionOfItems, totalPrice});
}

async function makeSellingRequest(){
    const orderData = convertItemsToJSON();
    console.log(orderData);
    try{
        const response = await fetch("/", {
            method: "POST",
            body: orderData,
            headers: {
                "Content-Type": "application/json",
                "RequestVerificationToken": document.getElementById("RequestVerificationToken").value
            }
        });
        if(!response.ok){
            console.log("Something went wrong!");
            const errorMessage = await response.json();
            console.log(errorMessage);
        }
        else{
            const responseData = await response.json();
            //resetBag();
            indicateFailure(responseData.message, response.status);
            //indicateSuccess(responseData.message);
        }
    }
    catch(error){
        console.log("An error occurred! " + error.message);
    }
}

function resetBag(){
    detailedProducts.clear();
    cacheOfFinalProducts.clear();
    createdProducts.forEach((value) => {
        value.remove();
    });
    modalWindow.querySelectorAll(".finalProduct").forEach((value) => {
        value.remove();
    });
    modalWindow.querySelectorAll("div").forEach((value) => {
        value.style.display = "none";
    });
}
function indicateSuccess(message){
    let successMessage = modalWindow.querySelector("#successMessage");
    if(!successMessage){
        successMessage = document.createElement("p");
        successMessage.textContent = message;
        successMessage.id = "successMessage";
        successMessage.classList.add("receipt");
        modalWindow.appendChild(successMessage);
    }
    successMessage.style.display = "block";
    modalWindow.style.animationPlayState = "running";
    setTimeout(() => {
        modalWindow.querySelector("p").remove();
        modalWindow.style.animation = "0.2s ease-in-out paused indicateSuccess";
        modalWindow.style.animationFillMode = "forwards";
        modalWindow.querySelectorAll("div").forEach((value) => {
            value.style.display = "block";
        });
        successMessage.style.display = "none";
        itemCount = 0;
        updateProductCount(null);
        closeSummaryWindow();
    }, 1500);
}

function indicateFailure(message, statusCode){
    const errorBox = createElement("div", "finalProduct", null);
    errorBox.style.backgroundColor = "red";
    errorBox.style.color = "white";
    const statusHeader = createElement("h2", null, statusCode);
    statusHeader.style.textAlign = "center";
    const errorMessage = createElement("p", null, message);
    errorBox.appendChild(statusHeader);
    errorBox.appendChild(errorMessage);
    modalWindow.insertBefore(errorBox, document.getElementById("modalBtnWrapper"));
}