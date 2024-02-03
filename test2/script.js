import { getPage } from "../modules/pages.js";
import { drawDebitCreditTransactionsTable } from "../modules/debit-credit-transactions.js";

function main() {
    drawDebitCreditTransactionsTable(getPage().entity, getPage().type);
}

main() // initial run
