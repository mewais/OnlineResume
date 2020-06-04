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

def create_teaching_layout():
    '''
    Create the layout of the teaching tab. This is just a simple
    markdown file.

    Args:

    Returns:
        layout: The HTML body of the teaching tab
    '''
    # TODO: Add course pages when I teach entire courses again
    with open('assets/content/teaching.md', 'r') as file:
        teach_md = file.read()
    teach = dcore.Markdown(teach_md)
    layout = dhtml.Div(children=[teach], className='whole-row', style={'overflowY': 'scroll'})
    return layout
