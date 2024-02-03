import { pages, getPage } from "./pages.js";

function drawHeader() {
    let h = "";

    pages.forEach(p => {
        if (p.id == getPage().id) {
            h += `<nav class="navbar bg-primary" data-bs-theme="dark">`;
            h += `<div class="container-fluid">`;
            h += `<a class="navbar-brand" href="#">${p.title}</a>`;
            h += `</div>`;
            h += `</nav>`;
            return
        }
    });

    document.getElementById("header").innerHTML = h;
}

export {drawHeader};
