class Map {
    constructor() {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 };
        this.margin = { top: 30, right: 10, bottom: 10, left: 10 },
        this.width = 960 - this.margin.left - this.margin.right-230,
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.color = d3.scale.linear().range(["#fc9272", "#de2d26","#860308","#860308"]);
    }

    drawChart() {
        // append tooltip div to body
        var domainList = [];
        /* for (var key in selectionForMapColor) {
            domainList.push(selectionForMapColor[key]);
        } */
        var div = d3.select("#mapLine").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        var svg = d3.select("#map").append("svg")
            .attr("id","us-map")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    
        //create geoAlbersUsa projection for US map
        var projection = d3.geo.albersUsa()
            .translate([this.width / 2, this.height / 2])
            .scale([1000]);
    
        var path = d3.geo.path()
            .projection(projection);

        //var color = d3.scale.linear().range(["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"]).domain([0,40]);
        d3.json("data/us-map.json", (error, json) => {
            if (error) throw error;
            d3.csv("data/cumulative_data.csv", (stateData) => {
                if (error) throw error;
                /* color.domain([
                    d3.min(domainList),
                    d3.max(domainList)
                ]); */

                var dataLookup = {};
                stateData.forEach(function (stateRow) {
                    // d3.csv will read the values as strings; we need to convert them to floats
                    dataLookup[stateRow.state] = parseFloat(stateRow.deaths);
                });
                json.features.forEach(function (feature) {
                    feature.properties.value = dataLookup[feature.properties.name];
                });
                var mapDesign = svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    // here we use the familiar d attribute again to define the path
                    .attr("d", path)
                    .attr("id", (d) => { return d.properties.name.replace(/\s+/, ""); })
                    .on("mouseover", (d) => {
                        //append name of the state to tooltip div and setting it's cordinates and opacity
                        div.html(d.properties.name)
                            .style("left", (d3.event.pageX - 20) + "px")
                            .style("opacity", 0.7)
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", () => {
                        div.style("opacity", 0);
                    })
                    .on("click", (d) => {
                        var stateName = d.properties.name;
                        var fileSelected = "data/" + stateName + ".csv";
                        var statechart = new StateTimeline();
                        statechart.update(fileSelected);
                    });
                   this.fillStates(dataLookup);
            });
            let sankeyChart = new SankeyChart();
            sankeyChart.initializaStates();
        });
    }

    fillStates(statesCount) {
        let domain = [];
        for(var key in statesCount) {
            domain.push(statesCount[key]);
        }
        this.color.domain(d3.extent(domain));
        Object.keys(statesCount).forEach(key => {
            let id = "#" + key.replace(/\s+/, "");
            d3.select(id).style("fill",() => {return this.color(statesCount[key])});
        });
    }
}
