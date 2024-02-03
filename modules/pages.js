let pages = [{
    id: "Home",
    title: "Home",
    type: "nil",
    typeToDisplay: "nil",
    entity: "nil",
    entityToDisplay: "nil",
    showInNavBar: true
}, {
    id: "Balances",
    title: "Balances",
    type: "nil",
    typeToDisplay: "nil",
    entity: "nil",
    entityToDisplay: "nil",
    showInNavBar: true
}, {
    id: "Analysis",
    title: "Analysis",
    type: "nil",
    typeToDisplay: "nil",
    entity: "nil",
    entityToDisplay: "nil",
    showInNavBar: true
}, {
    id: "Analysis Details",
    title: "Analysis Details",
    type: "nil",
    typeToDisplay: "nil",
    entity: "nil",
    entityToDisplay: "nil",
    showInNavBar: false
}, {
    id: "Test",
    title: "Test",
    type: "debit_bank_account",
    typeToDisplay: "Bank Account (Debit)",
    entity: "test",
    entityToDisplay: "Test",
    showInNavBar: true
}, {
    id: "Test2",
    title: "Test 2",
    type: "debit_credit_bank_account",
    typeToDisplay: "Bank Account (Debit and Credit)",
    entity: "test2",
    entityToDisplay: "Test 2",
    showInNavBar: true
}];

function getPage() {
    let capturedID = document.getElementById("ID").textContent;
    let filteredPages = pages.filter(p => {
        return p.id == capturedID;
    });
    if (filteredPages.length != 1) {
        throw new Error(`Page with ID '${capturedID}' not found!`);
    }
    return filteredPages[0];
}

function getEntityToDisplay(entity) {
    let filteredPages = pages.filter(p => {
        return p.entity == entity && p.entityToDisplay != "nil"
    });
    if (filteredPages.length != 1) {
        throw new Error(`Page with entity '${entity}' not found!`);
    }
    return filteredPages[0].entityToDisplay;
}

function getTypeToDisplay(type, entity) {
    let filteredPages = pages.filter(p => {
        return p.type == type && p.typeToDisplay != "nil" && p.entity == entity && p.entityToDisplay != "nil"
    });
    if (filteredPages.length == 0) {
        throw new Error(`Page with type '${type}' not found!`);
    }
    return filteredPages[0].typeToDisplay;
}

export { pages, getPage, getEntityToDisplay, getTypeToDisplay };
