class Map {
    constructor() {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 };
        this.margin = { top: 30, right: 10, bottom: 10, left: 10 },
        this.width = 960 - this.margin.left - this.margin.right-230,
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.color = d3.scale.linear().range(["#fcbba1","#860308","#860308"]).domain([0,165]);
    }

    drawChart() {
        // append tooltip div to body
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

        this.createLegend();
        
        d3.json("data/us-map.json", (error, json) => {
            if (error) throw error;
            d3.csv("data/cumulative_data.csv", (stateData) => {
                if (error) throw error;
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
                        let sankeyChart = new SankeyChart();
                        sankeyChart.initializaStates(d.properties.name);
                    });
                   this.fillStates(dataLookup);
            });
        });
    }

    fillStates(statesCount) {
        Object.keys(statesCount).forEach(key => {
            let id = "#" + key.replace(/\s+/, "");
            d3.select(id).style("fill",() => {return this.color(statesCount[key])});
        });
    }

    createLegend() {
        var legend_data = [ { key: 20, value: "#fcbba1"},
                            { key: 40, value: "#fc9272" },
                            { key: 60, value: "#fb6a4a" },
                            { key: 80, value: "#de2d26" },
                            { key: 100, value: "#a50f15" },
                            { key: 160, value: "#860308" }]

        var legend = d3.select("#legend").append("svg").attr("width",this.width).attr("height",150).selectAll("rect")
                       .data(legend_data).enter()
                       .append("rect")
                       .attr("x",function(d,i){
                          return i*100+100;
                       })
                       .attr("y",60)
                       .attr("width",100)
                       .attr("height",15)
                       .style("fill",(d) => {return d.value});

        d3.select("#legend").select("svg").selectAll("text").data(legend_data).enter().append("text")
            .attr("x", function(d,i) { return i*100+100; })
            .attr("y", 50)
            .attr("dy", ".35em")
            .text(function(d) { return d.key; }).style("fill","black");

    }
}
