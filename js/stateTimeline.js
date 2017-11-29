class StateTimeline {

    update(stateSelected){
        console.log(stateSelected);
        d3.csv("data/summary_data.csv", function (error, csvData) {
            // self.electoralVoteChart.update(csvData,self.colorScale);
            // self.votePercentageChart.update(csvData,self.colorScale);
            // self.tileChart.update(csvData,self.colorScale);
            console.log(csvData);
        });

    }

}