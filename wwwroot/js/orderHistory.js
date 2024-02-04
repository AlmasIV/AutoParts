"use strict";

const historyContainer = document.getElementById("historyContainer");
const details = historyContainer.lastElementChild;
const listOfOrders = historyContainer.firstElementChild;

const productDetailCache = new Map();

let detailsWrapperDiv = null;

const requestedOrderId = {
    isEnabled: false,
    id: 0
};

document.addEventListener("DOMContentLoaded", () => {
    historyContainer.querySelectorAll("#list div").forEach((element) => {
        element.addEventListener("click", getProduct);
    });
});

let currentSelectedItem = null;

async function getProduct(event) {
    try {
        const clickedItem = event.currentTarget;
        const id = Number(clickedItem.id);
        if (Number.isSafeInteger(id)) {
            let response;
            if (!productDetailCache.has(id)) {
                console.log("Making the request for the " + id);
                response = await fetch(`/api/products/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    const errorMessage = await response.json();
                    console.log(errorMessage);
                }
                else{
                    response = await response.json();
                    productDetailCache.set(id, response);
                }
            }
            response = productDetailCache.get(id);
            console.log(response);
            toggleDetailedInfo(id, response, clickedItem);
        }
        else {
            throw new Error(`The ${id} is not a number.`);
        }
    }
    catch (error) {
        console.log("An error occurred: " + error.message);
        console.log(error.stack);
    }
}


function toggleDetailedInfo(id, orderDetails, clickedDiv) {
    if (requestedOrderId.isEnabled) {
        requestedOrderId.isEnabled = false;
        clear();
        if (id !== requestedOrderId.id) {
            toggleDetailedInfo(id, orderDetails, clickedDiv);
        }
    }
    else {
        requestedOrderId.id = id;
        requestedOrderId.isEnabled = true;
        playGrow();
        displayDetails(id, orderDetails);
    }
    if (currentSelectedItem instanceof HTMLElement) {
        currentSelectedItem.classList.remove("selectedItem");
    }
    if (requestedOrderId.isEnabled) {
        currentSelectedItem = clickedDiv;
        currentSelectedItem.classList.add("selectedItem");
    }
}

function clear() {
    details.style.display = "none";
    detailsWrapperDiv.remove();
}

function playGrow() {
    details.style.animationPlayState = "running";
    details.style.display = "block";
}

function displayDetails(id, order) {
    detailsWrapperDiv = document.createElement("div");

    let orderId = createParagraph("Order " + id);
    orderId.id = "orderId";
    detailsWrapperDiv.appendChild(orderId);
    let autoPart;
    order.forEach((value) => {
        autoPart = value.autoPart;
        detailsWrapperDiv.appendChild(createParagraph("Name: " + autoPart.name, "name"));
        detailsWrapperDiv.appendChild(createParagraph("ID: " + autoPart.id, "detail"));
        detailsWrapperDiv.appendChild(createParagraph("Sold Amount: " + value.soldAmount, "detail"));
        detailsWrapperDiv.appendChild(createParagraph("Applicability: " + autoPart.applicability, "detail"));
        detailsWrapperDiv.appendChild(createParagraph("Company: " + (autoPart.company ?? "Unknown"), "detail"));
    });

    details.appendChild(detailsWrapperDiv);
}

function createParagraph(text, optionalClass = null) {
    let result = document.createElement("p");
    result.textContent = text;
    if (optionalClass !== null) {
        result.classList.add(optionalClass);
    }
    return result;
}