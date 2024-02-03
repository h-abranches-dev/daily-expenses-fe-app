import { server } from "../modules/backend.js";
import { colorsRGB } from "../modules/colors.js";
import { drawCategoriesInTableCell } from "../modules/categories.js";

let transactions, transactionsIds;
let selectedRowID;
let transactionsEntity, transactionsType;

let buttonsEditIds, checkboxesIds;
let rowToEdit = newRowToEdit();

class DebitCreditTransaction {
    constructor(id, td, tr, tc, ty, a) {
        this.id = id;
        this.transactionDate = td;
        this.transaction = tr;
        this.categories = tc;
        this.type = ty;
        this.amount = a;
    }
}

function newRowToEdit() {
    return {
        id: 0,
        transaction_date: "",
        transaction: "",
        categories: "",
        type: "",
        amount: 0.0,
        state: "initial"
    };
}

function resetRowToEdit() {
    rowToEdit = newRowToEdit();
}

function setRowToEdit(id, td, tr, tc, ty, a) {
    rowToEdit.id = id;
    rowToEdit.transaction_date = td;
    rowToEdit.transaction = tr;
    rowToEdit.categories = tc;
    rowToEdit.type = ty;
    rowToEdit.amount = a;
    rowToEdit.state = rowToEdit.state == "initial" ? "selected" : "to_update";
}

function disableButttons(flag) {
    buttonsEditIds.forEach((id) => {
        document.getElementById(id).disabled = flag;
    });
    checkboxesIds.forEach((id) => {
        document.getElementById(id).disabled = flag;
    });
    document.getElementById('t_btnAdd').disabled = flag;
}

function disableButtons() {
    disableButttons(true)
}

function enableButtons() {
    disableButttons(false)
}

async function drawDebitCreditTransactionsTable(entity, type) {
    transactionsEntity = entity;
    transactionsType = type;

    let t = "";

    t += `<table id="transactionsTable" class="table table-bordered">`;
    t += `<thead id="transactionsTableHead">`;
    t += `<th id="transactionsTableThSelect">Select</th>`;
    t += `<th id="transactionsTableThTransactionDate">Transaction Date</th>`;
    t += `<th id="transactionsTableThTransaction">Transaction</th>`;
    t += `<th id="transactionsTableThCategories">Categories</th>`;
    t += `<th id="transactionsTableThType">Type</th>`;
    t += `<th id="transactionsTableThAmount">Amount</th>`;
    t += `<th id="transactionsTableThActions">Action</th>`;
    t += `</thead>`;
    t += `<tbody id="transactionsTableBody"></tbody>`;
    t += `</table>`;

    t += `<div id="etd">`;
    t += `<div>`;
    t += `<div><label>Transaction Date:</label></div>`;
    t += `<div><input type="text" id="etd_i_td" value=""></div>`;
    t += `</div>`;
    t += `<div>`;
    t += `<div><label>Transaction:</label></div>`;
    t += `<div><input type="text" id="etd_i_tr" value=""></div>`;
    t += `</div>`;
    t += `<div>`;
    t += `<div><label>Categories:</label></div>`;
    t += `<div><input type="text" id="etd_i_tc" value=""></div>`;
    t += `</div>`;
    t += `<div>`;
    t += `<div><label>Type:</label></div>`;
    t += `<div><input type="text" id="etd_i_ty" value=""></div>`;
    t += `</div>`;
    t += `<div>`;
    t += `<div><label>Amount:</label></div>`;
    t += `<div><input type="text" id="etd_i_a" value=""></div>`;
    t += `</div>`;
    t += `<div>`;
    t += `<button type="submit" id="etd_i_b_ok">OK</button>`;
    t += `<button type="submit" id="etd_i_b_c">Cancel</button>`;
    t += `</div>`;
    t += `</div>`;

    document.getElementById('debitCreditTransactions').innerHTML = t;

    await updateTable();

    document.getElementById('t_btnAdd').addEventListener('click', clickOnAddButtonEventListener);
    addClickOnEditButtonEventListener();
}

async function updateTable() {
    transactions = await getTransactions(transactionsEntity, transactionsType);

    if (transactions != undefined && transactions != null) {
        transactionsIds = transactions.map(t => t.id);
    }

    renderTable();
}

async function getTransactions(entity, type) {
    try {
        let resp = await fetch(`${server.address}/transactions?entity=${entity}&type=${type}`);
        return await resp.json();
    } catch (err) {
        console.error(`error: ${err}`);
        return;
    }
}

async function renderTable() {
    let rows = "";
    buttonsEditIds = [];
    checkboxesIds = [];

    if (transactions != undefined && transactions != null && transactions.length > 0) {
        transactions.forEach(t => {
            const tObj = new DebitCreditTransaction(t.id, t.transaction_date, t.transaction, t.categories, t.type, t.amount);

            let btnEditID = `t_btnEdit_id_${tObj.id}`
            buttonsEditIds.push(btnEditID);
            let checkboxID = `t_checkbox_id_${tObj.id}`
            checkboxesIds.push(checkboxID);
            let rowID = `t_row_id${tObj.id}`
            rows += "<tr>";
            rows += `<td scope="row"><input id="${checkboxID}" type="checkbox"></input></td>`;
            rows += `<td id="${rowID}_td">${tObj.transactionDate}</td>`;
            rows += `<td id="${rowID}_tr">${tObj.transaction}</td>`;
            rows += drawCategoriesInTableCell(`${rowID}_tc`, tObj.categories);
            rows += `<td id="${rowID}_ty">${tObj.type}</td>`;
            rows += `<td id="${rowID}_a">${tObj.amount} €</td>`;
            rows += `<td><button id="${btnEditID}" type="button" style="background-color: ${colorsRGB.grey.code};">Edit</button></td>`;
            rows += "</tr>";
        });
    }

    rows += `<tr id="newRow">`;
    rows += `<td scope="row"><input type="checkbox" disabled></input></td>`;
    rows += `<td><input type="text" id="newTransactionDate" value="01/02/2024"></td>`;
    rows += `<td><input type="text" id="newTransaction" value="t0"></td>`;
    rows += `<td><input type="text" id="newCategories" value="NO-CATEGORY"></td>`;
    rows += `<td><input type="text" id="newType" value="debit"></td>`;
    rows += `<td><input type="text" id="newAmount" value="0.00"></td>`;
    rows += `<td><button id="t_btnAdd" type="button">Add</button></td>`;
    rows += "</tr>";

    document.getElementById("transactionsTableBody").innerHTML = rows;
}

// add button

function clickOnAddButtonEventListener() {
    clickOnAddButtonEvent();
}

async function clickOnAddButtonEvent() {
    await addTransaction(transactionsEntity, transactionsType);
    document.getElementById('t_btnAdd').removeEventListener('click', clickOnAddButtonEventListener);

    await updateTable(transactionsEntity, transactionsType);
    document.getElementById('t_btnAdd').addEventListener('click', clickOnAddButtonEventListener);
    addClickOnEditButtonEventListener();
}

async function addTransaction(entity, type) {
    let categories = document.getElementById('newCategories').value.split(";");

    try {
        await fetch(`${server.address}/transactions?entity=${entity}&type=${type}`, {
            method: "POST",
            headers: {},
            body: JSON.stringify({
                transaction_date: document.getElementById('newTransactionDate').value,
                transaction: document.getElementById('newTransaction').value,
                categories: categories,
                type: document.getElementById('newType').value,
                amount: parseFloat(document.getElementById('newAmount').value),
            }),
        });
    } catch (err) {
        console.error(`error: ${err}`);
    }
}

// edit buttons

function clickOnEditButtonEventListener() {
    clickOnEditButtonEvent(this.id);
}

function clickOnEditButtonEvent(elementID) {
    selectedRowID = elementID.split("t_btnEdit_id_")[1]

    console.log(`ROW WITH ID '${selectedRowID}' WAS SELECTED!!!`);

    document.getElementById(elementID).style.backgroundColor = colorsRGB.yellow.code;

    let dialogStyle = document.getElementById('etd').style;

    dialogStyle.display = "block";
    dialogStyle.position = "absolute";
    dialogStyle.top = `${window.scrollY + 210}px`;

    addEventListener("scroll", () => {
        dialogStyle.top = `${window.scrollY + 210}px`;
    });

    disableButtons();

    document.getElementById(`etd_i_td`).value = document.getElementById(`t_row_id${selectedRowID}_td`).textContent;
    document.getElementById(`etd_i_tr`).value = document.getElementById(`t_row_id${selectedRowID}_tr`).textContent;
    let categories = [];
    document.querySelectorAll(`#t_row_id${selectedRowID}_tc > div`).forEach(el => {
        categories.push(el.textContent);
    });
    document.getElementById(`etd_i_tc`).value = categories.join(";");
    document.getElementById(`etd_i_ty`).value = document.getElementById(`t_row_id${selectedRowID}_ty`).textContent;
    document.getElementById(`etd_i_a`).value = document.getElementById(`t_row_id${selectedRowID}_a`).textContent;
    setRowToEdit(
        selectedRowID,
        document.getElementById(`etd_i_td`).value,
        document.getElementById(`etd_i_tr`).value,
        document.getElementById(`etd_i_tc`).value,
        document.getElementById(`etd_i_ty`).value,
        document.getElementById(`etd_i_a`).value,
    );

    removeClickOnEditButtonEventListener();

    document.getElementById('etd_i_b_ok').addEventListener('click', clickOnEditDialogOkButtonEventListener);
    document.getElementById('etd_i_b_c').addEventListener('click', clickOnEditDialogCancelButtonEventListener);
}

function addClickOnEditButtonEventListener() {
    if (transactionsIds == undefined || transactions == null) {
        return;
    }
    for (let i = 0; i < transactionsIds.length; i++) {
        let editBtnID = `t_btnEdit_id_${transactionsIds[i]}`;
        document.getElementById(editBtnID).addEventListener('click', clickOnEditButtonEventListener);
    }
}

function removeClickOnEditButtonEventListener() {
    for (let i = 0; i < transactionsIds.length; i++) {
        let editBtnID = `t_btnEdit_id_${transactionsIds[i]}`;
        document.getElementById(editBtnID).removeEventListener('click', clickOnEditButtonEventListener);
    }
}

// edit dialog ok button

function clickOnEditDialogOkButtonEventListener() {
    clickOnEditDialogOkButtonEvent();
}

async function clickOnEditDialogOkButtonEvent() {
    if (rowToEdit.state == "selected") {
        if (rowToEdit.transaction_date != document.getElementById(`etd_i_td`).value) {
            rowToEdit.transaction_date = document.getElementById(`etd_i_td`).value;
            if (rowToEdit.state != "to_update") {
                rowToEdit.state = "to_update";
            }
        }
        if (rowToEdit.transaction != document.getElementById(`etd_i_tr`).value) {
            rowToEdit.transaction = document.getElementById(`etd_i_tr`).value;
            if (rowToEdit.state != "to_update") {
                rowToEdit.state = "to_update";
            }
        }
        if (rowToEdit.categories != document.getElementById(`etd_i_tc`).value) {
            let categories = document.getElementById('etd_i_tc').value.split(";");
            rowToEdit.categories = categories;
            if (rowToEdit.state != "to_update") {
                rowToEdit.state = "to_update";
            }
        }
        if (rowToEdit.type != document.getElementById(`etd_i_ty`).value) {
            rowToEdit.type = document.getElementById(`etd_i_ty`).value;
            if (rowToEdit.state != "to_update") {
                rowToEdit.state = "to_update";
            }
        }
        if (rowToEdit.amount != document.getElementById(`etd_i_a`).value) {
            rowToEdit.amount = document.getElementById(`etd_i_a`).value;
            if (rowToEdit.state != "to_update") {
                rowToEdit.state = "to_update";
            }
        }
    }

    await updateTransaction(transactionsEntity, transactionsType);
    document.getElementById('etd_i_b_ok').removeEventListener('click', clickOnEditDialogOkButtonEventListener);

    await updateTable(transactionsEntity, transactionsType);
    document.getElementById('t_btnAdd').addEventListener('click', clickOnAddButtonEventListener);
    addClickOnEditButtonEventListener();

    document.getElementById('etd').style = "display: none;";
    enableButtons();
    resetRowToEdit();
    document.getElementById(`t_btnEdit_id_${selectedRowID}`).style.backgroundColor = colorsRGB.grey.code;
}

async function updateTransaction(entity, type) {
    if (rowToEdit.state != "to_update") {
        return;
    }

    if (typeof(rowToEdit.categories) == 'string') {
        rowToEdit.categories = rowToEdit.categories.split(";");
    }

    try {
        await fetch(`${server.address}/transactions/${rowToEdit.id}?entity=${entity}&type=${type}`, {
            method: "PUT",
            body: JSON.stringify({
                transaction_date: rowToEdit.transaction_date,
                transaction: rowToEdit.transaction,
                categories: rowToEdit.categories,
                type: rowToEdit.type,
                amount: parseFloat(rowToEdit.amount),
            }),
        });
    } catch (err) {
        console.error(`error: ${err}`);
    }
}

// edit dialog cancel button

function clickOnEditDialogCancelButtonEventListener() {
    clickOnEditDialogCancelButtonEvent();
}

async function clickOnEditDialogCancelButtonEvent() {
    document.getElementById('etd').style = "display: none;";
    enableButtons();
    resetRowToEdit();
    document.getElementById(`t_btnEdit_id_${selectedRowID}`).style.backgroundColor = colorsRGB.grey.code;
}

export { drawDebitCreditTransactionsTable, DebitCreditTransaction };
