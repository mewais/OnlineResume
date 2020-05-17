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

# These layouts do not need to be updated everytime, they're static
# BACKGROUND = create_background_layout()
# RESEARCH = create_research_layout()
# PUBLICATIONS = create_publications_layout()
# TEACHING = create_teaching_layout()
# SKILLS = create_skills_layout()
# CONTACT = create_contact_layout()


def init_layout():
    '''
    Initialize the general parent layout of ETop

    Args:

    Returns:
        layout: The HTML body of the whole page.
    '''

    # Title
    title = dhtml.H1(children='Mohammad Ewais')

    # Image
    image = dhtml.Img(src='assets/images/face.jpg', className='circular-image')

    # Tabs
    background_tab = dcore.Tab(label='\\f015 Background', value='1', className='unselected-tab', selected_className='selected-tab')
    research_tab = dcore.Tab(label='\\f5d2 Research and Projects', value='2', className='unselected-tab', selected_className='selected-tab')
    publications_tab = dcore.Tab(label='\\f46d Publications', value='3', className='unselected-tab', selected_className='selected-tab')
    teaching_tab = dcore.Tab(label='\\f51c Teaching', value='4', className='unselected-tab', selected_className='selected-tab')
    skills_tab = dcore.Tab(label='\\f7d9 Skills and Interests', value='5', className='unselected-tab', selected_className='selected-tab')
    contact_tab = dcore.Tab(label='\\f2bb Contact Me', value='6', className='unselected-tab', selected_className='selected-tab')

    # Tabs footer
    github_icon = dhtml.Img(src='assets/icons/gh.png', className='icon')
    scholar_icon = dhtml.Img(src='assets/icons/gs.png', className='icon')
    linkedin_icon = dhtml.Img(src='assets/icons/li.png', className='icon')
    stackof_icon = dhtml.Img(src='assets/icons/so.png', className='icon')
    footer = dhtml.Div(children=[github_icon, scholar_icon, linkedin_icon, stackof_icon], className='tab-footer')

    # Tab Division
    tabs_collection = dcore.Tabs(id='tabs', children=[background_tab, research_tab, publications_tab, teaching_tab, skills_tab, contact_tab], value='1', vertical=True, parent_className='tabs', className='tabs-container')
 
    tab_div = dhtml.Div(id='tabs-div', children=[image, title, tabs_collection, footer], className='tab-div')

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
    # if value == '1':
    #     layout = BACKGROUND
    # elif value == '2':
    #     layout = RESEARCH
    # elif value == '3':
    #     layout = PUBLICATIONS
    # elif value == '4':
    #     layout = TEACHING
    # elif value == '5':
    #     layout = SKILLS
    # elif value == '6':
    #     layout = CONTACT
    return layout

# App
APP = dash.Dash(__name__)
APP.config['suppress_callback_exceptions'] = True
APP.layout = init_layout()

if __name__ == '__main__':
    APP.run_server(debug=True)
