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
import patch
import dash_core_components as dcore
import dash_html_components as dhtml
from App import APP

labels = {}

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

    # Benchmark Tabs
    apsp_tab = dcore.Tab(label='apsp', value='1', className='article-unselected-tab', selected_className='article-selected-tab')
    bc_tab = dcore.Tab(label='bc', value='2', className='article-unselected-tab', selected_className='article-selected-tab')
    bfs_tab = dcore.Tab(label='bfs', value='3', className='article-unselected-tab', selected_className='article-selected-tab')
    community_tab = dcore.Tab(label='community', value='4', className='article-unselected-tab', selected_className='article-selected-tab')
    cc_tab = dcore.Tab(label='connected components', value='5', className='article-unselected-tab', selected_className='article-selected-tab')
    dfs_tab = dcore.Tab(label='dfs', value='6', className='article-unselected-tab', selected_className='article-selected-tab')
    pagerank_tab = dcore.Tab(label='pagerank', value='7', className='article-unselected-tab', selected_className='article-selected-tab')
    sssp_tab = dcore.Tab(label='sssp', value='8', className='article-unselected-tab', selected_className='article-selected-tab')
    tc_tab = dcore.Tab(label='triangle counting', value='9', className='article-unselected-tab', selected_className='article-selected-tab')

    # Code hotspots and idealization results
    outer_tabs = dcore.Tabs(id='outer-tabs', children=[apsp_tab, bc_tab, bfs_tab, community_tab, cc_tab, pagerank_tab, sssp_tab, tc_tab], value='1', parent_className='tabs')
    outer_tab_div = dhtml.Div(children=[outer_tabs], className='article-tab-div')
    inner_tabs = dcore.Tabs(id='inner-tabs', value='1', parent_className='tabs')
    inner_tab_div = dhtml.Div(children=[inner_tabs], className='article-tab-div')
    file_div = dhtml.Div(id='file-body-div', className='article-body-div', style={'overflowY': 'scroll'})

    page = dhtml.Div(children=[intro, outer_tab_div, inner_tab_div, file_div], className='article-page')
    return page

@APP.callback([dash.dependencies.Output('inner-tabs', 'children'),
               dash.dependencies.Output('inner-tabs', 'value')],
              [dash.dependencies.Input('outer-tabs', 'value')])
def tab1_picker(value):
    '''
    Select the layout to show based on the selected tab

    Args:
        value: the value of the selected tab

    Return:
        tabs: the tabs of the second tab selector
    '''
    global labels
    # Get the files we need
    folder = sorted(list(os.listdir('assets/content/InstructionOffloadingHMC/idealization/')))[int(value)-1]
    files = list(os.listdir('assets/content/InstructionOffloadingHMC/idealization/'+folder))
    # Use the h5 files to find what tabs we need to create
    tabs = []
    names = ['clean']
    counter = 2
    for file in files:
        if not file.endswith('.h5'):
            continue
        filename = file.split('_')[1]
        filename = filename.split('.')[0]
        # HMC and eHMC have to be at the end
        if filename.endswith('hmc'):
            continue
        # Clean has to be in the beginning
        if filename == 'clean':
            continue
        tab = dcore.Tab(label=filename, value=str(counter), className='article-unselected-tab', selected_className='article-selected-tab')
        counter += 1
        names.append(filename)
        tabs.append(tab)
    names.append('hmc')
    names.append('ehmc')
    labels[value] = names
    tabs.append(dcore.Tab(label='hmc', value=str(counter), className='article-unselected-tab', selected_className='article-selected-tab'))
    tabs.append(dcore.Tab(label='ehmc', value=str(counter+1), className='article-unselected-tab', selected_className='article-selected-tab'))
    tabs.insert(0, dcore.Tab(label='clean', value='1', className='article-unselected-tab', selected_className='article-selected-tab'))
    return tabs, '1'

@APP.callback(dash.dependencies.Output('file-body-div', 'children'),
              [dash.dependencies.Input('outer-tabs', 'value'),
               dash.dependencies.Input('inner-tabs', 'value')])
def tab2_picker(benchmark, config):
    '''
    Select the layout to show based on the two selected tabs

    Args:
        benchmark: the value of the first selected tab
        config: the value of the second selected tab

    Return:
        layout: the selected layout
    '''
    global labels
    folder = sorted(list(os.listdir('assets/content/InstructionOffloadingHMC/idealization/')))[int(benchmark)-1]
    # Find the C file
    folder = 'assets/content/InstructionOffloadingHMC/idealization/' + folder
    files = list(os.listdir(folder))
    for file in files:
        if file.endswith('.cc'):
            c_file = file
            break
    # If clean, display right away
    if config == '1':
        with open(folder + '/' + c_file, 'r') as file:
            code = file.read()
        split_code = code.split('\n')
        numlines = len(split_code)
        numlen = len(str(numlines))
        code = '```cpp\n' + code
        code += '\n```'
        lines = '```cpp\n'
        for i in range(numlines):
            if 'zsim' in split_code[i]:
                lines += '* ' + str(i + 1).zfill(numlen) + ' |\n'
            else:
                lines += '  ' + str(i + 1).zfill(numlen) + ' |\n'
        lines += '```'
        lines = dcore.Markdown(lines, highlight_config=dict(theme='dark'), style={'float':'left', 'align':'left'})
        code = dcore.Markdown(code, highlight_config=dict(theme='dark'))
        return [lines, code]
    # Otherwise, apply patch first
    patch_file = folder + '/ideal_' + labels[benchmark][int(config)-1] + '.patch'
    pset = patch.fromfile(patch_file)
    success = pset.apply(root=folder)
    # Read the updated file
    with open(folder + '/' + c_file, 'r') as file:
        code = file.read()
    split_code = code.split('\n')
    numlines = len(split_code)
    numlen = len(str(numlines))
    code = '```cpp\n' + code
    code += '\n```'
    # Then revert it
    success = pset.revert(root=folder)
    # Finally show it
    lines = '```cpp\n'
    for i in range(numlines):
        if 'zsim' in split_code[i]:
            lines += '* ' + str(i + 1).zfill(numlen) + ' |\n'
        else:
            lines += '  ' + str(i + 1).zfill(numlen) + ' |\n'
    lines += '```'
    lines = dcore.Markdown(lines, highlight_config=dict(theme='dark'), style={'float':'left', 'align':'left'})
    code = dcore.Markdown(code, highlight_config=dict(theme='dark'))
    return [lines, code]
