// Definition de la taille du svg
const margin = {top: 40, right: 20, bottom: 20, left: 80};
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
    
    
    
    const adjancencymatrix = createAdjacencyMatrix(data.nodes, data.links,undefined,true);
    const maxWeigth = d3.max(adjancencymatrix, d => {
        return parseInt(d.weight);
    })

    var positionsPersonnages =
        d3.range(data.nodes.length);	// un tableau d'autant d'element que de personnages
// [0, 1, ..., 106]

    var echellexy = d3.scaleBand()
        .domain(positionsPersonnages)
        .range([0,width])
        .paddingInner(0.1)
        .align(0)
        .round(true);

    console.log(echellexy);
    var zoneScale = d3.scaleOrdinal(d3.schemeCategory10);

    var scale = d3.scaleQuantize()
        .domain([0, maxWeigth])
        .range(d3.schemeBlues[9]);


    var matrixViz = svg.selectAll("rect")
        .data(adjancencymatrix)
        .join("rect")
        .attr("width", echellexy.bandwidth())
        .attr("height", echellexy.bandwidth())
        .attr("x", function (d) {
            return d.x * echellexy.bandwidth();
        })
        .attr("y", function (d) {
            return d.y * echellexy.bandwidth();
        })
        .style("stroke-width", ".2px")
        .style("fill",function (d){
            if (d.zone_s == d.zone_t){return zoneScale(d.zone_t)}
            else {return "#eee"}
        })
        .style("opacity", function (d) {
            return d.weight*10*100/maxWeigth + "%";
        })

    var labels = d3.select("svg")
        .append("g")
        .attr("transform", "translate(88, 35)")
        .style("font-size", "8px")
        .style("font-family", "sans-serif");

    var columns = labels
        .append("g")
        .selectAll()
        .data(data.nodes)
        .join("text")
        .html( function(d){return d.character})
        .attr("y",function(d){return d.id*echellexy.bandwidth()})
        .attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°

    var rows = labels
        .append("g")
        .selectAll()
        .data(data.nodes)
        .join("text")
        .html(function(d){return d.character})
        .attr("y",function(d){return (d.id+1)*echellexy.bandwidth()})
        .attr("x",-40)

    var orders = {
        appearances: d3.range(positionsPersonnages).sort((a, b) => {
            return d3.ascending(data.nodes[a].id, data.nodes[b].id);
        }),
        zone: d3.range(positionsPersonnages).sort((a, b) => {
            return data.nodes[b].zone - data.nodes[a].zone;
        }),
        influences: d3.range(positionsPersonnages).sort((a, b) => {
            console.log(data.nodes[b])
            return data.nodes[b].influence - data.nodes[a].influence;
        })
    };

    function update(newPosition){
        console.log(newPosition)

        echellexy.domain(newPosition)
        console.log(echellexy(0))
        console.log(echellexy(3))

        rows.transition().duration(2500)
            .delay(function(d, i) { return echellexy(i) ; })
            .attr("transform", function(d,i){
                console.log("d : " + d)
                console.log("i : " + i)
                console.log(echellexy(i))
                return  "translate(0," + echellexy(i) + ")";
            })
        columns.transition().duration(2500)
            .delay(function(d, i) { return echellexy(i) ; })
            .attr("dy", function(d, i) { return  echellexy(i) })
        console.log("HELOO")
        matrixViz.selectAll("rect").transition().duration(2500)
            .delay(function(d) {
                console.log(d.x)
                return echellexy(d.x) * 4 ; })
            .attr("x", function(d) {
                console.log(d.x)
                return echellexy(d.x); })
            .attr("y", function (d) { return echellexy(d.y)})
    }

    d3.select("#mySelect").on("change",function(e){
        var val_text = document.getElementById("mySelect").value;
        if(val_text === "influences_val"){update(influences)}
        if(val_text === "zones_val" ){update(zones)}
        if(val_text === "appearances_val"){update(appearances)}
    })
})




