class TimeLine {
    constructor () {
        var selectionForMapColor;
    }
    drawChart() {
        var self = this;
        var svg = d3.select("#timeline"),
            margin = { top: 20, right: 0, bottom: 30, left: 70 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var y = d3.scale.linear()
            .range([height, 0]);

        var x = d3.scale.ordinal().rangeRoundBands([width, 0])//.padding(0.1);

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");


        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right");

        var line = d3.svg.line()
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y(d.deaths); });

            svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("data/summary_data.csv", function (d) {
            d.year = +parseInt(d.year);
            d.deaths = +d.deaths;
            //console.log(d.date+" deaths => "+d.deaths);
            return d;
        }, function (error, data) {
            if (error) throw error;

            //x.domain(d3.extent(data, function(d) { return d.year; }));
            x.domain(data.map(function (d) { return d.year; }));

            y.domain(d3.extent(data, function (d) { return d.deaths; }));

            svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(-16," + height + ")")   //here used 18 to calibrate line chart wit x-axis ticks
          .call(xAxis).selectAll('text').attr("transform", "rotate(-90)").attr("x",-20).attr("y",-5);


        svg.append("g")
          .attr("class", "y axis").attr("y",-50)
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Death Rate").attr("x",-20).attr("y",50);

     var symbol = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style({"stroke":"steelblue", "stroke-width":"1.5px", "fill":"none"});

        });

        svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(x)
                //.on("brushstart", brushstart)
                .on("brush", brushmove))
                //.on("brushend", brushend))
            .selectAll("rect")
            .attr("height", height);

       var brush =   d3.svg.brush().x(x).on("brush",brushmove);


        function brushmove() {
            var s = d3.event.target.extent();
            console.log(s);
             var selected =  x.domain()
                .filter(function(d){return (s[0] <= x(d)) && (x(d) <= s[1])});


            console.log(selected);
            var brushedData = {};

            d3.csv("data/cumulative_shooting_state.csv", function(error, data) {
                if (error) throw error;

                var ref_dict = {};
                data.forEach(function(d) {
                    //console.log(d);
                    if(!(ref_dict.hasOwnProperty(d.year))) {
                        var temp_dict = {};
                        temp_dict[d.State] = d.sum;
                        ref_dict[d.year] = temp_dict;
                    }
                    else {
                        ref_dict[d.year][d.State] = d.sum;
                    }
                })
                function sumObjectsByKey() {
                    return Array.from(arguments).reduce((a, b) => {
                        for (let k in b) {
                        if (b.hasOwnProperty(k))
                            a[k] = parseInt(a[k] || 0) + parseInt(b[k]);
                    }
                    return a;
                }, {});
                }

                var selectedArray = [];
                selected.forEach(function(d){
                    selectedArray.push(ref_dict[d]);
                });
                console.log("my array ",selectedArray)
                
                self.selectionForMapColor = sumObjectsByKey.apply(window, selectedArray);
                self.passsDataToMap(self.selectionForMapColor);
            });
        }
    }
     passsDataToMap(){
        console.log("data here",this.selectionForMapColor);
        var map = new Map();
        map.drawChart(this.selectionForMapColor);
    }
}