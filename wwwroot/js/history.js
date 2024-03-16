// This JS file is used in the History page.

"use strict";

const historyContainer = document.getElementById("history-container");
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
        currentSelectedItem.classList.remove("selected-item");
    }
    if (requestedOrderId.isEnabled) {
        currentSelectedItem = clickedDiv;
        currentSelectedItem.classList.add("selected-item");
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

    let orderId = createDescriptionElement("p", "Order " + id);
    orderId.id = "order-id";
    detailsWrapperDiv.appendChild(orderId);
    let autoPart;
    let element;
    order.forEach((value) => {
        autoPart = value.autoPart;

        element = createDescriptionElement("p", "Name: ", "name");
        element.appendChild(createDescriptionElement("span", autoPart.name, "detail"));

        detailsWrapperDiv.appendChild(element);

        element = createDescriptionElement("p", "ID: ", "mg-left-2vh");
        element.appendChild(createDescriptionElement("span", autoPart.id, "detail"));

        detailsWrapperDiv.appendChild(element);

        element = createDescriptionElement("p", "Sold Amount: ", "mg-left-2vh");
        element.appendChild(createDescriptionElement("span", value.soldAmount, "detail"));

        detailsWrapperDiv.appendChild(element);

        element = createDescriptionElement("p", "Applicability: ", "mg-left-2vh");
        element.appendChild(createDescriptionElement("span", autoPart.applicability, "detail"));

        detailsWrapperDiv.appendChild(element);

        element = createDescriptionElement("p", "Company: ", "mg-left-2vh");
        element.appendChild(createDescriptionElement("span", autoPart.company, "detail"));
    });

    details.appendChild(detailsWrapperDiv);
}

function createDescriptionElement(elementType, text, optionalClass = null){
    let result = document.createElement(elementType);
    result.textContent = text;
    if(optionalClass !== null){
        result.classList.add(optionalClass);
    }
    return result;
}