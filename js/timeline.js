class TimeLine {
    constructor () {}
    drawChart() {
        var svg = d3.select("#timeline"),
            margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //var parseTime = d3.timeParse("%x");

        // var x = d3.scaleLinear()
        //     .rangeRound([0, width]);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var x = d3.scale.ordinal().rangeRoundBands([width, 0],0.1)//.padding(0.1);

        var line = d3.svg.line()
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y(d.deaths); });

        d3.csv("data/summary_data.csv", function (d) {
            d.year = +parseInt(d.year);
            d.deaths = +d.deaths;
            //console.log(d.date+" deaths => "+d.deaths);
            return d;
        }, function (error, data) {
            if (error) throw error;

            // x.domain(d3.extent(data, function(d) { return parseInt(d.year); }));
            d3.select("#xAxis").attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            x.domain(data.map(function (d) { return d.year; }));
            y.domain(d3.extent(data, function (d) { return d.deaths; }));

            let xAxis = g.append("g")
                .attr("transform", "translate(0," + height + ")").attr("id", "brush_g")
                .call(d3.svg.axis().scale(x).orient("bottom"));


            let yAxis = g.append("g")
                .call(d3.svg.axis().scale(y).orient("left"))
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Deaths (Count)");

            let lineChart = g.append("path")
                .datum(data)
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

        var brush = d3.svg.brush().x(x).extent([[10, 475], [width, 495]]).on("brush", brushed);
        d3.select("#timeline").append("g").attr("class", "brush").call(brush);


        function brushed() {
            //let selectedStates = [];
            //let selectedData = d3.event.selection;

            //var yearBrush = line.data();
            //console.log(line.data());
            // console.log(selectedData);
            // yearBrush.forEach(function(d,i){

            //     console.log(d);
            //     let comp = xScale(i);
            //     if(comp>selectedData[0] && comp<selectedData[1]){
            //         selectedStates.push(d.YEAR);
            //     }

            // })
            console.log("selectedData");

            //self.shiftChart.update(selectedStates);

        }

    }
}