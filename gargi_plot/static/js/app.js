// Chart Params
function buildnycdata(bottom_salinity_psu) {
 
  d3.csv(`data.csv/${bottom_salinity_psu}`).then(nycdata);  {
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log(data)
    
    var nycdata = d3.select("bottom_salinity_psu-data");
    // Use `.html("") to clear any existing metadata
    Mdata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      nycdata.append("h6").text(`${key}:${value}`);
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
      buildGauge(data.data.bottom_salinity_psu);
})
}

function buildCharts(bottom_salinity_psu) {

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
d3.csv(`data.csv/${bottom_salinity_psu}`).then((nycdata) => {
  const top_bottom_coliform_cells_100_ml = data.top_bottom_coliform_cells_100_ml;
  const top_enterococci_bacteria_cells_100ml = data.top_enterococci_bacteria_cells_100ml;
  const bottom_salinity_psu = data.bottom_salinity_psu;

  let bubbleLayout = {
    margin: { t: 0 },
    hovermode: "closests",
    xaxis: { title: "out_id"}
  }

  let bubbleData = [
    {
      x: top_bottom_coliform_cells_100_ml,
      y: bottom_salinity_psu,
      text: top_enterococci_bacteria_cells_100ml,
      mode: "markers",
      marker: {
        size: bottom_salinity_psu,
        color: top_bottom_coliform_cells_100_ml,
        colorscale: "Earth"
      }
    }
  ]

  Plotly.plot("bubble", bubbleData, bubbleLayout);

  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  let pieData = [
    {
      values: bottom_salinity_psu.slice(0, 10),
      labels: top_bottom_coliform_cells_100_ml.slice(0, 10),
      hovertext: top_enterococci_bacteria_cells_100ml.slice(0, 10),
      hoverinfo: "hovertext",
      type: "pie"
    }
  ];
  
  let pieLayout = {
    margin: { t: 0, l: 0 }
  };

  Plotly.plot("pie", pieData, pieLayout)
})
}

function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.csv("/bottom_salinity_psu").then((bottom_salinity_psu) => {
  bottom_salinity_psu.forEach((bottom_salinity_psu) => {
    selector
      .append("option")
      .text(bottom_salinity_psu)
      .property("value", bottom_salinity_psu);
  });

  // Use the first sample from the list to build the initial plots
  const firstbottom_salinity_psu = bottom_salinity_psu[0];
  buildCharts(firstbottom_salinity_psu);
  buildMetadata(firstbottom_salinity_psu);
});
}

function optionChanged(newbottom_salinity_psu) {
// Fetch new data each time a new sample is selected
buildCharts(newbottom_salinity_psu);
buildnycdata(newbottom_salinity_psu);
}

// Initialize the dashboard
init();

  