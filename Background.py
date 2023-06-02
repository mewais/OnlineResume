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
from dash import dcc as dcore
from dash import html as dhtml
import plotly.graph_objs as go

import datetime
import monthdelta

from assets.content.history import *

def month_difference(first, second):
    '''
    Gets the difference in months between two dates

    Args:
        first: The earlier date
        secnd: The later date

    returns:
        months: The number of months
    '''
    months = (second.year - first.year) * 12 + (second.month - first.month)
    return months


def draw_history_figure():
    '''
    Draws the figure showing experience and education. This 
    also decides the axis, and the height of the figure.

    Args:

    Returns:
        figure: The plotly figure, ready to use
    '''

    # Get the earliest event
    earliest = datetime.datetime.today()
    for edu in education:
        if edu['start'] < earliest:
            earliest = edu['start']
    for exp in experience:
        if exp['start'] < earliest:
            earliest = exp['start']
    for event in events:
        if event['when'] < earliest:
            earliest = event['when']

    # Make x axis
    x_labels = []
    current = earliest
    while True:
        x_labels.append(current.strftime('%Y %b'))
        current = current + monthdelta.monthdelta(1)
        if current > datetime.datetime.today():
            break

    data = []

    # Plot Education
    for edu in education:
        edu_start = [month_difference(earliest, edu['start'])]
        edu_dur = [month_difference(edu['start'], edu['end'])]
        edu_offset = [-1]
        hovertext = ['<b>' + edu['name'] + '</b><br>' + edu['location'] + '<br><i>' + 
                     edu['start'].strftime('%b %Y') + ' to ']
        if edu['end'].date() == datetime.datetime.today().date():
            hovertext[0] = hovertext[0] + 'current'
        else:
            hovertext[0] = hovertext[0] + edu['end'].strftime('%b %Y') + '</i>'
        data.append(go.Bar(name=edu['name'], x=edu_dur, y=edu_offset, base=edu_start, 
                           orientation='h', hovertext=hovertext, hoverinfo='text',
                           showlegend=False))

    # Plot Experience
    for exp in experience:
        exp_start = [month_difference(earliest, exp['start'])]
        exp_dur = [month_difference(exp['start'], exp['end'])]
        exp_offset = [1]
        hovertext = ['<b>' + exp['name'] + '</b><br>' + exp['location'] + '<br><i>' + 
                     exp['start'].strftime('%b %Y') + ' to ']
        if exp['end'].date() == datetime.datetime.today().date():
            hovertext[0] = hovertext[0] + 'current'
        else:
            hovertext[0] = hovertext[0] + exp['end'].strftime('%b %Y') + '</i>'
        data.append(go.Bar(name=exp['name'], x=exp_dur, y=exp_offset, base=exp_start,
                           orientation='h', hovertext=hovertext, hoverinfo='text',
                           showlegend=False))

    # Plot Events
    dates = []
    offsets = []
    texts = []
    lines = []
    for ev in events:
        dates.append(month_difference(earliest, ev['when']))
        offsets.append(3)
        texts.append('<b>' + ev['what'] + '</b><br><i>' + ev['when'].strftime('%b %Y') +
                     '</i>')
        lines.append({'type': 'line', 'xref': 'x', 'yref': 'y', 'x0': dates[-1], 'y0': 0, 'x1': dates[-1], 'y1': 3})
    data.append(go.Scatter(x=dates, y=offsets, hovertext=texts, hoverinfo='text',
                           showlegend=False, mode='markers', marker=dict(size=40, 
                           line_width=3)))

    # Layout
    layout = dict(
        title=dict(
            text='<b>Experience and Education</b>',
            y=0.9,
            x=0.5,
            xanchor='center',
            yanchor='top',
            font=dict(
                family='Heebo',
                size=24,
                color='black'
            )
        ),
        barmode='stack',
        xaxis=dict(
            # Show in Qs
            ticktext=[x_labels[i] for i in range(0, len(x_labels), 4)],
            tickvals=list(range(0, len(x_labels), 4)),
            tickfont=dict(size=16),
            showgrid=False,
            zeroline=False,
            fixedrange=True
        ),
        yaxis=dict(
            ticktext=['Education', '', 'Experience'],
            tickvals=[-1, 0, 1],
            tickfont=dict(size=24),
            showgrid=False,
            zeroline=True,
            zerolinewidth=5,
            zerolinecolor='black',
            fixedrange=True
        ),
        margin=dict(pad=20),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        shapes=lines
    )

    # Return
    figure = go.Figure(data=data, layout=layout)
    return figure

def create_background_layout():
    '''
    Create the layout of the background tab. This includes
    a summary section, plus the education and experience.

    Args:

    Returns:
        layout: The HTML body of the background page
    '''

    # Big Image
    image = dhtml.Img(src='assets/images/body.jpg', className='one-third-column')

    # Summary
    with open('assets/content/summary.md', 'r') as file:
        summary_md = file.read()
    summary = dcore.Markdown(summary_md, className='two-thirds-column', style={'float': 'right', 'align': 'right'})

    # Education and Background
    history = dcore.Graph(figure=draw_history_figure(), className='one-half-row')

    # Full page
    upper_half = dhtml.Div(children=[image, summary], className='one-half-row')
    page = dhtml.Div(children=[upper_half, history], className='whole-column whole-row')

    return page
