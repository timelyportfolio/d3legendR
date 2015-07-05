
d3.legend.size = function(){

  var scale = d3.scale.linear(),
    shape = "rect",
    shapeWidth = 15,
    shapeHeight = 15,
    shapeRadius = 10,
    shapePadding = 2,
    cells = [5],
    labels = [],
    useStroke = false,
    labelFormat = d3.format(".01f"),
    labelOffset = 10,
    orient = "vertical";


    function legend(svg){

      var type = scale.ticks ?
          d3_linearLegend(scale, cells, labelFormat) : scale.invertExtent ?
          d3_quantLegend(scale, labelFormat) : d3_ordinalLegend(scale);
      type.labels = d3_mergeLabels(type.labels, labels); //no support for ordinal?

      var cell = svg.selectAll(".cell").data(type.data),
        cellEnter = cell.enter().append("g", ".cell").attr("class", "cell").style("opacity", 1e-6);
        shapeEnter = cellEnter.append(shape).attr("class", "swatch"),
        shapes = cell.select("g.cell " + shape).data(type.data);

      cell.exit().transition().style("opacity", 0).remove();

      //creates shape
      if (useStroke){
        d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius);

        shapes.attr("stroke-width", type.feature);
      } else {
        d3_drawShapes(shape, shapes, type.feature, type.feature, type.feature);
      }


      //adds text
      cellEnter.append("text").attr("class", "label");
      svg.selectAll("g.cell text").data(type.labels)
        .text(function(d) { return d; });

      // sets placement
      var text = cell.select("text"),
        shapeSize = shapes[0].map(
          function(d, i){
            var bbox = d.getBBox()
            var stroke = scale(type.data[i]);

            if (useStroke && orient === "horizontal") {
              bbox.height = bbox.height + stroke/2;
            } else if (useStroke && orient === "vertical"){
              bbox.width = bbox.width + stroke/2;
            }

            return bbox;
        });

      //positions cells
      if (orient === "vertical"){
        cell.attr("transform",
          function(d,i) {
            var height = d3.sum(shapeSize.slice(0, i + 1 ), function(d){ return d.height; });
            return "translate(0, " + (height + i*shapePadding) + ")";
          })
         .transition().style("opacity", 1);

        text.attr("transform",
          function(d,i) {

            return "translate(" + (shapeSize[i].width + shapeSize[i].x + labelOffset) + "," +
              (shapeSize[i].y + shapeSize[i].height/2 + 5) + ")";
          });

      } else if (orient === "horizontal"){
        cell.attr("transform",
          function(d,i) {
            var width = d3.sum(shapeSize.slice(0, i + 1 ), function(d){ return d.width; });
            return "translate(" + (width + i*shapePadding) + ",0)";
          })
         .transition().style("opacity", 1);

        text.attr("transform",
          function(d,i) {
            return "translate(" + (shapeSize[i].width/2  + shapeSize[i].x) + "," + (shapeSize[i].height +
                + shapeSize[i].y + labelOffset + 8) + ")";
          })
          .style("text-anchor", "middle");
      }
    }



  legend.scale = function(_) {
    if (!arguments.length) return legend;
    scale = _;
    return legend;
  };

  legend.cells = function(_) {
    if (!arguments.length) return legend;
    if (_.length > 1 || _ >= 2 ){
      cells = _;
    }
    return legend;
  };

  legend.useStroke = function(_){
    if (!arguments.length) return legend;
    if (_ === true || _ === false){
      useStroke = _;
    }
    return legend;
  };

  legend.shape = function(_) {
    if (!arguments.length) return legend;
    shape = _;
    return legend;
  };

  legend.shapeWidth = function(_) {
    if (!arguments.length) return legend;
    shapeWidth = +_;
    return legend;
  };

  legend.shapeHeight = function(_) {
    if (!arguments.length) return legend;
    shapeHeight = +_;
    return legend;
  };

  legend.shapeRadius = function(_) {
    if (!arguments.length) return legend;
    shapeRadius = +_;
    return legend;
  };

  legend.shapePadding = function(_) {
    if (!arguments.length) return legend;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function(_) {
    if (!arguments.length) return legend;
    labels = _;
    return legend;
  };

  legend.labelFormat = function(_) {
    if (!arguments.length) return legend;
    labelFormat = _;
    return legend;
  };

  legend.labelOffset = function(_) {
    if (!arguments.length) return legend;
    labelOffset = +_;
    return legend;
  };

  legend.orient = function(_){
    if (!arguments.length) return legend;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  return legend;

};
