import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import json
import urllib.request
import plotly.express as px
from dash.dependencies import Input, Output
from datetime import datetime

# get datas
url = 'https://www.amcharts.com/lib/4/geodata/json/southKoreaHigh.json'
hdr = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=hdr)
with urllib.request.urlopen(req) as response:
    country_json = json.load(response)

# initialize datas
countries = {'전체': 'All', '서울': 'Seoul', '부산': 'Busan', '대구': 'Daegu', '인천': 'Incheon', '광주': 'Gwangju',
             '대전': 'Daejeon', '울산': 'Ulsan', '세종': 'Sejong', '경기': 'Gyeonggi', '강원': 'Gangwon',
             '충북': 'North Chungcheong', '충남': 'South Chungcheong', '전북': 'North Jeolla',
             '전남': 'South Jeolla', '경북': 'North Gyeongsang', '경남': 'South Gyeongsang', '제주': 'Jeju'}
pie_charts = {
    'fields': {'name': '지원 분야', 'key': '지원분야대', 'id': ['금융', '기술', '인력', '수출', '내수', '창업', '경영', '제도', '동반성장'],
               'select': ['금융', '기술', '인력', '수출', '내수', '창업', '경영', '제도', '동반성장']},
    'categoies': {'name': '업종', 'key': '업종',
                  'id': ['01~03', '05~08', '10~34', '35', '36~39', '41~42', '45~47', '49~52', '55~56', '58~63', '64~66', '68',
                         '70~73', '74~76', '84', '85', '86~87', '90~91', '94~96', '97~98', '99'],
                  'select': ['농업, 임업 및 어업', '광업', '제조업', '전기, 가스, 증기 및 공기 조절 공급업',
                             '수도, 하수 및 폐기물 처리, 원료 재생업', '건설업', '도매 및 소매업', '운수 및 창고업', '숙박 및 음식점업',
                             '정보통신업', '금융 및 보험업', '부동산업', '전문, 과학 및 기술 서비스업', '사업시설 관리, 사업 지원 및 임대 서비스업',
                             '공공 행정, 국방 및 사회보장 행정', '교육 서비스업', '보건업 및 사회복지 서비스업', '예술, 스포츠 및 여가관련 서비스업',
                             '협회 및 단체, 수리 및 기타 개인 서비스업', '가구 내 고용활동 및 달리 분류되지 않은 자가 소비 생산활동', '국제 및 외국기관']},
    'targets': {'name': '기업 형태', 'key': '기업형태', 'id': ['중소기업', '중견기업', '소상공인', '전통시장', '1인기업', '창업기업', '예비창업자'],
                'select': ['중소기업', '중견기업', '소상공인', '전통시장', '1인기업', '창업기업', '예비창업자']}
}
INITIAL_CHART = 'fields'
TODAY = datetime(2020, 3, 27)  # temporary date -> datetime.today()


def get_pie_chart(country, pie_df):
    # draw pie chart graph and return
    fig_pie = px.pie(pie_df, values='count', names='id', hover_data=['avg_inquiry'], hover_name='name',
                     labels={'id': '분류', 'name': pie_charts[chart]['name'], 'count': '지원사업 개수', 'avg_inquiry': '평균 조회수'})
    fig_pie.update_traces(textposition='inside')
    return fig_pie


def get_scatter_chart(country, scatter_df):
    # draw scatter chart graph and return
    fig_scatter = px.scatter(scatter_df, x='등록일자', y='조회수', color='접수기관_담당부서', hover_data=['평균조회수', scatter_df.index],
                             hover_name='제목', labels={'평균조회수': '하루평균조회수'})
    fig_scatter.update_layout(clickmode='event+select')
    return fig_scatter


def selected_data_box(data_indexs):
    # draw selected datas in selected-data-box when datas are selected in scatter graph
    return html.Ul([html.Li([html.P(projects.loc[i, '접수기관_담당부서']),
                             html.H6(projects.loc[i, '제목'][:13] + '...'),
                             html.Div([html.Span(projects.loc[i, '내용'])]),
                             html.Div([html.Span(projects.loc[i, '지원기간'])])]) for i in data_indexs],
                   id='selected-data-box')


# data preprocessing
df = pd.read_csv('file/bizinfodata2.csv', encoding='utf-8')
projects = pd.DataFrame(
    df, columns=['제목', '내용', '지역', '지원분야대', '지원기간', '기업형태', '업종', '조회수', '등록일자', '접수기관_담당부서'])
projects['등록일자'] = projects['등록일자'].str[:10]
projects['내용'] = projects['내용'].str.replace('<p style="margin: 0px">', '').str.replace(     # remove and replace html tags
    '&nbsp;', ' ').str.replace('R&amp;D', 'R&D').str.replace('<div>', '').str.replace('?', ' ').str[:20] + '...'
# to extract local dataframe, because str.len() == 50 contains all locals
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
pie_projects = {}
for country in countries:
    # get country data
    pie_data = {}
    data = country_projects[countries[country]]['data']
    for chart in pie_charts:
        # get value data
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
for country in countries:
    # get country data
    data = country_projects[countries[country]]['data'].copy()
    temp_time = data['등록일자'].str.split('-')
    for i in data.index:
        # convert 'YYYY-MM-DD' to datetime(YYYY, MM, DD)
        d = temp_time[i]
        t = datetime(int(d[0]), int(d[1]), int(d[2]))
        temp_time[i] = data.loc[i, '조회수'] // (TODAY - t).days
    data['평균조회수'] = temp_time
    scatter_projects[country] = data


# run dash
external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

# app layout
app.layout = html.Div([html.Header(),
                       html.Main([html.Div([html.H1("Bizbot 현재 지원사업")], id='title'),
                                  html.Div([html.Div([html.H5('지역별 정부지원사업'),
                                                      dcc.Graph(id='korea-map', figure=fig_geo)]),
                                            html.Div([html.Div([html.P(id='pie-chart-country'),
                                                                html.H5(id='pie-chart-value', className='chart-text-right-part')], className='chart-text'),
                                                      html.Div([
                                                          dcc.Dropdown(id='pie-labels', options=[{'label': pie_charts[i]['name'], 'value': i}
                                                                                                 for i in pie_data], value=INITIAL_CHART,
                                                                       style={'width': '55%', 'margin-top': '10px', 'margin-left': '10px'}),
                                                          dcc.Graph(id='pie-chart')], style={'border': '1px solid #f9f9f9', 'width': '500px'})])], id='first-part'),

                                  html.Div([html.Div([html.P(id='wordcloud-chart-country'),
                                                      html.H5('정부지원사업 워드 클라우드', className='chart-text-right-part')], className='chart-text'),
                                            html.Div([html.Img(id='wordcloud')], id='wordcloud-part')],
                                           id='second-part'),


                                  html.Div([html.Div([html.P(id='scatter-chart-country'),
                                                      html.H5('정부지원사업 산점도', className='chart-text-right-part')], className='chart-text', id='scatter-part-text'),
                                            dcc.Graph(
                                      id='scatter-chart'),
                                      html.Div([html.Div([
                                          html.P(
                                              'Selection Data'),
                                          html.H5('산점도에서 선택한 데이터가 보여집니다.', className='chart-text-right-part')], className='chart-text'),
                                          html.Div(id='selected-data')], id='scatter-selected-box')], id='third-part')
                                  ]),
                       html.Footer()])


# callback functions
@app.callback(
    # get country data and pie chart value and deliver to pie chart, wordcloud and scatter
    [Output('pie-chart-country', 'children'),
     Output('pie-chart-value', 'children'),
     Output('pie-chart', 'figure'),
     Output('wordcloud-chart-country', 'children'),
     Output('wordcloud', 'src'),
     Output('scatter-chart-country', 'children'),
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

    # wordcloud image source, loading time is too long, have to fix it
    img_src = 'https://raw.githubusercontent.com/bin7665/KNU-20201-team2-BizBot/master/file/' + \
        selectedData + '.png'

    return (selectedData + ' 지역', '정부지원사업 ' + pie_charts[value]['name'], get_pie_chart(selectedData, pie_projects[selectedData][value]),
            selectedData + ' 지역', img_src, selectedData + ' 지역', get_scatter_chart(selectedData, scatter_projects[selectedData]))


@app.callback(
    # get country data and selected datas in scatter and deliver to selected data box
    Output('selected-data', 'children'),
    [Input('korea-map', 'selectedData'),
     Input('scatter-chart', 'selectedData')])
def display_selected_data(mapData, selectedData):
    data_indexs = []
    if mapData == None or mapData['points'] == []:
        mapData = '전체'
    else:
        mapData = mapData['points'][0]['hovertext']

    if selectedData != None:
        for sel in selectedData['points']:
            data_indexs.append(sel['customdata'][1])

    return selected_data_box(data_indexs)


# run dash server
if __name__ == '__main__':
    app.run_server(debug=True)
