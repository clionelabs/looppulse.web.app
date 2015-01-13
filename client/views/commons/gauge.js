/**
 * Template functions related to template "gauge"
 */
Template.gauge.rendered = function() {

    var width = 292;
    var height = width;

    var circleWidth = 240;
    var circleHeight = circleWidth;

    //TODO maybe merge to demoData to support color + number pair?
    var colorsMulti = ["#1A48AF", "#3D78FB", "#82BCFF", "#BCDBFF"];
    var colorsSingle = ["#3D78FB"];
    var convertToPieData = function(data) {
        var _totalPercentage = _.reduce(data.percentage, function(memo, d) {
        return memo + d;
        }, 0);
        var _endAngle = _totalPercentage * Math.PI * 2;
        var pieFunc = d3.layout.pie().value(function(d) {
        return d;
        }).endAngle(_endAngle);
        return pieFunc(data.percentage);
    };


    /*TODO remove Demo Data*/
    var demoData = {
        "total" : "3,268",
        "title" : "INTERESTED",
        "change" : "10",
        "delta" : true,
        percentage : [0.29]//array because need to cater "related top 3" in detail view
    };
    /*TODO remove END DemoData*/

    var self = this;
    var model = demoData; //TODO replace with realData
    var colors = model.percentage.length > 1 ? colorsMulti : colorsSingle;

    var gauge = d3.select("div.gauge");
    var gaugeInfo = gauge.select("div.info");

    var svg = gauge.selectAll("svg.circular");
    var circular = svg.select("g.circle");

    var arc = d3.svg.arc()
            .outerRadius(circleWidth / 2)
            .innerRadius((circleWidth / 2) - 10);

    var path = circular.selectAll("path")
            .data(convertToPieData(model))
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", function(d,i) { return colors[i]; })
            .attr("transform", "translate(" + circleWidth / 2 + "," + circleHeight / 2 + ")");

    var totalText = gaugeInfo
                        .selectAll("div.total")
                        .data([model]) //convert to array because of d3 convention
                        .enter()
                        .append("div")
                        .attr("class", "text total")
                        .text(function(d) { return d.total; });

    var titleText = gaugeInfo
        .selectAll("div.title")
        .data([model]) //convert to array because of d3 convention
        .enter()
        .append("div")
        .attr("class", "text title")
        .text(function(d) { return d.title; });


    var changeText = gaugeInfo
        .selectAll("div.change")
        .data([model]) //convert to array because of d3 convention
        .enter()
        .append("div")
        .attr("class", function(d) { return "text change " + (d.delta ? "plus" : "minus"); })
        .text(function(d) { return d.change + "%"; });

};

Template.gauge.events({
    "click #gauge-heart": function(e) {
        var heart = $(e.currentTarget);
        heart.toggleSVGClass("active");
        //Is it right way to do?
        Template.pois.swipe(heart.hasSVGClass("active"));
    }
});