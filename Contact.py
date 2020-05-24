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
import dash_core_components as dcore
import dash_html_components as dhtml
import plotly.graph_objs as go

from assets.content.location import *

def draw_map():
    '''
    Create the map with the correct location pin

    Args:

    Returns:
        figure: The plotly figure, with the map drawn
    '''
    # Get longitude and latitude, plus address line

    # Create map
    data = [go.Scattermapbox(
        lat=[str(latitude)],
        lon=[str(longitude)],
        mode='markers',
        marker=go.scattermapbox.Marker(
            size=14
        ),
        hovertext='<b>Office</b><br>' + address_simple,
        hoverinfo='text'
    )]

    layout = dict(
        hovermode='closest',
        mapbox=dict(
            style="open-street-map",
            bearing=0,
            center=go.layout.mapbox.Center(
                lat=latitude,
                lon=longitude
            ),
            pitch=0,
            zoom=5
        ),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, t=0, b=0)
    )

    # Return
    figure = go.Figure(data=data, layout=layout)
    return figure

def create_contact_layout():
    '''
    Create the layout of the contact me tab. That's a contact
    form, a calendar, the work address, plus a couple of links.

    Args:

    Returns:
        layout: The HTML body of the contact page
    '''

    # Info
    # FIXME: Unable to render FontAwesome from the MD
    with open('assets/content/contact.md', 'r') as file:
        contact_md = file.read()
    info = dcore.Markdown(contact_md, className='one-half-column', style={'float': 'left', 'align': 'left'})

    # Calendar
    calendar = dcore.Graph(className='one-third-row')

    # Map
    work_map = dcore.Graph(figure=draw_map(), className='one-third-row')

    # Upper half
    figures = dhtml.Div(children=[calendar, work_map], className='one-half-column', style={'float': 'right', 'align': 'right'})
    upper_half = dhtml.Div(children=[info, figures], className='two-thirds-row')

    return upper_half
