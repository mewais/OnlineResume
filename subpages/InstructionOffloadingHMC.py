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

def create_layout():
    '''
    Initialize the general parent layout of the page

    Args:

    Returns:
        layout: The HTML body of the whole page.
    '''
    # Intro
    with open('assets/content/InstructionOffloadingHMC/Intro.md') as file:
        intro_md = file.read()
    intro = dcore.Markdown(intro_md, className='article', highlight_config=dict(theme='dark'))

    # Code hotspots

    page = dhtml.Div(children=[intro], className='article-page')
    return page
