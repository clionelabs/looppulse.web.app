/**
 * Template functions related to template "pois"
 */
Template.gauge.rendered = function() {

    var width = 240;
    var height = width;

    var colorsMulti = ["#1A48AF", "#3D78FB", "#82BCFF", "#BCDBFF"];
    var colorsSingle = ["#4A90E2"];
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

    var svg = d3.select("svg.circular");

    var arc = d3.svg.arc()
            .outerRadius(width / 2)
            .innerRadius((width / 2) - 10);


    console.log(convertToPieData(model));

    var path = svg.selectAll("path")
            .data(convertToPieData(model))
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", function(d,i) { return colors[i]; })
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

};