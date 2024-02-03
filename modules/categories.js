function drawCategoriesInTableCell(id, cs) {
    let categoriesLabels = "";
    cs.forEach(c => {
        categoriesLabels += `<div>${c}</div>`
    });
    return `<td id="${id}" class="categories">${categoriesLabels}</td>`;
}

function drawCategoriesInDiv(cs) {
    let categoriesLabels = "";
    cs.forEach(c => {
        categoriesLabels += `<div>${c}</div>`
    });
    return `<div class="categories">${categoriesLabels}</div>`;
}

export { drawCategoriesInTableCell, drawCategoriesInDiv };
