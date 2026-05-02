import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { fetchJSON, renderProjects } from "../global.js";

let projects = await fetchJSON("../lib/projects.json");

let projectsContainer = document.querySelector(".projects");
let searchInput = document.querySelector(".searchBar");

let selectedIndex = -1;
let query = "";

function getFilteredProjects() {
    return projects.filter((project) => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });
}

function updateDisplay() {
    let filteredProjects = getFilteredProjects();

    if (selectedIndex !== -1) {
        let rolledData = d3.rollups(
            filteredProjects,
            (v) => v.length,
            (d) => d.year
        );

        let data = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });

        let selectedYear = data[selectedIndex]?.label;

        if (selectedYear) {
            filteredProjects = filteredProjects.filter(
                (project) => project.year === selectedYear
            );
        }
    }

    renderProjects(filteredProjects, projectsContainer, "h2");
    renderPieChart(getFilteredProjects());
}

function renderPieChart(projectsGiven) {
    let svg = d3.select("#projects-pie-plot");
    let legend = d3.select(".legend");

    svg.selectAll("*").remove();
    legend.selectAll("*").remove();

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let pieGenerator = d3.pie().value((d) => d.value);
    let arcData = pieGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    arcs.forEach((arc, i) => {
        svg.append("path")
            .attr("d", arc)
            .attr("fill", colors(i))
            .attr("class", selectedIndex === i ? "selected" : "")
            .on("click", () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                updateDisplay();
            });

        legend.append("li")
            .attr("style", `--color:${colors(i)}`)
            .attr("class", selectedIndex === i ? "selected" : "")
            .html(`
                <span class="swatch"></span>
                ${data[i].label}
                <em>(${data[i].value})</em>
            `)
            .on("click", () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                updateDisplay();
            });
    });
}

searchInput.addEventListener("input", (event) => {
    query = event.target.value;
    selectedIndex = -1;
    updateDisplay();
});

updateDisplay();