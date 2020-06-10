import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import numpy as np
import json
import urllib.request
import plotly.graph_objs as go
import plotly.express as px
from dash.dependencies import Input, Output
from datetime import datetime

# get datas
url = 'https://www.amcharts.com/lib/4/geodata/json/southKoreaHigh.json'
hdr = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=hdr)
with urllib.request.urlopen(req) as response:
    country_json = json.load(response)

countries = {'전체': 'All', '서울': 'Seoul', '부산': 'Busan', '대구': 'Daegu', '인천': 'Incheon', '광주': 'Gwangju',
             '대전': 'Daejeon', '울산': 'Ulsan', '세종': 'Sejong', '경기': 'Gyeonggi', '강원': 'Gangwon',
             '충북': 'North Chungcheong', '충남': 'South Chungcheong', '전북': 'North Jeolla',
             '전남': 'South Jeolla', '경북': 'North Gyeongsang', '경남': 'South Gyeongsang', '제주': 'Jeju'}
pie_charts = {
    'fields': {'name': '지원 분야', 'key': '지원분야대', 'id': ['금융', '기술', '인력', '수출', '내수', '창업', '경영', '제도', '동반성장'],
               'select': ['금융', '기술', '인력', '수출', '내수', '창업', '경영', '제도', '동반성장']},
    'categoies': {'name': '업종', 'key': '업종',
                  'id': ['01~03', '05~08', '10~34', '35', '36~39', '41~42', '45~47', '49~52', '55~56', '58~63', '64~66', '68', '70~73', '74~76', '84', '85', '86~87', '90~91', '94~96', '97~98', '99'],
                  'select': ['농업, 임업 및 어업', '광업', '제조업', '전기, 가스, 증기 및 공기 조절 공급업',
                             '수도, 하수 및 폐기물 처리, 원료 재생업', '건설업', '도매 및 소매업', '운수 및 창고업', '숙박 및 음식점업',
                             '정보통신업', '금융 및 보험업', '부동산업', '전문, 과학 및 기술 서비스업', '사업시설 관리, 사업 지원 및 임대 서비스업',
                             '공공 행정, 국방 및 사회보장 행정', '교육 서비스업', '보건업 및 사회복지 서비스업', '예술, 스포츠 및 여가관련 서비스업',
                             '협회 및 단체, 수리 및 기타 개인 서비스업', '가구 내 고용활동 및 달리 분류되지 않은 자가 소비 생산활동', '국제 및 외국기관']},
    'targets': {'name': '기업 형태', 'key': '기업형태', 'id': ['중소기업', '중견기업', '소상공인', '전통시장', '1인기업', '창업기업', '예비창업자'],
                'select': ['중소기업', '중견기업', '소상공인', '전통시장', '1인기업', '창업기업', '예비창업자']}
}
INITIAL_CHART = 'fields'
TODAY = datetime(2020, 3, 27)


# data preprocessing
df = pd.read_csv('file/bizinfodata2.csv', encoding='utf-8')
projects = pd.DataFrame(
    df, columns=['제목', '내용', '지역', '지원분야대', '지원기간', '기업형태', '업종', '조회수', '등록일자', '접수기관_담당부서'])
projects['등록일자'] = projects['등록일자'].str[:10]
projects['내용'] = projects['내용'].str.replace('<p style="margin: 0px">', '').str.replace(
    '&nbsp;', ' ').str.replace('<div>', '').str.replace('?', ' ').str[:20] + '...'
projects_coun = projects[projects['지역'].str.len() != 50].copy()
country_projects = {}
for country in countries:
    data = projects_coun.loc[projects_coun['지역'].str.contains(country)]
    country_projects[countries[country]] = {'name': country, 'data': data}


# draw geoJson
country_data = {'location': [], 'name': [], 'projects': []}
for country in country_projects:
    country_data['location'].append(country)
    country_data['name'].append(country_projects[country]['name'])
    country_data['projects'].append(len(country_projects[country]['data']))

country_df = pd.DataFrame(country_data)
fig_geo = px.choropleth(country_df, geojson=country_json, locations='location', color='projects',
                        color_continuous_scale="Viridis", hover_name='name',
                        featureidkey='properties.name', projection="mercator",
                        labels={'location': 'id', 'name': '지역 이름', 'projects': '지원사업 개수'})

fig_geo.update_geos(fitbounds="locations", visible=False)
fig_geo.update_layout(
    margin={"r": 0, "t": 0, "l": 0, "b": 0}, clickmode='event+select')

# draw pie chart
country_projects['All'] = {'name': '전체', 'data': projects}


def get_pie_chart(country, pie_df):
    fig_pie = px.pie(pie_df, values='count', names='id', hover_data=['avg_inquiry'], hover_name='name',
                     title='{0} 지역의 {1}별 원형 그래프'.format(
        country, pie_charts[chart]['name']),
        labels={'id': '분류', 'name': pie_charts[chart]['name'], 'count': '지원사업 개수', 'avg_inquiry': '평균 조회수'})
    fig_pie.update_layout(margin={"b": 10})
    return fig_pie


pie_projects = {}
for country in countries:
    pie_data = {}
    data = country_projects[countries[country]]['data']
    for chart in pie_charts:
        pie_df = []
        for name, select in zip(pie_charts[chart]['id'], pie_charts[chart]['select']):
            select_data = data[data[pie_charts[chart]
                                    ['key']].str.contains(select)]
            length = len(select_data)
            if length == 0:
                continue
            select_data = {'id': name, 'name': select, 'count': length,
                           'avg_inquiry': sum(select_data['조회수']) // length}
            pie_df.append(select_data)
        pie_df = pd.DataFrame(pie_df)
        pie_data[chart] = pie_df
    pie_projects[country] = pie_data


# draw scatter chart
scatter_projects = {}


def get_scatter_chart(country, scatter_df):
    fig_scatter = px.scatter(scatter_df, x='등록일자', y='조회수', color='접수기관_담당부서', hover_data=['평균조회수', scatter_df.index],
                             hover_name='제목', title='{0}지역의 산점도'.format(country), labels={'평균조회수': '하루평균조회수'})
    fig_scatter.update_layout(clickmode='event+select')
    return fig_scatter


def selected_data_box(data_indexs):
    # print(data_indexs)

    a = html.Ul([html.Li([html.P(projects.loc[i, '접수기관_담당부서']), html.H2(projects.loc[i, '제목']),
                          html.H3(projects.loc[i, '내용']), html.Span(projects.loc[i, '지원기간'])]) for i in data_indexs],
                className='selected-data-box', style={'display': 'flex',
                                                      'flex-direction': 'row', 'flex-wrap': ' wrap', 'justify-content': 'space-between',
                                                      'list-style': 'none', 'width': '100%'
                                                      })
    return a


for country in countries:
    data = country_projects[countries[country]]['data'].copy()
    temp_time = data['등록일자'].str.split('-')
    for i in data.index:
        d = temp_time[i]
        t = datetime(int(d[0]), int(d[1]), int(d[2]))
        temp_time[i] = data.loc[i, '조회수'] // (TODAY - t).days
    data['평균조회수'] = temp_time
    scatter_projects[country] = data

# run dash
external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)


# test code
styles = {
    'pre': {
        'width': '1500px',
        'border': 'thin lightgrey solid',
        'overflowX': 'scroll',
        'display': 'inline-block'
    }
}


# app layout
app.layout = html.Div([dcc.Graph(id='korea-map', figure=fig_geo,
                                 style={'border': 'thin lightgrey solid', 'width': '600px', 'margin-top': '0px'}),
                       html.Div([
                           dcc.Dropdown(
                               id='pie-labels',
                               options=[{'label': pie_charts[i]['name'], 'value': i}
                                        for i in pie_data],
                               value=INITIAL_CHART,
                               style={'width': '55%', 'margin-top': '10px',
                                      'margin-left': '10px'}
                           ), dcc.Graph(id='pie-chart')], style={'border': 'thin lightgrey solid', 'width': '600px'}),
                       dcc.Graph(
                           id='scatter-chart', style={'border': 'thin lightgrey solid', 'width': '1500px', 'margin-top': '50px'}),

                       html.Div([
                           dcc.Markdown("""
                **Selection Data**

                산점도에서 선택한 데이터가 보여집니다.
            """),
                           html.Pre(id='selected-data', style=styles['pre']),
                       ], className='three columns')

                       ])


# callback functions
@app.callback(
    [Output('pie-chart', 'figure'),
     Output('scatter-chart', 'figure')],
    [Input('korea-map', 'selectedData'),
     Input('pie-labels', 'value')])
def draw_all_chart(selectedData, value):
    if value == None:
        value = INITIAL_CHART

    if selectedData == None or selectedData['points'] == []:
        selectedData = '전체'
    else:
        selectedData = selectedData['points'][0]['hovertext']

    return get_pie_chart(selectedData, pie_projects[selectedData][value]), get_scatter_chart(selectedData, scatter_projects[selectedData])


@app.callback(
    Output('selected-data', 'children'),
    [Input('scatter-chart', 'selectedData')])
def display_selected_data(selectedData):
    data_indexs = []
    if selectedData != None:
        for sel in selectedData['points']:
            data_indexs.append(sel['customdata'][0])
    return selected_data_box(data_indexs)


if __name__ == '__main__':
    app.run_server(debug=True)
