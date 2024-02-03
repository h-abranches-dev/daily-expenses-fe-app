import { server } from "../modules/backend.js";
import { drawCategoriesInTableCell } from "../modules/categories.js";
import { colorsRGB } from "../modules/colors.js";
import { setAnalysisDetailsCategories } from "../modules/analysis.js";

class AnalysisObject {
    constructor(cs) {
        this.categories = cs;
        this.transactions = [];
        this.total = 0.0;
        this.isValid = function (cs) {
            this.categories.forEach(c => {
                if (!cs.includes(c)) {
                    throw new Error(`the category ${c} is not supported`);
                }
            });
        }
    }
}

class AnalysisObjectTransaction {
    constructor(t) {
        this.date = t.transaction_date;
        this.transaction = t.transaction;
        this.amount = t.amount;
    }
}

class AnalysisObjectDetails {
    constructor(ao) {
        this.categories = ao.categories;
        this.transactions = [];
        this.setTransactions = () => {
            const ts = [];
            for (const t of ao.transactions) {
                const nt = new AnalysisObjectTransaction(t);
                ts.push(nt);
            }
            this.transactions = ts
        };
        this.total = ao.total;
    }
}

const analysisDetailsPageRelativePath = "../analysis-details/index.html";

let categories;

let analysisObjects = [
    new AnalysisObject(['SUPERMARKET'])
];

function main() {
    drawAnalysisPage();
}

async function drawAnalysisPage() {
    let table = "";

    table += `<table id="at" class="table table-bordered">`;
    table += `<thead id="ath">`;
    table += `<th id="athc">Categories</th>`;
    table += `<th id="atht">Total</th>`;
    table += `<th id="athl"></th>`;
    table += `</thead>`;
    table += `<tbody id="atb"></tbody>`;
    table += `</table>`;

    document.getElementById("analysisObjectsTable").innerHTML = table;

    await updateTable();

    addClickOnDetailsButtonEventListener();
}

async function updateTable() {
    categories = await getCategories();
    if (categories == undefined) {
        return;
    }
    for (const ao of analysisObjects) {
        const cs = ao.categories;
        const transactions = await getTransactions(cs);
        if (transactions == undefined) {
            const err = `unable to fetch the transactions for categories ${categories}`
            console.error(`error: ${err}`);
            return;
        }
        ao.transactions = transactions.transactions;
        ao.total = transactions.total;
    }
    renderTable();
}

async function getCategories() {
    try {
        let resp = await fetch(`${server.address}/categories`);
        categories = await resp.json()
        return categories.map(c => c.label);
    } catch (err) {
        console.error(`error: ${err}`);
        return;
    }
}

async function renderTable() {
    if (analysisObjects.length == 0) {
        return;
    }
    let rows = "";
    for (let i = 0; i < analysisObjects.length; i++) {
        const aoObj = analysisObjects[i];
        try {
            aoObj.isValid(categories)
        } catch (e) {
            console.error(e);
            return
        }
        let disabledButton = '';
        if (aoObj.transactions == null || aoObj.transactions.length == 0) {
            disabledButton = ' disabled'
        }
        rows += "<tr>";
        rows += drawCategoriesInTableCell(`aotr${i + 1}_td_cs`, aoObj.categories);
        rows += `<td id="aotr${i + 1}_td_t">${Number.parseFloat(aoObj.total).toFixed(2)} €</td>`;
        rows += `<td><button id="ao_btnDetails_id_${i + 1}" type="button" style="background-color: ${colorsRGB.grey.code};"${disabledButton}>Details</button></td>`;
        rows += "</tr>";
    }
    document.getElementById("atb").innerHTML = rows;
}

async function getTransactions(categories) {
    const categoriesStr = categories.join(",");
    try {
        let resp = await fetch(`${server.address}/transactions?categories=${categoriesStr}`);
        return await resp.json()
    } catch (err) {
        console.error(`error: ${err}`);
        return;
    }
}

// details buttons

function clickOnDetailsButtonEventListener() {
    clickOnDetailsButtonEvent(this.id);
}

async function clickOnDetailsButtonEvent(elementID) {
    const analysisObjectIndex = elementID.split("ao_btnDetails_id_")[1] - 1;
    console.log(`ANALYSIS OBJECT ON INDEX '${analysisObjectIndex}' WAS SELECTED!!!`);
    const aod = new AnalysisObjectDetails(analysisObjects[analysisObjectIndex])
    aod.setTransactions();
    setAnalysisDetailsCategories(JSON.stringify(aod));
    document.location.href = analysisDetailsPageRelativePath;
}

function addClickOnDetailsButtonEventListener() {
    for (let i = 0; i < analysisObjects.length; i++) {
        let detailsBtnID = `ao_btnDetails_id_${i + 1}`;
        document.getElementById(detailsBtnID).addEventListener('click', clickOnDetailsButtonEventListener);
    }
}

main() // initial run
