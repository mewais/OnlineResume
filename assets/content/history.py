import datetime

education = [{
    'name': 'BSc in Communications and Electronics',
    'location': 'Alexandria University',
    'start': datetime.datetime(2009, 9, 1),
    'end': datetime.datetime(2014, 5, 1)
}, {
    'name': 'MASc in Computer Engineering',
    'location': 'University of British Columbia',
    'start': datetime.datetime(2016, 9, 1),
    'end': datetime.datetime(2018, 5, 1)
}, {
    'name': 'PhD in Computer Engineering',
    'location': 'University of Toronto',
    'start': datetime.datetime(2019, 9, 1),
    'end': datetime.datetime.today()        # Current
}]

experience = [{
    'name': 'Research and Teaching Assistant',
    'location': 'American University in Cairo',
    'start': datetime.datetime(2015, 1, 1),
    'end': datetime.datetime(2016, 8, 1)
}, {
    'name': 'Research and Teaching Assistant',
    'location': 'German University in Cairo',
    'start': datetime.datetime(2015, 9, 1),
    'end': datetime.datetime(2016, 1, 1)
}, {
    'name': 'Compilers Engineer',
    'location': 'Huawei Technologies',
    'start': datetime.datetime(2018, 5, 1),
    'end': datetime.datetime(2019, 8, 1)
}]

events = [{
    'what': 'First published paper',
    'when': datetime.datetime(2014, 12, 1)
}, {
    'what': 'Moved to Cairo',
    'when': datetime.datetime(2014, 7, 1)
}, {
    'what': 'Moved to Vancouver',
    'when': datetime.datetime(2016, 8, 1)
}, {
    'what': 'Moved to Toronto',
    'when': datetime.datetime(2018, 5, 1)
}]
