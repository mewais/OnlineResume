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

import os
import dash
from dash import dcc as dcore
from dash import html as dhtml
import importlib
import requests
import pymysql
from datetime import datetime
from flask import request
from pytz import timezone

from assets.content.links import *
from App import APP
from Background import create_background_layout
from Research import create_research_layout
from Publications import create_publications_layout
from Teaching import create_teaching_layout
from Skills import create_skills_layout
from Contact import create_contact_layout

# These layouts do not need to be updated everytime, they're static
BACKGROUND = create_background_layout()
RESEARCH = create_research_layout()
PUBLICATIONS = create_publications_layout()
TEACHING = create_teaching_layout()
SKILLS = create_skills_layout()
CONTACT = create_contact_layout()


def create_layout():
    '''
    Initialize the general parent layout of our Resume

    Args:

    Returns:
        layout: The HTML body of the whole page.
    '''

    # Title
    with open('assets/content/name.md', 'r') as file:
        name = file.read().replace('\n', '')
    title = dhtml.H1(children=name)

    # Image
    image = dhtml.Img(src='assets/images/face.jpg', className='circular-image')

    # Tabs
    # FIXME: How to make those spaces show in the website?
    background_tab = dcore.Tab(label='\uf015    Background', value='1', className='unselected-tab', selected_className='selected-tab')
    research_tab = dcore.Tab(label='\uf5d2    Research and Projects', value='2', className='unselected-tab', selected_className='selected-tab')
    publications_tab = dcore.Tab(label='\uf70e    Publications', value='3', className='unselected-tab', selected_className='selected-tab')
    teaching_tab = dcore.Tab(label='\uf51c    Teaching', value='4', className='unselected-tab', selected_className='selected-tab')
    skills_tab = dcore.Tab(label='\uf7d9    Skills and Interests', value='5', className='unselected-tab', selected_className='selected-tab')
    contact_tab = dcore.Tab(label='\uf2bb    Contact Me', value='6', className='unselected-tab', selected_className='selected-tab')

    # Tabs footer
    github_icon = dhtml.Img(src='assets/icons/gh.svg', className='icon')
    scholar_icon = dhtml.Img(src='assets/icons/gs.svg', className='icon')
    linkedin_icon = dhtml.Img(src='assets/icons/li.svg', className='icon')
    stackof_icon = dhtml.Img(src='assets/icons/so.svg', className='icon')
    resume_icon = dhtml.Img(src='assets/icons/cv.svg', className='icon')
    email_icon = dhtml.Img(src='assets/icons/em.svg', className='icon')

    github_href = dhtml.A(children=[github_icon], href=github_link)
    scholar_href = dhtml.A(children=[scholar_icon], href=scholar_link)
    linkedin_href = dhtml.A(children=[linkedin_icon], href=linkedin_link)
    stackof_href = dhtml.A(children=[stackof_icon], href=stackof_link)
    resume_href = dhtml.A(children=[resume_icon], href=resume_link)
    email_href = dhtml.A(children=[email_icon], href='mailto:'+email_link)
    footer = dhtml.Div(children=[github_href, scholar_href, linkedin_href, stackof_href, resume_href, email_href], className='tab-footer')
    # Footer container makes is stick to the bottom
    footer_container = dhtml.Div(children=[footer], className='tab-footer-container')

    # Tab Division
    tabs_collection = dcore.Tabs(id='tabs', children=[background_tab, research_tab, publications_tab, teaching_tab, skills_tab, contact_tab], value='1', vertical=True, parent_className='tabs', className='tabs-container')
 
    tab_div = dhtml.Div(id='tabs-div', children=[image, title, tabs_collection, footer_container], className='tab-div')

    # Body Division
    body_div = dhtml.Div(id='body-div', className='body-div')

    # Whole Thing
    layout = dhtml.Div(children=[tab_div, body_div])

    return layout

@APP.callback(dash.dependencies.Output('body-div', 'children'),
              [dash.dependencies.Input('tabs', 'value')])
def tab_picker(value):
    '''
    Select the layout to show based on the selected tab

    Args:
        value: the value of the selected tab

    Return:
        layout: the selected layout
    '''
    layout = None
    if value == '1':
        layout = BACKGROUND
    elif value == '2':
        layout = RESEARCH
    elif value == '3':
        layout = PUBLICATIONS
    elif value == '4':
        layout = TEACHING
    elif value == '5':
        layout = SKILLS
    elif value == '6':
        layout = CONTACT
    return layout

server = APP.server
APP.layout = dhtml.Div([
    dcore.Location(id='url', refresh=False),
    dhtml.Div(id='main-page')
])

def register_visit(key, data):
    con = pymysql.connect(host=os.environ.get('DATABASE_HOSTNAME'), user=os.environ.get('DATABASE_USERNAME'), password=os.environ.get('DATABASE_PASSWORD'), db=os.environ.get('DATABASE_SCHEMA'))
    db = con.cursor()
    try:
        db.execute('SELECT * FROM visitors WHERE id = %s LIMIT 1', (key,))
        exists = db.fetchone()
        if exists is not None:
            db.execute('UPDATE visitors SET visits = visits + 1 WHERE id = %s', (key,))
        else:
            if not data['longitude'] or data['longitude'] == 'Not found':
                data['longitude'] = 0.0
            if not data['latitude'] or data['latitude'] == 'Not found':
                data['latitude'] = 0.0
            if not data['country_name']:
                data['country_name'] = 'Not found'
            if not data['state']:
                data['state'] = 'Not found'
            if not data['city']:
                data['city'] = 'Not found'
            if not data['postal']:
                data['postal'] = 'Not found'
            db.execute('INSERT INTO visitors(id, country, state, city, postal, longitude, latitude) '
                       'VALUES(%s, %s, %s, %s, %s, %s, %s)', (key, data['country_name'], data['state'], 
                       data['city'], data['postal'], data['longitude'], data['latitude']))
        con.commit()
    except pymysql.Error as e:
        if hasattr(e, 'message'):
            print(e.message)
        else:
            print(e)
        con.rollback()

@APP.callback(dash.dependencies.Output('main-page', 'children'),
              [dash.dependencies.Input('url', 'pathname')])
def display_page(pathname):
    if pathname == None:
        return None
    if pathname == '/':
        if os.environ.get('DATABASE_USERNAME') and os.environ.get('DATABASE_PASSWORD') and os.environ.get('DATABASE_HOSTNAME') and os.environ.get('DATABASE_SCHEMA'):
            # https://stackoverflow.com/a/49760261/2328163
            if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
                ip = request.environ['REMOTE_ADDR']
            else:
                ip = request.environ['HTTP_X_FORWARDED_FOR']
            now = datetime.now()
            mins = now.minute - (now.minute % 5)        # Round to 5 mins
            now = datetime(now.year, now.month, now.day, now.hour, mins)
            now = timezone('US/Eastern').localize(now)
            time = now.strftime('%Y/%m/%d %I:%M%p')
            data = requests.get('http://geolocation-db.com/json/' + ip + '&position=true').json()
            key = ip + '-' + time
            register_visit(key, data)
        return create_layout()
    try:
        sub = importlib.import_module('subpages.'+pathname.strip('/'))
    except Exception as e:
        print(e)
        return dhtml.Div([
            dhtml.H3('No such page')
        ])
    try:
        layout = sub.create_layout()
    except Exception as e:
        print(e)
        return dhtml.Div([
            dhtml.H3('Page under construction')
        ])
    return layout

if __name__ == '__main__':
    APP.run(debug=True)
