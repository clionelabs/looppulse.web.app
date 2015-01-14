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
                    "total": 3268,
                    "title": "CURRENT",
                    "leftContent": "5,691",
                    "leftTitle": "max. daily",
                    "rightContent": "+10%",
                    "rightTitle": "since last week",
                    percentage: [0.29]//array because need to cater "related top 3" in detail view
                },
                interested: {
                    "total": 674,
                    "title": "INTERESTED",
                    "leftContent": "5,691",
                    "leftTitle": "total unique",
                    "rightContent": "-23%",
                    "rightTitle": "since last week",
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
        var pieFunc = d3.layout.pie().sort(null).value(function (d) {
            return d;
        }).endAngle(_endAngle);
        return pieFunc(data.percentage);
    };

    var textTween = function(d) {
        var iFunc = d3.interpolate(this.textContent, d);
        return function(t) {
            this.textContent = iFunc(t);
        }
    };

    var numTween = function(d) {
        var iFunc = d3.interpolate(0, d);
        return function(t) {
            this.textContent = _.str.numberFormat(iFunc(t), 0);
        }

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
            return colors[i];
        })
        .attr("transform", "translate(" + circleWidth / 2 + "," + circleHeight / 2 + ")")
    path.transition().duration(1000).attrTween("d", arcTween);
    path.exit().remove();

    var gaugeInfo = gauge.select("div.info");

    var totalText = gaugeInfo
        .selectAll("div.total")
        .data([data.total]); //convert to array because of d3 convention
    totalText.transition().duration(1000)
        .tween("text", numTween);
    totalText.exit().remove();

    var titleText = gaugeInfo
        .selectAll("div.title")
        .data([data.title]); //convert to array because of d3 convention
    titleText.transition().duration(1000)
        .tween("text", textTween);
    titleText.exit().transition().duration(1000).remove();


    var rightContentText = gaugeInfo
        .selectAll("div.pull-right.subContent")
        .data([data.rightContent]); //convert to array because of d3 convention

    rightContentText
        .classed("plus", function (d) { return d[0] === '+'; })
        .classed("minus", function(d) { return d[0] === '-'; })
        .text(function (d) {
            return d;
        });

    var leftContentText = gaugeInfo
        .selectAll("div.pull-left.subContent")
        .data([data.leftContent]); //convert to array because of d3 convention

    leftContentText
        .classed("plus", function (d) { return d[0] === '+'; })
        .classed("minus", function(d) { return d[0] === '-'; })
        .text(function (d) {
            return d;
        });

    var rightTitleText = gaugeInfo
        .selectAll("div.pull-right.subTitle")
        .data([data.rightTitle]); //convert to array because of d3 convention
    rightTitleText
        .text(function (d) { return d; });

    var leftTitleText = gaugeInfo
        .selectAll("div.pull-left.subTitle")
        .data([data.leftTitle]); //convert to array because of d3 convention

    leftTitleText
        .text(function (d) { return d; });
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