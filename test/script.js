import { getPage } from "../modules/pages.js";
import { drawDebitTransactionsTable } from "../modules/debit-transactions.js";

function main() {
    drawDebitTransactionsTable(getPage().entity, getPage().type);
}

main() // initial run
