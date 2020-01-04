from flask import Flask, render_template, redirect, request  #, url_for
from flask_pymongo import PyMongo
from pymongo import MongoClient
import json
import pandas as pd
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


def get_line_plot_data( location_name, measurement_name ):

    df = saved_data_df [ saved_data_df ['sampling_location'] == location_name].loc[:,['sample_date', measurement_name]].copy()
    df.sort_values(by = 'sample_date', inplace =True,)
    df.drop_duplicates(inplace=True)

    sample_dates = pd.to_datetime( df['sample_date'], infer_datetime_format = True)
    data_list = pd.to_numeric( df[measurement_name], errors='coerce')

    return sample_dates, data_list


def get_line_plot_img(location_name, measurement_name, img_label):

    sample_dates, data_list = get_line_plot_data(location_name, measurement_name)

    # Generate plot 1
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.plot(sample_dates, data_list)
    axis.set_title(img_label)
    axis.set_xlabel("Sample Date")
    axis.set_ylabel(img_label)
    fig.autofmt_xdate(rotation=45)
    axis.grid()
    
    # Convert plot 1 to PNG image
    pngImage1 = io.BytesIO()
    FigureCanvas(fig).print_png(pngImage1)

    # Encode PNG image to base64 string
    pngImageB64String1 = "data:image/png;base64,"
    pngImageB64String1 += base64.b64encode(pngImage1.getvalue()).decode('utf8')
    return pngImageB64String1


@app.route("/line_plots")
def show_line_map_page():

    pngImageB64String1 = get_line_plot_img('H3', 'winkler_method_bottom_dissolved_oxygen_mg_l', "Bottom Dissolved Oxygen mg1")
    pngImageB64String2 = get_line_plot_img('H3', 'top_fecal_coliform_bacteria_cells_100ml', "Top Fecal Coliform Bacteria 100 ml")
    pngImageB64String3 = get_line_plot_img('H3', 'top_enterococci_bacteria_cells_100ml',"Top Enterococci Bacteria 100ml")

    

    
    
    return render_template("line_plots.html", image1= pngImageB64String1, image2= pngImageB64String2, image3= pngImageB64String3 )

@app.route("/zing_plot")    
def show_zing_plot_page():
    return render_template("zing_plot.html")


@app.route("/scatter_plot")
def show_scatter_plot_page():
    return render_template("scatter_plot.html")


@app.route("/google_map")
def show_google_map_page():
    return render_template("google_map.html")


@app.route("/google_map1")
def show_google_map1_page():
    return render_template("google_map1.html")



@app.route("/get_data")
def d3jsproject_harborwatersample():
    # Convert Python list to JSON object
    return json.dumps(saved_data, default=json_util.default)


# Load data from DB when application starts
saved_data = load_data()
saved_data_df = pd.DataFrame(saved_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
