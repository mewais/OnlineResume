# Copyright (C) 2020 Mohammad Ewais
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import dash
import os
from dash import dash_table
from dash import dcc as dcore
from dash import html as dhtml
import plotly.graph_objs as go
import pymysql
import pandas
from datetime import datetime, timedelta

def get_visitors():
    '''
    Get the list of visits and visitors from the database

    Returns:
        data: the list of data from database
    '''
    con = pymysql.connect(os.environ.get('DATABASE_HOSTNAME'), os.environ.get('DATABASE_USERNAME'), os.environ.get('DATABASE_PASSWORD'), os.environ.get('DATABASE_SCHEMA'))
    db = con.cursor()
    try:
        db.execute('SELECT * FROM visitors')
        data = db.fetchall()
        return data
    except pymysql.Error as e:
        if hasattr(e, 'message'):
            print(e.message)
        else:
            print(e)
        con.rollback()
        return None

def preprocess_visitors(data):
    '''
    Convert the database to a simpler pandas format

    Args:
        data: the list of data from database

    Returns:
        new_data: the pandas dataframe of our data
    '''
    new_data = []
    for datum in data:
        date_time = datum[0].split('-')[1]
        if datum[1] == 'Israel':
            datum[1] = 'Palestine'
        new_data.append((date_time, datum[1], datum[2], datum[3], datum[4], datum[5], datum[6], datum[7]))
    return new_data

def draw_figure(data):
    '''
    Create the figure of visits over time

    Args:
        data: the pandas dataframe of our data

    Returns:
        figure: The plotly figure, with the map drawn
    '''
    # Create list from our data, cover at least a month
    orig_visits = {}
    oldest = datetime.today() - timedelta(days=30)
    newest = datetime.today()
    for i, row in data.iterrows():
        date = row['Date and Time'].split(' ')[0]
        if datetime.strptime(date, '%Y/%m/%d') < oldest:
            oldest = datetime.strptime(date, '%Y/%m/%d')
        if date in orig_visits:
            orig_visits[date] += row['Visits']
        else:
            orig_visits[date] = row['Visits']
    # Fill holes
    dates = []
    visits = []
    delta = timedelta(days=1)
    while oldest <= newest:
        date = oldest.strftime('%Y/%m/%d')
        dates.append(date)
        if date not in orig_visits:
            visits.append(0)
        else:
            visits.append(orig_visits[date])
        oldest += delta

    fig = [go.Bar(x=dates, y=visits, showlegend=False)]

    layout = dict(
        margin=dict(pad=20),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)'
    )

    # Return
    figure = go.Figure(data=fig, layout=layout)
    return figure

def draw_map(data):
    '''
    Create the map with the correct location pins

    Args:
        data: the pandas dataframe of our data

    Returns:
        figure: The plotly figure, with the map drawn
    '''
    # Create lists
    longitudes = []
    latitudes = []
    text = []
    for i, row in data.iterrows():
        if row['Latitude'] == 0.0 and row['Longitude'] == 0.0:
            continue
        latitudes.append(str(row['Latitude']))
        longitudes.append(str(row['Longitude']))
        new_text = ''
        if row['Country'] != 'Not found':
            new_text += row['Country'] + '<br>'
        if row['State'] != 'Not found':
            new_text += row['State'] + '<br>'
        if row['City'] != 'Not found':
            new_text += row['City'] + '<br>'
        if row['Postal'] != 'Not found':
            new_text += row['Postal']
        text.append(new_text)

    # Create map
    fig = [go.Scattermapbox(
        lat=latitudes,
        lon=longitudes,
        mode='markers',
        marker=go.scattermapbox.Marker(
            size=14
        ),
        hovertext=text,
        hoverinfo='text'
    )]

    layout = dict(
        hovermode='closest',
        mapbox=dict(
            style='open-street-map',
            bearing=0,
            pitch=0,
            zoom=0
        ),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, t=0, b=0)
    )

    # Return
    figure = go.Figure(data=fig, layout=layout)
    return figure

def create_table(data):
    '''
    Display a table with the data from our database

    Args:
        data: the pandas dataframe of our data

    Returns:
        table: The plotly table, contaning all visitors data
    '''
    table = dash_table.DataTable(
        id='table',
        columns=[{'name': i, 'id': i} for i in ['Date and Time', 'Country', 'State', 'City', 'Postal', 'Visits']],
        data=data.to_dict('records'),
        style_table={'height': '98%', 'overflowY': 'auto'},
        style_header={'fontWeight': 'bold', 'backgroundColor': 'rgba(0,0,0,0.6)', 'padding': '20px', 'color': 'white'},
        style_cell={'textAlign': 'center', 'backgroundColor': 'rgba(0,0,0,0.3)', 'padding': '10px', 'whiteSpace': 'normal', 'height': 'auto'},
        sort_action='native'
    )
    return table

def create_layout():
    '''
    Initialize the general parent layout of the visitor tracker

    Args:

    Returns:
        layout: The HTML body of the whole page
    '''

    data = list(get_visitors())
    data = preprocess_visitors(data)
    data = pandas.DataFrame(data, columns=['Date and Time', 'Country', 'State', 'City', 'Postal', 'Longitude', 'Latitude', 'Visits'])

    # Table
    table = create_table(data)
    table_div = dhtml.Div(children=[table], className='two-thirds-column', style={'float': 'left', 'align': 'left'})

    # Figure
    figure_div = dcore.Graph(figure=draw_figure(data), className='one-third-row')

    # Map
    map_div = dcore.Graph(figure=draw_map(data), className='two-thirds-row')

    # Whole Thing
    view_div = dhtml.Div(children=[map_div, figure_div], className='one-third-column', style={'float': 'right', 'align': 'right'})
    layout = dhtml.Div(children=[table_div, view_div], className='whole-row')
    return layout
