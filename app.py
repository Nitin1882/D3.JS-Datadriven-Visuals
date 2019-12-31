from flask import Flask, render_template, redirect  #, url_for
from flask_pymongo import PyMongo
from pymongo import MongoClient
import json
import pandas
from bson import json_util
from bson.json_util import dumps

import io
import base64

from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

app = Flask(__name__)

def connect_to_mongodb( local = False ):
    if local:
        client = MongoClient("mongodb+srv://localhost:27017/?retryWrites=true&w=majority")
    else:
        client = MongoClient("mongodb+srv://Test123:Test123@cluster0-hljmv.mongodb.net/test?retryWrites=true&w=majority")
    return client

def load_data():
    # Connect to mongodb
    client = connect_to_mongodb()
    db = client["D3JSProject"] 
    coll = db["FinalDataSet"]

    # Get data from water sample collection
    FIELDS = {'_id': False}
    find_results = coll.find(projection = FIELDS)

    # extract results into python list
    result_list = []
    for harborwater in find_results:
        result_list.append(harborwater)

    # Close mongodb connection
    client.close()

    # Return JSON object to webpage 
    return result_list


@app.route("/")
def show_home_page():
    return render_template("home.html")


@app.route("/data")
def show_data_page():
    return render_template("data.html", data=saved_data)


@app.route("/line_map")
def show_line_map_page():
    
    df4 = pandas.read_csv('C:\\Learn\\Project2\\submit\\merged_file.csv')
    df5 = df4[["sample_date","top_ammonium_mg_l","oakwood_bod_top_sample_mg_l","oxidation_reduction_potential_mv_bottom_sample","top_bottom_coliform_cells_100_ml","bottom_salinity_psu","ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l","top_nitrate_nitrite_mg_l","top_dissolved_organic_carbon_mg_l","oxidation_reduction_potential_mv_bottom_sample",
          "top_enterococci_bacteria_cells_100ml","top_total_suspended_solid_mg_l","total_phosphorus_mg_l","top_ph","bottom_ph", "top_fecal_coliform_bacteria_cells_100ml","winkler_method_bottom_dissolved_oxygen_mg_l","oxidation_reduction_potential_mv_bottom_sample","oxidation_reduction_potential_mv_top_sample","lat","long","sampling_location","DESCRIPTION"]]
    #print(df5.head())
    #print(df5.dropna().head())
    #print(df5.shape)
    df5.sort_values(by = 'sample_date', inplace =True,)
    df5.drop_duplicates(inplace=True)
    #print(df5.shape)
    df7 = df5[df5['sampling_location'] == 'H3'].loc[:,['sample_date', 'bottom_salinity_psu']].copy()
    print(df7.head())
    df8 = df5[df5['sampling_location'] == 'H3'].loc[:,['sample_date', 'winkler_method_bottom_dissolved_oxygen_mg_l']].copy()
    print(df8.head())


    # Generate plot 1
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.plot(df8.sample_date ,df8.winkler_method_bottom_dissolved_oxygen_mg_l)
    axis.set_title("Sample data on bottom dissolved Oxygen")
    axis.set_xlabel("Sample Date")
    axis.set_ylabel("Bottom Dissolved Oxygen")
    axis.grid()
    # axis.plot(range(5), range(5), "ro-")

       
    # Convert plot 1 to PNG image
    pngImage1 = io.BytesIO()
    FigureCanvas(fig).print_png(pngImage1)

    # Encode PNG image to base64 string
    pngImageB64String1 = "data:image/png;base64,"
    pngImageB64String1 += base64.b64encode(pngImage1.getvalue()).decode('utf8')


    df4 = pandas.read_csv('C:\\Learn\\Project2\\submit\\merged_file.csv')
    df5 = df4[["sample_date","top_ammonium_mg_l","oakwood_bod_top_sample_mg_l","oxidation_reduction_potential_mv_bottom_sample","top_bottom_coliform_cells_100_ml","bottom_salinity_psu","ctd_conductivity_temperature_depth_profiler_bottom_dissolved_oxygen_mg_l","top_nitrate_nitrite_mg_l","top_dissolved_organic_carbon_mg_l","oxidation_reduction_potential_mv_bottom_sample",
          "top_enterococci_bacteria_cells_100ml","top_total_suspended_solid_mg_l","total_phosphorus_mg_l","top_ph","bottom_ph", "top_fecal_coliform_bacteria_cells_100ml","winkler_method_bottom_dissolved_oxygen_mg_l","oxidation_reduction_potential_mv_bottom_sample","oxidation_reduction_potential_mv_top_sample","lat","long","sampling_location","DESCRIPTION"]]
    #print(df5.head())
    #print(df5.dropna().head())
    #print(df5.shape)
    df5.sort_values(by = 'sample_date', inplace =True,)
    df5.drop_duplicates(inplace=True)
    #print(df5.shape)
    df7 = df5[df5['sampling_location'] == 'H3'].loc[:,['sample_date', 'bottom_salinity_psu']].copy()
    print(df7.head())

    # Generate plot 2
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.plot(df7.sample_date ,df7.bottom_salinity_psu)
    axis.set_title("Sample Data on Bottom Salinity Psu")
    axis.set_xlabel("Sample Date")
    axis.set_ylabel("Bottom Salinity Psu")
    axis.grid()
    axis.rotatation = 60
    

    # Convert plot 2 to PNG image
    pngImage2 = io.BytesIO()
    FigureCanvas(fig).print_png(pngImage2)

    
    # Encode PNG image to base64 string
    pngImageB64String2 = "data:image/png;base64,"
    pngImageB64String2 += base64.b64encode(pngImage2.getvalue()).decode('utf8')

    #pngImageB64String2 = pngImageB64String1
    
    return render_template("line_map.html", image1= pngImageB64String1, image2= pngImageB64String2 )


@app.route("/scatter_plot")
def show_scatter_plot_page():
    return render_template("scatter_plot.html")

@app.route("/google_map")
def show_google_map_page():
    return render_template("google_map.html")


@app.route("/get_data")
def d3jsproject_harborwatersample():
    # Convert Python list to JSON object
    return json.dumps(saved_data, default=json_util.default)


# Load data from DB when application starts
saved_data = load_data()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)
