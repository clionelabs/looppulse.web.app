/**
 * Template functions related to template "gauge"
 */
Template.gauge.rendered = function() {

    var self = new GaugeData(this);
    Template.gauge.updateGauge(self.tmplToGauge().current);
};

GaugeData = function(data) {
    return _.extend({}, data, {
        tmplToGauge: function () {
            /*TODO remove Demo Data*/
            var demoData = {
                current: {
                    "total": "3,268",
                    "title": "CURRENT",
                    "left-content": "5,691",
                    "left-title": "max. daily",
                    "right-content": "+10%",
                    "right-title": "since last week",
                    percentage: [0.29]//array because need to cater "related top 3" in detail view
                },
                interested: {
                    "total": "666",
                    "title": "INTERESTED",
                    "left-content": "5,691",
                    "left-title": "total unique",
                    "right-content": "-23%",
                    "right-title": "since last week",
                    percentage: [0.14, 0.12, 0.05, 0.08]//array because need to cater "related top 3" in detail view

                }
            };
            /*TODO remove END DemoData*/
            var model = demoData;
            return model;
        }
    });

}

/**
 *
 * @param data
 */
Template.gauge.updateGauge = function(data) {

    var width = 292;
    var height = width;

    var circleWidth = 240;
    var circleHeight = circleWidth;

    //TODO maybe merge to demoData to support color + number pair?
    var colorsMulti = ["#1A48AF", "#3D78FB", "#82BCFF", "#BCDBFF"];
    var colorsSingle = ["#3D78FB"];
    var convertToPieData = function (data) {
        var _totalPercentage = _.reduce(data.percentage, function (memo, d) {
            return memo + d;
        }, 0);
        var _endAngle = _totalPercentage * Math.PI * 2;
        var pieFunc = d3.layout.pie().value(function (d) {
            return d;
        }).endAngle(_endAngle);
        console.log(pieFunc(data.percentage));
        return pieFunc(data.percentage);
    };

    var arcTween = function(d) {
        var iFunc = d3.interpolate({startAngle: 0, endAngle : 0 }, d);
        return function (t) {
            return arc(iFunc(t));
        }
    };

    var colors = data.percentage.length > 1 ? colorsMulti : colorsSingle;

    var gauge = d3.select("div.gauge");

    var svg = gauge.selectAll("svg.circular");
    var circular = svg.select("g.circle");

    var arc = d3.svg.arc()
        .outerRadius(circleWidth / 2)
        .innerRadius((circleWidth / 2) - 10);

    var path = circular.selectAll("path")
        .data(convertToPieData(data));
        path.enter().append("path");

    path.attr("fill", function (d, i) {
            console.log(i + " " + colors[i]);
            return colors[i];
        })
        .attr("transform", "translate(" + circleWidth / 2 + "," + circleHeight / 2 + ")")

    path.transition().duration(1000).attrTween("d", arcTween);
    path.exit().remove();

    var gaugeInfo = gauge.select("div.info");
    var totalText = gaugeInfo
        .selectAll("div.total")
        .data([data]); //convert to array because of d3 convention
    totalText
        .enter()
        .append("div")
        .attr("class", "text total");
    totalText
        .text(function (d) {
            console.log(d.total);
            return d.total;
        });
    totalText.exit().remove();

    var titleText = gaugeInfo
        .selectAll("div.title")
        .data([data]) //convert to array because of d3 convention
        .enter()
        .append("div")
        .attr("class", "text title")
        .text(function (d) {
            return d.title;
        });


    var changeText = gaugeInfo
        .selectAll("div.change")
        .data([data]) //convert to array because of d3 convention
        .enter()
        .append("div")
        .attr("class", function (d) {
            return "text change " + (d.deta ? "plus" : "minus");
        })
        .text(function (d) {
            return d.change + "%";
        });

}

Template.gauge.events({
    "click #gauge-heart": function(e, tmpl) {
        var heart = $(e.currentTarget);
        Template.pois.swipe(heart.hasSVGClass("active"));
        Session.set("isHeartActive", heart.hasSVGClass("active"));
        var isHeartActive = Session.get("isHeartActive");
        var selectedData = isHeartActive ? "interested" : "current";
        var gaugeData = new GaugeData(tmpl.data);
        Template.gauge.updateGauge(gaugeData.tmplToGauge()[selectedData]);
    }
});

/**
 * @param elem JQuery Object of a SVG element
 */
Template.gauge.toggleActive = function(elem) {
    elem.toggleSVGClass("active");
}