# coding: utf-8
import json
import os
import re
from datetime import datetime, timedelta, timezone

import requests
from bs4 import BeautifulSoup

from firestore import register_concerts

DATE_PATTERN = r"([0-9][0-9][0-9][0-9])/([0-9][0-9])/([0-9][0-9]).*"
date_re = re.compile(DATE_PATTERN)
TIME_PATTERN = r"([0-9][0-9]):([0-9][0-9])"
time_re = re.compile(TIME_PATTERN)
PROGRAM_PATTERN = r'(.*)^曲／([\S ]*)$\n*(.*)'
program_re = re.compile(PROGRAM_PATTERN, re.MULTILINE | re.DOTALL)
PAYMENT_PATTERN = r'(.*)^料金／([\S ]*)$\n*(.*)'
payment_re = re.compile(PAYMENT_PATTERN, re.MULTILINE | re.DOTALL)

JST = timezone(timedelta(hours=+9), 'JST')


def get_mock_list() -> str:
    sample_data_file = 'mock/sample_list.html'
    with open(sample_data_file, 'r', encoding='utf8') as f:
        sample_data = f.readlines()

    sample_data_str = ''.join(sample_data)
    return sample_data_str


def get_mock_details() -> str:
    sample_data_file = 'mock/sample_details.html'
    with open(sample_data_file, 'r', encoding='utf8') as f:
        sample_data = f.readlines()

    sample_data_str = ''.join(sample_data)
    return sample_data_str


def get_first_path() -> str:
    src_date = datetime.now()
    dst_date = src_date + timedelta(days=14)

    base_path = '/Concerts/lists'

    src_month_padded = f'{src_date.month}'.zfill(2)
    src_day_padded = f'{src_date.day}'.zfill(2)
    dst_month_padded = f'{dst_date.month}'.zfill(2)
    dst_day_padded = f'{src_date.day}'.zfill(2)

    query = (
        "/free1:"
        f'/search_release_date_from%255Byear%255D:{src_date.year}'
        f'/search_release_date_from%255Bmonth%255D:{src_month_padded}'
        f'/search_release_date_from%255Bday%255D:{src_day_padded}'
        f'/search_release_date_to%255Byear%255D:{dst_date.year}'
        f'/search_release_date_to%255Bmonth%255D:{dst_month_padded}'
        f'/search_release_date_to%255Bday%255D:{dst_day_padded}'
        "/search_concert_date_from%255Byear%255D:"
        "/search_concert_date_from%255Bmonth%255D:"
        "/search_concert_date_from%255Bday%255D:"
        "/search_concert_date_to%255Byear%255D:"
        "/search_concert_date_to%255Bmonth%255D:"
        "/search_concert_date_to%255Bday%255D:"
        "/search_concert_time_hour_from%255Bhour%255D:"
        "/search_concert_time_minute_from:"
        "/search_concert_time_hour_to%255Bhour%255D:"
        "/search_concert_time_minute_to:"
        "/price_upper:0"
        "/price_lower:5000"
        "/search_genre_id%255B0%255D:6"
        "/search_genre_id%255B1%255D:1"
        "/search_genre_id%255B3%255D:33"
        "/search_genre_id%255B4%255D:3"
        "/search_genre_id%255B5%255D:2"
        "/search_genre_id%255B6%255D:4"
        "/search_genre_id%255B7%255D:5"
        "/search_genre_id%255B8%255D:34"
        "/search_prefecture_id%255B0%255D:1")

    return f'{base_path}{query}'


def get_held_timestamp(held_date: str, held_time: str) -> datetime:
    date_matched = date_re.match(held_date)
    time_matched = time_re.match(held_time)

    if date_matched and time_matched:
        held_datetime = datetime.strptime(
            "{:} {:}".format(held_date, held_time),
            '%Y/%m/%d %H:%M')
        return held_datetime.astimezone(tz=JST)

    if date_matched:
        held_datetime = datetime.strptime(held_date, '%Y/%m/%d')
        return held_datetime.astimezone(tz=JST)


def main():
    IS_DEBUG = os.environ.get('IS_DEBUG') == '1'

    BRAVO_ORIGIN = 'https://search.ebravo.jp'

    summaries = []
    concert_details_raw = []

    fetch_path = get_first_path()

    while True:
        fetch_url = f'{BRAVO_ORIGIN}{fetch_path}'
        print(f'Fetch URL: {fetch_url}')

        if IS_DEBUG:
            fetched_text = get_mock_list()
        else:
            fetched_data = requests.get(fetch_url)
            fetched_text = fetched_data.text

        soup = BeautifulSoup(fetched_text, 'html.parser')
        summary_elems = soup.select(".listSummary")

        for summary_elem in summary_elems:
            title_elem = summary_elem.find('a')
            title = title_elem.get_text()
            url = title_elem.get('href')
            summaries.append({
                'title': title,
                'url': url
            })

            print(f'Found concert item: {title}, {url}')

        next_elem = soup.find('a', {'rel': 'next'})
        if next_elem is None:
            break

        fetch_path = next_elem.get('href')

        if IS_DEBUG:
            break

    for summary in summaries:
        src_path = summary['url']
        src_url = f'{BRAVO_ORIGIN}{src_path}'

        print(f'Fetch URL: {src_url}')

        if IS_DEBUG:
            fetched_text = get_mock_details()
        else:
            fetched_data = requests.get(src_url)
            fetched_text = fetched_data.text

        soup = BeautifulSoup(fetched_text, 'html.parser')

        detail_elem = soup.find(id='detail_area').find_all('tr')

        held_date_raw = detail_elem[0].find_all('td')[1].p.text
        held_date = held_date_raw[:10]

        held_time_raw = detail_elem[1].find_all('td')[1].p.text
        held_time = held_time_raw[:5]

        on_sale_date_raw = detail_elem[0].find_all('td')[3].p.text
        held_place = detail_elem[2].find_all('td')[1].p.text

        description_paragraphs = detail_elem[3].find_all('td')[1].find_all('p')
        description_list = [
            paragraph.text for paragraph in description_paragraphs]
        description = '\n'.join(description_list)

        concert_detail_raw = {
            'title': summary['title'],
            'src_url': src_url,
            'held_date': held_date,
            'held_time': held_time,
            'on_sale_date': on_sale_date_raw,
            'held_place': held_place
        }

        held_timestamp = get_held_timestamp(
            held_date=held_date, held_time=held_time)
        if held_timestamp is not None:
            concert_detail_raw['held_timestamp'] = held_timestamp

        program_matched = program_re.match(description)
        if program_matched:
            concert_detail_raw['program'] = program_matched.groups()[1]
            description = \
                program_matched.groups()[0] + program_matched.groups()[2]

        payment_matched = payment_re.match(description)
        if payment_matched:
            concert_detail_raw['payment'] = payment_matched.groups()[1]
            description = \
                payment_matched.groups()[0] + payment_matched.groups()[2]

        concert_detail_raw['description'] = description

        concert_details_raw.append(concert_detail_raw)

        if IS_DEBUG:
            break

    current_datetime = datetime.now(tz=JST)

    register_concerts(list=concert_details_raw, datetime=current_datetime)

    print('Completed to fetch data')


if __name__ == '__main__':
    main()
