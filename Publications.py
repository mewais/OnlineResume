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

def create_publications_layout():
    '''
    Create the layout of the publications tab. This is just a simple
    markdown file.

    Args:

    Returns:
        layout: The HTML body of the publications tab
    '''
    # TODO: Add some viz for citations or something
    with open('assets/content/publications.md', 'r') as file:
        pub_md = file.read()
    layout = dcore.Markdown(pub_md)
    return layout
