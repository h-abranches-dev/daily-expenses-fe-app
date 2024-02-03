import { pages, getPage } from "./pages.js";

function drawNavBar() {
    let nav = "<br><br>";
    let pageID = getPage().id;

    for (const p of pages) {
        if (!p.showInNavBar) {
            continue;
        }

        let dirPath;
        if (pageID == "Home" && p.id == "Home") {
            dirPath = ".";
        } else if (pageID == "Home" && p.id != "Home") {
            dirPath = `./${p.id.toLowerCase()}`;
        } else if (pageID != "Home" && p.id == "Home") {
            dirPath = "..";
        } else if (pageID != "Home" && p.id != "Home" && p.id == pageID) {
            dirPath = ".";
        } else if (pageID != "Home" && p.id != "Home" && p.id != pageID) {
            dirPath = `../${p.id.toLowerCase()}`;
        }

        nav += `<a href="${dirPath}/index.html">`;
        nav += `<button id="${p.id.toLowerCase()}_button">${p.id}</button>`;
        nav += `</a>`;
    }
    nav += `<br><br>`;

    if (document.getElementById("nav") != null) {
        document.getElementById("nav").innerHTML = nav;
    }
    if (document.getElementById("nav2") != null) {
        document.getElementById("nav2").innerHTML = nav;
    }
}

export { drawNavBar };
