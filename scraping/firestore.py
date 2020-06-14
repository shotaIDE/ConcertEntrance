# encoding: utf-8
import firebase_admin
from firebase_admin import credentials, firestore


def register_concerts(list: list):
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

    db = firestore.client()
    cencert_list_collection = db.collection('concert_list')

    documents = cencert_list_collection.stream()
    for document in documents:
        document.reference.delete()

    for concert_detail in list:
        cencert_list_collection.add(concert_detail)
        print(f'Added {concert_detail}')
