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
import icalendar
import recurring_ical_events
import urllib.request
from datetime import datetime, timedelta

from assets.content.location import *
from assets.content.calendar import *

def draw_calendar():
    '''
    Create the calendar with week info

    Args:

    Returns:
        figure: The plotly figure, with week calendar drawn
    '''
    # Pick start and end dates to be the start of this week, and
    # the end of next week
    today = datetime.now().date()
    start_date = today - timedelta(days=today.weekday())
    end_date = start_date + timedelta(days=14)
    if saturday_first:
        start_date = start_date - timedelta(days=2)
        end_date = end_date - timedelta(days=2)
    start = (start_date.year, start_date.month, start_date.day)
    end =   (end_date.year, end_date.month, end_date.day)
    # Download the events
    ical_string = urllib.request.urlopen(calendar_link).read()
    calendar = icalendar.Calendar.from_ical(ical_string)
    events = recurring_ical_events.of(calendar).between(start, end)
    # Make weekdays
    weekdays = []
    day_date = start_date
    while True:
        weekday = day_date.strftime("%a %b %d")
        weekdays.append(weekday)
        day_date = day_date + timedelta(days=1)
        if day_date == end_date:
            break
    # Make hours, with a 30 min granularity
    # I start at 8AM, end at 8PM
    begin = datetime(2000, 1, 1, 8, 0, 0)
    end = begin + timedelta(minutes=30)
    hours = []
    while True:
        time_slot_string = begin.strftime('%I:%M%p') + '-' + end.strftime('%I:%M%p')
        hours.append(time_slot_string)
        if end.hour == 20:
            break
        begin = end
        end = end + timedelta(minutes=30)
    # Colors
    values = {}
    # Convert events to bars
    heatmap = [[0]*len(weekdays) for i in range(len(hours))]
    for event in events:
        start_time = event["DTSTART"].dt
        end_time = event["DTEND"].dt
        name = event["SUMMARY"]
        day_index = (start_time.date() - start_date).days
        hour_start = (start_time.hour - 8) * 2 + (start_time.minute // 30)
        hour_end = (end_time.hour - 8) * 2 + (end_time.minute // 30)
        text = '<b>' + name + '</b><br>' + start_time.strftime('%a %b %d') + '<br><i>' + start_time.strftime('%I:%M%p') + ' to ' + end_time.strftime('%I:%M%p') + '</i>'
        if name not in values:
            values[name] = ([day_index], [hour_start], [hour_end - hour_start], [text])
        else:
            values[name][0].append(day_index)
            values[name][1].append(hour_start)
            values[name][2].append(hour_end - hour_start)
            values[name][3].append(text)
    # Plot
    data = []
    for name in values:
        data.append(go.Bar(
            name=name,
            x=values[name][0],
            y=values[name][2],
            base=values[name][1],
            hoverinfo='text',
            hovertext=values[name][3],
            showlegend=False
        ))
    layout = dict(
        yaxis=dict(
            range=[len(hours), 0],
            tickvals = [i for i in range(0, len(hours), 2)],
            ticktext = [hours[i].split('-')[0] for i in range(0, len(hours), 2)]
        ),
        xaxis=dict(
            range=[0, len(weekdays)],
            tickvals = [i for i in range(len(weekdays))],
            ticktext = weekdays
        ),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, t=0, b=0)
    )

    # Return
    figure = go.Figure(data=data, layout=layout)
    return figure

def draw_map():
    '''
    Create the map with the correct location pin

    Args:

    Returns:
        figure: The plotly figure, with the map drawn
    '''
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
            style='open-street-map',
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
    calendar = dcore.Graph(figure=draw_calendar(), className='one-third-row')

    # Map
    work_map = dcore.Graph(figure=draw_map(), className='one-third-row')

    # Upper half
    figures = dhtml.Div(children=[calendar, work_map], className='one-half-column', style={'float': 'right', 'align': 'right'})
    upper_half = dhtml.Div(children=[info, figures], className='two-thirds-row')

    return upper_half
