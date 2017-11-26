class Map {
    constructor() {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 };
        this.margin = { top: 30, right: 10, bottom: 10, left: 10 },
        this.width = 960 - this.margin.left - this.margin.right,
        this.height = 500 - this.margin.top - this.margin.bottom;
    }

    // drawChart() {
    //     // append tooltip div to body
    //     var div = d3.select("body").append("div")
    //         .attr("class", "tooltip")
    //         .style("opacity", 0);
    //
    //     var svg = d3.select("body").append("svg")
    //         .attr("id","us-map")
    //         .attr("width", this.width + this.margin.left + this.margin.right)
    //         .attr("height", this.height + this.margin.top + this.margin.bottom)
    //         .append("g")
    //         .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    //
    //     //create geoAlbersUsa projection for US map
    //     var projection = d3.geo.albersUsa()
    //         .translate([this.width / 2, this.height / 2])
    //         .scale([1000]);
    //
    //     var path = d3.geo.path()
    //         .projection(projection);
    //
    //     d3.json("data/us-map.json", (error, us) => {
    //         if (error) throw error;
    //         var g = d3.select("#us-map")
    //             .selectAll("g")
    //             .data(us.features)
    //             .enter()
    //             .append("g");
    //         //markout all cordinates from csv file
    //         g.append("path")
    //             .attr("d", path)
    //             .on("mouseover", (d) => {
    //                 //append name of the state to tooltip div and setting it's cordinates and opacity
    //                 div.html(d.properties.name)
    //                     .style("left", (d3.event.pageX - 20) + "px")
    //                     .style("opacity", 0.7)
    //                     .style("top", (d3.event.pageY - 28) + "px");
    //             })
    //             .on("mouseout", () => {
    //                 div.style("opacity", 0);
    //             });
    //         let parallelChart = new ParallelChart();
    //         parallelChart.drawChart();
    //     });
    // }

        drawChart(){
                var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                var svg = d3.select("body").append("svg")
                    .attr("id","us-map")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

            var projection = d3.geo.albersUsa()
                .translate([this.width / 2, this.height / 2])
                .scale([700]);

            var path = d3.geo.path()
                .projection(projection);

            // Define a quantized scale to sort data values into buckets of color
            var color = d3.scale.linear()
                .range(["#edf8fb",
                    "#b2e2e2",
                    "#66c2a4",
                    "#2ca25f",
                    "#006d2c"]);

            // Load in GeoJSON data
            d3.json("data/us-map.json", function (json) {
                // Load in the agriculture data; note that, unlike the city data,
                // we have to do this AFTER we've already loaded the GeoJSON data
                d3.csv("data/cumulative_data.csv", function (stateData) {
                    // Set input domain for color scale based on the lowest and highest values in the data
                    color.domain([
                        d3.min(stateData, function (d) {
                            return d.deaths;
                        }),
                        d3.max(stateData, function (d) {
                            return d.deaths;
                        })
                    ]);

                    // Convert the data array to an object, so that it's easy to look up
                    // data values by state names
                    var dataLookup = {};
                    stateData.forEach(function (stateRow) {
                        // d3.csv will read the values as strings; we need to convert them to floats
                        dataLookup[stateRow.state] = parseFloat(stateRow.deaths);
                    });

                    // Now we add the data values to the geometry for every state
                    json.features.forEach(function (feature) {
                        feature.properties.value = dataLookup[feature.properties.name];
                    });

                    // Bind data and create one path per GeoJSON feature
                    svg.selectAll("path")
                        .data(json.features)
                        .enter()
                        .append("path")
                        // here we use the familiar d attribute again to define the path
                        .attr("d", path)
                        .style("fill", function (d) {
                            return color(d.properties.value);
                        }) .on("mouseover", (d) => {
                                        //append name of the state to tooltip div and setting it's cordinates and opacity
                                        div.html(d.properties.name)
                                            .style("left", (d3.event.pageX - 20) + "px")
                                            .style("opacity", 0.7)
                                            .style("top", (d3.event.pageY - 28) + "px");
                                    })
                                    .on("mouseout", () => {
                                        div.style("opacity", 0);
                                    });
                });
            });
            let parallelChart = new ParallelChart();
                    parallelChart.drawChart();

        }
}