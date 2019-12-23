// @TODO: YOUR CODE HERE!
let svgWidth = 960;
let svgHeight = 620;


let margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};


let width = svgWidth - margin.right - margin.left;
let height = svgHeight - margin.top - margin.bottom;


let chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);


let svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);


let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


let chosenXAxis = 'sampling_location';
let chosenYAxis = 'top_nitrate_nitrite_mg_l';


function xScale(nycData, chosenXAxis) {
  //scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(nycData, d => d[chosenXAxis]) * 0.8,
      d3.max(nycData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}
function xScaleBand(nycData, chosenXAxis) {
  //scales
  let xLinearScale = d3.scaleBand()
    .domain(nycData.map(d => d[chosenXAxis]))
    .range([0, width]);

  return xLinearScale;
}

function yScale(nycData, chosenYAxis) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(nycData, d => d[chosenYAxis]) * 0.8,
      d3.max(nycData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//a function for updating the xAxis upon click
function renderXAxis(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//a function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr('cx', data => {
        console.log(data)
        console.log('circle'); 
        return newXScale(data[chosenXAxis]);
      })
      .attr('cy', data => newYScale(data[chosenYAxis]))

    return circlesGroup;
}

//updating STATE labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}

function styleX(value, chosenXAxis) {

    
    //poverty
    if (chosenXAxis === 'top_bottom_coliform_cells_100_ml') {
        return `${value}`;
    }
    //household income
    else if (chosenXAxis === 'oxidation_reduction_potential_mv_bottom_sample') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    
    if (chosenXAxis === 'top_bottom_coliform_cells_100_ml') {
      var xLabel = 'top_bottom_coliform_cells_100_ml:';
    }
    
    else if (chosenXAxis === 'bottom_salinity_psu'){
      var xLabel = 'bottom_salinity_psu:';
    }
    
    else {
      var xLabel = 'ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l:';
    }

  
  if (chosenYAxis ==='oxidation_reduction_potential_mv_top_sample') {
    var yLabel = "oxidation_reduction_potential_mv_top_sample:"
  }
  else if(chosenYAxis === 'oakwood_bod_top_sample_mg_l') {
    var yLabel = 'oakwood_bod_top_sample_mg_l:';
  }
  //smoking
  else{
    var yLabel = 'top_ammonium_mg_l:';
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//retrieve data
d3.csv('./assets/data/data.csv').then(function(nycData) {

    // console.log(nycData);
    
    //nyc data
    nycData.forEach(function(data){
        data.top_ammonium_mg_l = +data.top_ammonium_mg_l;
        data.oakwood_bod_top_sample_mg_l = +data.oakwood_bod_top_sample_mg_l;
        data.oxidation_reduction_potential_mv_top_sample = +data.oxidation_reduction_potential_mv_top_sample;
        data.ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l = +data.ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l;
        data.bottom_salinity_psu = +data.bottom_salinity_psu;
        data.top_bottom_coliform_cells_100_ml = +data.top_bottom_coliform_cells_100_ml;
    });
    console.log(nycData);

    //linear scales
    var xLinearScale = xScaleBand(nycData, chosenXAxis);
    var yLinearScale = yScale(nycData, chosenYAxis);

    // x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    //append Circles
    var circlesGroup = chartGroup.selectAll('circle')
      .data(nycData)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', data => {
        console.log(data)
        console.log('circle'); 
        console.log(chosenXAxis);
        console.log(data[chosenXAxis]);
        return xLinearScale(data[chosenXAxis]);
      })
      .attr('cy', d => yLinearScale(d[chosenYAxis]))
      .attr('r', 14)
      .attr('opacity', '.5');

    //append Text
    var textGroup = chartGroup.selectAll('.stateText')
      .data(nycData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

    //x labels
    var xLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var top_bottom_coliform_cells_100_ml = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'top_bottom_coliform_cells_100_ml')
      .text('top_bottom_coliform_cells_100_ml');
      
    var bottom_salinity_psu = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'bottom_salinity_psu')
      .text('bottom_salinity_psu');  

    var ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l')
      .text('ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l')

    // Y labels
    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'oxidation_reduction_potential_mv_top_sample')
      .text('oxidation_reduction_potential_mv_top_sample');
    
    var smokesLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'oakwood_bod_top_sample_mg_l')
      .text('oakwood_bod_top_sample_mg_l');
    
    var obesityLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'top_ammonium_mg_l')
      .text('top_ammonium_mg_l');
    
    //toolTip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != chosenXAxis) {

          //replace chosen x with a value
          chosenXAxis = value; 

          //update x for new data
          xLinearScale = xScaleBand(nycData, chosenXAxis);

          //update x 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles with a new x value
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update text 
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update tooltip
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //x text
          if (chosenXAxis === 'top_bottom_coliform_cells_100_ml') {
            top_bottom_coliform_cells_100_mlLabel.classed('active', true).classed('inactive', false);
            bottom_salinity_psu.classed('active', false).classed('inactive', true);
            ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l.classed('active', false).classed('inactive', true);
          }
          else if (chosenXAxis === 'bottom_salinity_psu') {
            top_bottom_coliform_cells_100_mlLabel.classed('active', false).classed('inactive', true);
            bottom_salinity_psu.classed('active', true).classed('inactive', false);
            ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l.classed('active', false).classed('inactive', true);
          }
          else {
            top_bottom_coliform_cells_100_mlLabel.classed('active', false).classed('inactive', true);
            bottom_salinity_psu.classed('active', false).classed('inactive', true);
            ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l.classed('active', true).classed('inactive', false);
          }
        }
      });
    //y axis 
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=chosenYAxis) {
            //replace chosenY with value  
            chosenYAxis = value;

            //update Y scale
            yLinearScale = yScale(nycData, chosenYAxis);

            //update Y axis 
            yAxis = renderYAxis(yLinearScale, yAxis);

            //Udate  new y
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update TEXT with new Y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update tooltips
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //Change of the classes changes text
            if (chosenYAxis === 'oxidation_reduction_potential_mv_top_sample') {
              oxidation_reduction_potential_mv_top_sample.classed('active', true).classed('inactive', false);
              oakwood_bod_top_sample_mg_l.classed('active', false).classed('inactive', true);
              top_ammonium_mg_l.classed('active', false).classed('inactive', true);
            }
            else if (chosenYAxis === 'smokes') {
              oxidation_reduction_potential_mv_top_sample.classed('active', false).classed('inactive', true);
              oakwood_bod_top_sample_mg_l.classed('active', true).classed('inactive', false);
              top_ammonium_mg_l.classed('active', false).classed('inactive', true);
            }
            else {
              oxidation_reduction_potential_mv_top_sample.classed('active', false).classed('inactive', true);
              oakwood_bod_top_sample_mg_l.classed('active', false).classed('inactive', true);
              top_ammonium_mg_l.classed('active', true).classed('inactive', false);
            }
          }
        });
});