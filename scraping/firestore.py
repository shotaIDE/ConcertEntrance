# encoding: utf-8
import firebase_admin
from firebase_admin import credentials, firestore

from datetime import datetime


def register_concerts(list: list, datetime: datetime):
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

    db = firestore.client()
    cencert_list_collection = db.collection('concert_list')

    documents = cencert_list_collection.stream()
    for document in documents:
        document.reference.delete()

    for concert_detail in list:
        cencert_list_collection.add(concert_detail)
        print(f'Added details: {concert_detail}')

    bravo_update_collection = db.collection('update_info').document('bravo')

    update_info = {
        'datetime': datetime,
    }
    bravo_update_collection.set(update_info)

    formatted_datetime = datetime.strftime('%Y/%m/%d %H:%M:%S')
    print(f'Added timestamp: {formatted_datetime}')
