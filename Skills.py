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

from App import APP
from assets.content.skills import *

last_name = None
last_value = None

def dict_to_lists(skills_dict, labels_vec, parents_vec, parent=''):
    '''
    Convert the dictionary to lists of names and parents, recursively

    Args:
        skills_dict: The skills dictionary to convert
        labels_vec: The vector of names, this will be appended to
        parents_vec: The vector of parents, this will be appended to
        parent: The parent of the current level, empty by default

    Returns:
    '''
    for name, value in skills_dict.items():
        labels_vec.append(name)
        parents_vec.append(parent)
        if isinstance(value, dict):
            dict_to_lists(value, labels_vec, parents_vec, name)

def draw_skills():
    '''
    Draw the sunburst figure showing the entire skill
    tree

    Args:

    Returns:
        figure: The plotly figure showing all skills
    '''
    # Create the relationship vectors
    labels = []
    parents = []
    dict_to_lists(skills, labels, parents)
    
    # Plot
    data = [go.Sunburst(
        labels=labels,
        parents=parents,
        insidetextorientation='radial'
    )]

    # Layout
    layout = dict(
        title=dict(
            text='<b>My Skills</b>',
            y=0.95,
            x=0.5,
            xanchor='center',
            yanchor='top',
            font=dict(
                family='Heebo',
                size=24,
                color='black'
            )
        ),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, t=0, b=0)
    )

    # Return
    figure = go.Figure(data=data, layout=layout)
    return figure

@APP.callback(
    dash.dependencies.Output('bar', 'figure'),
    [dash.dependencies.Input('skills', 'hoverData')])
def draw_skill_level(hoverData):
    '''
    Draw the bar showing the excellence of this skill

    Args:
        hoverData: contains the full path of the skill, with levels
            separated by /, and its label

    Returns:
        figure: The plotly bar plot
    '''
    global last_name
    global last_value

    if hoverData is None:
        # Pick the first ever skill
        current_dict = skills
        keys = list(current_dict.keys())
        while isinstance(current_dict[keys[0]], dict):
            current_dict = current_dict[keys[0]]
            keys = list(current_dict.keys())
        name = keys[0]
        value = current_dict[keys[0]]
    else:
        path = list(filter(None, hoverData['points'][0]['currentPath'].split('/')))
        # Follow the path till we get the value
        current_dict = skills
        for i in range(len(path)):
            current_dict = current_dict[path[i]]
        name = hoverData['points'][0]['label']
        value = current_dict[hoverData['points'][0]['label']]

    # If no value selected, keep last
    if isinstance(value, dict):
        name = last_name
        value = last_value
    else:
        last_name = name
        last_value = value

    # color
    if value <= 20:
        color = '#BD3B1B'
    elif value <= 40:
        color = '#D8A800'
    elif value <= 60:
        color = '#B9D870'
    elif value <= 80:
        color = '#B6C61A'
    elif value <= 100:
        color = '#006344'

    # data
    data = [go.Bar(
        x = [0],
        y = [value],
        marker_color = [color],
        hoverinfo = 'text',
        hovertext = [str(value) + '%']
    )]

    # layout
    layout = dict(
        title=dict(
            text='<b>' + name + '</b>',
            y=0.95,
            x=0.5,
            xanchor='center',
            yanchor='top',
            font=dict(
                family='Heebo',
                size=24,
                color='black'
            )
        ),
        xaxis=dict(
            visible=False
        ),
        yaxis=dict(
            range=[0,101],
            tickvals=[0,20,40,60,80,100],
            ticktext=['None','Poor','Below Average','Good','Excellent','Master']
        ),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)'
    )

    # Return
    figure = go.Figure(data=data, layout=layout)
    return figure

def create_skills_layout():
    '''
    Initialize the layout of skills and interests. Contains one 
    Sunburst chart of all topics, and a bar showing the strength 
    of the selected one.

    Args:

    Returns:
        layout: The layout of the skills page
    '''
    
    # Sunburst
    sunburst = dcore.Graph(id='skills', figure=draw_skills(), className='five-sixths-column whole-row', style={'float': 'left', 'align': 'left'})
    
    # Bar
    bar = dcore.Graph(id='bar', className='one-sixth-column whole-row', style={'float': 'right', 'align': 'right'})

    # Layout
    layout = dhtml.Div(children=[sunburst, bar])
    return layout
