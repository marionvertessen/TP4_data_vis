// Definition de la taille du svg
const margin = {top: 0, right: 30, bottom: 20, left: 10};
const width = 960;
const height = 960;

// Ajout du svg dans la div avec l'id "matrice" dans la page HTML
var svg = d3
    .select("#visu-tp4")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("got_social_graph.json").then(data => {
    const adjancencymatrix = createAdjacencyMatrix(data.nodes, data.links);
    const maxWeigth = d3.max(adjancencymatrix, d => {
        return parseInt(d.weight);
    })
    console.log(maxWeigth)
    var scale = d3.scaleQuantize()
        .domain([0, maxWeigth])
        .range(d3.schemeBlues[9]);

    console.log(adjancencymatrix[1])
    matrixViz = svg.selectAll("rect")
        .data(adjancencymatrix)
        .join("rect")
        .attr("width", 5)
        .attr("height", 5)
        .attr("x", function (d) {
            return d.x * 5;
        })
        .attr("y", function (d) {
            return d.y * 5;
        })
        .style("stroke-width", ".2px")
        .style("fill", function (d) {
            return scale(d.weight);
        })
    var positionsPersonnages =
        d3.range(data.nodes.length);	// un tableau d'autant d'element que de personnages
// [0, 1, ..., 106]
    var echellexy = d3.scaleBand()
        .range([0,width]) // TODO correspond [0, largeur du dessin]
        .domain(positionsPersonnages)
        .paddingInner(0.1)
        .align(0)
        .round(true);

    var labels = d3.select("svg")
        .append("g")
        .attr("transform", "translate(60, 60)")
        .style("font-size", "8px")
        .style("font-family", "sans-serif");

    var columns = labels
        .append("g")
        .selectAll()
        .data(data.nodes)
        .join("text")
        .attr("x", (d, i) => d.name_s)
        .attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°

    var rows = labels
        .append("g")
        .selectAll()
        .data(data.nodes)
        .join("text")
        .attr("x", (d,i) => d.name_t)

})




