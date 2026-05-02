console.log("IT’S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// ===== Pages list =====
let pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "resume/", title: "CV" },
    { url: "contact/", title: "Contact" },
    { url: "https://github.com/holam1202", title: "GitHub" }
];

// ===== Create nav =====
let nav = document.createElement("nav");
document.body.prepend(nav);

// ===== Base path =====
const BASE_PATH =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "/"
        : "/portfolio/";

// ===== Build nav =====
for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !url.startsWith("http") ? BASE_PATH + url : url;

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;

    a.classList.toggle(
        "current",
        a.host === location.host && a.pathname === location.pathname
    );

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
}

// ===== Theme switch =====
document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);

// ===== Theme change =====
let select = document.querySelector(".color-scheme select");

select.addEventListener("input", function (event) {
    document.documentElement.style.setProperty(
        "color-scheme",
        event.target.value
    );

    localStorage.colorScheme = event.target.value;
});

// ===== Load saved theme =====
if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty(
        "color-scheme",
        localStorage.colorScheme
    );

    select.value = localStorage.colorScheme;
}

// ===== Contact form =====
let form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
    event.preventDefault();

    let data = new FormData(form);

    let url = form.action + "?";

    for (let [name, value] of data) {
        url += name + "=" + encodeURIComponent(value) + "&";
    }

    url = url.slice(0, -1);

    location.href = url;
});

// ===== Fetch JSON =====
export async function fetchJSON(url) {

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {

        console.error("Error fetching or parsing JSON data:", error);

    }
}

// ===== Render Projects =====
export function renderProjects(
    projects,
    containerElement,
    headingLevel = "h2"
) {

    containerElement.innerHTML = "";

    for (let project of projects) {

        const article = document.createElement("article");

        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
            <p class="project-year">${project.year}</p>
        `;

        containerElement.appendChild(article);
    }
}