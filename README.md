# Interactive Resume
I always wanted to have a personal website, serving as a portfolio or a resume of sorts. I tried a couple of wordpress themes, which I didn't feel comfortable with, so I decided I should build my own website. But knowing nothing about web development, and not having enough time to waste learning css, js, and whatever else web developers use, I decided to use [Plotly](https://plotly.com/python/) and [Dash](https://dash.plotly.com/) for the job. This is no normal resume. Because it is built using Plotly and Dash, I am taking advantage of this to build a resume that is informative, interactive, and has a lot of visualizations.

## Structure
I tried to separate the content from the code as much as possible. The structure is as follows:
- The main page itself is in the file `Resume.py`.
- Every tab in the main page is in a file with the same name in the top level, for example `Background.py`.
- CSS classes are in the file `assets/custom.css` (Be warned, it may be the worst CSS you'll ever read)
- Website icon (the one shown in the browser tab) is in `assets/favicon.ico`
- icons used in the website are in `assets/icons/`
- user images (Well, me!) can be found in the folder `assets/images/`
- use info and main page content can be found in the folder `assets/content/`
  - Some of this content is written down in [Markdown format](https://www.markdownguide.org/basic-syntax/) and will be rendered directly in the website
  - Some of this content is written down in python (got no time to parse stuff myself), although I tried to make it very simple to modify.
  - The contents of this directory are detailed here:
    - `name.md` is a one line file including just your name, used for the title.
    - `links.py` includes a list of links that are used in the tab footer.
    - `summary.md` includes a summary about yourself, will be displayed in the background page.
    - `history.py` includes your work and education history, plus some notable events if you choose to. These are also displayed as a figure in the background page.
    - `publications.md` includes all your publications, with some nice coloring and decorations, in markdown format. This is the entirety of the publications page.
    - `skills.py` includes all your skills, categorized and subcategorized with no restrictions on how many levels deep you want to go.
    - `contact.md` includes your contact information, this will be rendered directly in the contact me page of the website.
    - `calendar.py` includes a single link to a shareable calendar, plus a simple variable choosing whether Saturday or Monday is the first day of the week.
    - `location.py` includes the location of your work in a simple format, used to create the map in the contact me page.

## How to use
- If you don't already have it, install and setup `python3` and `pip`.
- Install the dependencies
  - `sudo pip3 install -r requirements.txt`
- Create a new `favicon.ico` file, you can convert a normal image into an icon using [this website](https://icoconvert.com/)
- Start modifying the content as needed
- Start the website by running `python3 Resume.py`

## TODOs
- When I become an instructor (i.e. be responsible for entire courses), add links to separate pages for course info, data, results, etc.
- Find and use an API to get citations of papers, display some nice visualizations for each paper in the publications page.
