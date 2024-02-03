import { server } from "../modules/backend.js";
import { getEntityToDisplay, getTypeToDisplay } from "../modules/pages.js";

let balances, balancesTotal;

class Balance {
    constructor(e, t, b) {
        this.entity = e;
        this.type = t;
        this.balance = b;
    }
}

async function drawBalancesPage() {
    let table = "";

    table += `<table id="bt" class="table table-bordered">`;
    table += `<thead id="bth">`;
    table += `<th id="bthe">Entity</th>`;
    table += `<th id="btht">Type</th>`;
    table += `<th id="bthb">Balance</th>`;
    table += `</thead>`;
    table += `<tbody id="btb"></tbody>`;
    table += `</table>`;

    document.getElementById("balancesTable").innerHTML = table;

    await updateTable();

    let total = `<h1>TOTAL: ${Number.parseFloat(balancesTotal).toFixed(2)} €</h1>`;
    document.getElementById("balancesTotal").innerHTML = total;

}

async function updateTable() {
    balances = await getBalances();
    if (balances == undefined) {
        return;
    }
    balances = balances.filter(b => {
        return !(b.entity == "test" && b.type == "bank_account_debit")
    });
    renderTable();
}

async function getBalances() {
    try {
        let resp = await fetch(`${server.address}/entities`);
        return await resp.json();
    } catch (err) {
        console.error(`error: ${err}`);
        return;
    }
}

async function renderTable() {
    if (balances.length == 0) {
        return;
    }
    let rows = "";
    balancesTotal = 0.00;

    for (let i = 0; i < balances.length; i++) {
        const bObj = new Balance(balances[i].entity, balances[i].type, balances[i].balance);
        balancesTotal += Number.parseFloat(bObj.balance);

        rows += "<tr>";
        rows += `<td id="btr${i + 1}_td_e">${getEntityToDisplay(bObj.entity)}</td>`;
        rows += `<td id="btr${i + 1}_td_t">${getTypeToDisplay(bObj.type, bObj.entity)}</td>`;
        rows += `<td id="btr${i + 1}_td_b">${Number.parseFloat(bObj.balance).toFixed(2)} €</td>`;
        rows += "</tr>";
    }

    document.getElementById("btb").innerHTML = rows;
}

export { drawBalancesPage };
