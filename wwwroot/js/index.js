// This JS file is used in the Index page.

"use strict";

let itemCount = 0;

// Holds amount value in the table.
const rowDictionary = new Map();

function addToBag(id) {
    itemCount++;

    // Removing 1 (decrementation of the amount cell) from the table, and adding that 1 to the Bag.
    const amountCell = rowDictionary.get(id).querySelector("td[headers='amount']");
    let amount = Number(amountCell.textContent) - 1;
    amountCell.textContent = amount;
    if (amount === 0) {
        disableAddingButton(rowDictionary.get(id));
    }
    updateBagCount(id);
}

function addProduct(event) {
    let itemId = event.target.getAttribute("data-product-id");
    addToBag(itemId);
}

document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll("#autoPartsTable table tr:not(:first-child)");
    let amount, addBtn, amountTd;
    rows.forEach(row => {
        amountTd = row.querySelector("[headers='amount']");
        amount = amountTd.innerText;
        if (Number(amount) > 0) {
            addBtn = row.querySelector(".addingBtn");
            rowDictionary.set(row.getAttribute("data-row-id"), row);
            addBtn.addEventListener("click", addProduct);
        }
        else {
            disableAddingButton(row);
        }
    });
});

function enableAddingButton(row) {
    row.querySelector("td[headers='amount']").style.color = "black";
    row.querySelector("td[headers='sell']").removeAttribute("disable");
    row.querySelector("td[headers='sell']").addEventListener("click", addProduct);
}

function disableAddingButton(row) {
    row.querySelector("td[headers='amount']").style.color = "red";
    const addBtn = row.querySelector("td[headers='sell']");
    addBtn.setAttribute("disable", "disable");
    addBtn.removeEventListener("click", addProduct);
}

function returnAmount(id) {
    const row = rowDictionary.get(id);
    const amountCell = row.querySelector("td[headers='amount']");

    // If the addBtn is already disabled, enable it.
    let amountNumber = Number(amountCell.textContent);
    if (amountNumber === 0) {
        enableAddingButton(rowDictionary.get(id));
    }

    amountNumber += detailedProducts.get(id).amount;
    amountCell.textContent = amountNumber;
}

const openModalBtn = document.getElementById("openModal");
openModalBtn.addEventListener("click", showModalWindow);

const bagCount = document.getElementById("bagCount");
const bagSummary = document.getElementById("bagSummary");
const bagInfo = document.getElementById("bagInfo");

// Holds pure data about products.
const detailedProducts = new Map();

// Holds HTML elements (e.g. selected products).
const createdComponents = new Map();

// Used in last summary modal window.
const cacheOfFinalProducts = new Map();

function updateBagCount(id) {
    bagCount.textContent = itemCount;
    if (itemCount > 0) {
        if (itemCount === 1) {
            bagSummary.textContent = "Selling 1 item in total.";
        }
        else {
            bagSummary.textContent = "Selling " + itemCount + " items in total.";
        }
        openModalBtn.disabled = false;
        if (id !== null) {
            if (!detailedProducts.has(id)) {
                let tr, name, applicability, company, priceInTenge, priceInRubles;
                tr = rowDictionary.get(id);
                name = tr.querySelector("td[headers='name']").textContent;
                applicability = tr.querySelector("td[headers='applicability']").textContent;
                company = tr.querySelector("td[headers='company']").textContent;
                priceInTenge = tr.querySelector("td[headers='priceInTenge']").textContent;
                priceInRubles = tr.querySelector("td[headers='priceInRubles']").textContent;

                detailedProducts.set(id, { name, applicability, company, priceInTenge, priceInRubles, amount: 1 });

                createComponent(id);
            }
            else {
                detailedProducts.get(id).amount++;
                createdComponents.get(id).querySelector("span.productAmount").textContent = detailedProducts.get(id).amount;
            }
        }
    }
    else {
        openModalBtn.disabled = true;
        bagSummary.textContent = "You selected nothing.";
    }
}

function createElement(element, className = null, text = null) {
    const _element = document.createElement(element);
    if (className !== null) {
        _element.classList.add(className);
    }
    if (text !== null) {
        _element.textContent = text;
    }
    return _element;
}

function createComponent(id) {
    let removeIcon, container, detailedProduct;

    detailedProduct = detailedProducts.get(id);

    container = createElement("div", "productContainer", null);
    container.id = id + "bugProduct";

    fillContainer(container, detailedProduct);

    removeIcon = createDeletionIcon();
    container.appendChild(removeIcon);

    createdComponents.set(id, container);

    bagInfo.appendChild(container);
}

function fillContainer(container, detailedProduct) {
    let paragraph;

    paragraph = createDetailedParagraph("Name: ", "productName", detailedProduct.name);
    container.appendChild(paragraph);

    paragraph = createDetailedParagraph("Applicability: ", "productApplicability", detailedProduct.applicability);
    container.appendChild(paragraph);

    paragraph = createDetailedParagraph("Company: ", "productCompany", detailedProduct.company);
    container.appendChild(paragraph);

    paragraph = createDetailedParagraph("Price: ", "productPrice", detailedProduct.priceInTenge);
    container.appendChild(paragraph);

    paragraph = createDetailedParagraph("Amount: ", "productAmount", detailedProduct.amount);
    container.appendChild(paragraph);
}

function createDetailedParagraph(pText, propClass, propValue) {
    const paragraph = createElement("p", null, pText);
    const prop = createElement("span", propClass, propValue);
    paragraph.appendChild(prop);
    return paragraph;
}

function createDeletionIcon() {
    const removeIcon = createElement("span", "removeFromBagIcon", "delete");
    removeIcon.classList.add("material-symbols-outlined");
    removeIcon.addEventListener("click", removeItemFromBag);
    removeIcon.setAttribute("title", "Remove Item");

    return removeIcon;
}

function removeItemFromBag(event) {
    const itemContainer = event.target.parentNode;

    // itemContainer.id -> starts with a number, follows by string. Need to extract the starting number.
    const itemId = parseInt(itemContainer.id).toString();

    event.target.removeEventListener("click", removeItemFromBag);
    itemCount = itemCount - detailedProducts.get(itemId).amount;
    removeProduct(itemId);
    cacheOfFinalProducts.delete(itemId);
    itemContainer.remove();
    updateBagCount(null);
    enableAddingButton(rowDictionary.get(itemId));
}

function removeProduct(id) {
    createdComponents.delete(id);
    returnAmount(id);
    detailedProducts.delete(id);
    let cachedProduct = cacheOfFinalProducts.get(id);
    if (cachedProduct) {
        cachedProduct.value.remove();
        cacheOfFinalProducts.delete(id);
    }
}

const bagBtn = document.getElementById("bag");

let isBagBtnActive = false;
let timeOutId;

bagBtn.addEventListener("mouseover", function () {
    timeOutId = setTimeout(showBagSummary, 500);
});
bagBtn.addEventListener("mouseout", function () {
    clearTimeout(timeOutId);
    if (!isBagBtnActive) {
        hideBagSummary();
    }
});
bagBtn.addEventListener("click", function () {
    if (!isBagBtnActive) {
        showBagSummary();
        bagBtn.classList.add("activeBag");
        isBagBtnActive = true;
    }
    else {
        hideBagSummary();
        bagBtn.classList.remove("activeBag");
        isBagBtnActive = false;
    }
});

function showBagSummary() {
    bagSummary.style.display = "block";
    bagInfo.style.display = "block";
}
function hideBagSummary() {
    bagSummary.style.display = "none";
    bagInfo.style.display = "none";
}

const modalContainer = document.getElementById("modalContainer");
const modalWindow = modalContainer.firstElementChild;
const itemsWrapper = modalWindow.querySelector("#itemsWrapper");

function showModalWindow() {
    modalContainer.style.display = "block";
    let cachedProduct, container;
    let totalPrice = 0;
    detailedProducts.forEach(function (value, id) {
        totalPrice += value.priceInTenge * value.amount;
        cachedProduct = cacheOfFinalProducts.get(id);
        if (cachedProduct) {
            cachedProduct = cachedProduct.value;

            // If user added additional product, update the amount.
            if (cachedProduct.amount !== value.amount) {
                cachedProduct.querySelector("p span.productAmount").textContent = value.amount;
            }
        }
        else {
            cacheOfFinalProducts.set(id, { isCreated: false, value });
        }
    });
    cacheOfFinalProducts.forEach(function (value, id) {
        if (value.isCreated !== true) {
            container = createElement("div", "finalProduct", null);
            fillContainer(container, detailedProducts.get(id));
            value.isCreated = true;
            value.value = container;
            itemsWrapper.appendChild(container);
        }
    });
}

document.getElementById("modalCloseIcon").addEventListener("click", closeSummaryWindow);
document.getElementById("modalClearIcon").addEventListener("click", () => {
    cacheOfFinalProducts.forEach((value, key) => {
        returnAmount(key);
    });
    resetBag();
    indicateSuccess("Cleared items.");
});

function closeSummaryWindow() {
    modalContainer.style.display = "none";
}

const sellBtn = document.getElementById("modalBtnWrapper").querySelector("button");
sellBtn.addEventListener("click", makeSellingRequest);

function convertItemsToJSON() {
    const collectionOfItems = [];
    let totalPrice = 0;

    detailedProducts.forEach((value, key) => {
        const singleItem = {
            id: key,
            name: value.name,
            applicability: value.applicability,
            company: value.company === "Unknown" ? null : value.company,
            priceInTenge: value.priceInTenge,
            priceInRubles: value.priceInRubles,
            amount: value.amount
        };
        totalPrice += singleItem.priceInTenge * singleItem.amount;
        collectionOfItems.push(singleItem);
    });
    console.log("Sending " + totalPrice);
    return JSON.stringify({ orderedParts: collectionOfItems, totalPrice });
}

async function makeSellingRequest() {
    const orderData = convertItemsToJSON();
    try {
        const response = await fetch("/api/products/", {
            method: "PUT",
            body: orderData,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            indicateFailure(errorMessage.message, response.status);
        }
        else {
            const responseData = await response.json();
            resetBag();
            indicateSuccess(responseData.message);
        }
    }
    catch (error) {
        console.log("An error occurred! " + error.message);
    }
}

function resetBag() {
    detailedProducts.clear();
    cacheOfFinalProducts.clear();
    createdComponents.forEach((value) => {
        value.remove();
    });
    modalWindow.querySelectorAll(".finalProduct").forEach((value) => {
        value.remove();
    });
    modalWindow.querySelectorAll("div").forEach((value) => {
        value.style.display = "none";
    });
}
function indicateSuccess(message) {
    let successMessage = modalWindow.querySelector("#successMessage");
    if (!successMessage) {
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
            if (value.id === "modalHeader") {
                value.style.display = "flex";
            }
            else {
                value.style.display = "block";
            }
        });
        successMessage.style.display = "none";
        itemCount = 0;
        updateBagCount(null);
        closeSummaryWindow();
    }, 1500);
}

function indicateFailure(message, statusCode) {
    const errorBox = createElement("div", "finalProduct", null);
    errorBox.style.backgroundColor = "red";
    errorBox.style.color = "white";
    errorBox.style.textAlign = "center";
    const statusHeader = createElement("h2", null, statusCode);
    const errorMessage = createElement("p", null, message);
    errorBox.appendChild(statusHeader);
    errorBox.appendChild(errorMessage);
    modalWindow.insertBefore(errorBox, document.getElementById("modalBtnWrapper"));
    setTimeout(() => {
        errorBox.remove();
    }, 2000);
}