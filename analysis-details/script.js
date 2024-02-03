import { drawCategoriesInDiv } from "../modules/categories.js";
import { getAnalysisDetailsCategories } from "../modules/analysis.js";

let analysisObjectDetails;

function main() {
    analysisObjectDetails = JSON.parse(getAnalysisDetailsCategories());

    let categories = drawCategoriesInDiv(analysisObjectDetails.categories);
    document.getElementById("aodCategories").innerHTML = categories;
    let total = `<h1>TOTAL: ${Number.parseFloat(analysisObjectDetails.total).toFixed(2)} €</h1>`;
    document.getElementById("aodTotal").innerHTML = total;

    drawAnalysisObjectDetailsTable();
}

async function drawAnalysisObjectDetailsTable() {
    let t = "";

    t += `<table id="aodTable" class="table table-bordered">`;
    t += `<thead id="aodTableHead">`;
    t += `<th id="aodTableThTransactionDate">Transaction Date</th>`;
    t += `<th id="aodTableThTransaction">Transaction</th>`;
    t += `<th id="aodTableThAmount">Amount</th>`;
    t += `</thead>`;
    t += `<tbody id="aodTableBody"></tbody>`;
    t += `</table>`;

    document.getElementById('aodTableDiv').innerHTML = t;
    renderTable();
}

async function renderTable() {
    const transactions = analysisObjectDetails.transactions;
    console.log(transactions);

    if (transactions.length == 0) {
        return;
    }
    let rows = "";

    for (let i = 0; i < transactions.length; i++) {
        rows += "<tr>";
        rows += `<td id="aodtr${i + 1}_td_td">${transactions[i].date}</td>`;
        rows += `<td id="aodtr${i + 1}_td_t">${transactions[i].transaction}</td>`;
        rows += `<td id="aodtr${i + 1}_td_a">${transactions[i].amount} €</td>`;
        rows += "</tr>";
    }

    document.getElementById("aodTableBody").innerHTML = rows;
}


main() // initial run
