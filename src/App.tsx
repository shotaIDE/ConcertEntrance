import './App.css';
import 'firebase/firestore';

import * as firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';

import ConcertCard, { ConcertDetail } from './ConcertCard';
import ConcertCardSkeleton from './ConcertCardSkeleton';
import Header from './Header';

const firebaseConfig = {
  apiKey: "AIzaSyBf5eH4cl8Dk1pZR9R4yoWbXED9sVUlVGE",
  authDomain: "concertentrance.firebaseapp.com",
  databaseURL: "https://concertentrance.firebaseio.com",
  projectId: "concertentrance",
  storageBucket: "concertentrance.appspot.com",
  messagingSenderId: "957980872418",
  appId: "1:957980872418:web:61ab18ca9b37a66c8658bb",
};

firebase.initializeApp(firebaseConfig);
const datastore = firebase.firestore();

if (process.env.NODE_ENV === "development") {
  datastore.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

interface Props {}

const App = (_: Props) => {
  const [data, setData] = useState(new Array<ConcertDetail>());
  const [datetime, setDatetime] = useState(new Date(1990, 1, 1));

  useEffect(() => {
    datastore
      .collection("concert_list")
      .get()
      .then((querySnapshot) => {
        let fixedData: any[] = [];
        querySnapshot.forEach((document) => {
          const rawData = document.data();

          const heldDate = rawData.held_date;
          const heldTime = rawData.held_time;
          const heldDatetime =
            heldDate && heldTime ? `${heldDate} ${heldTime}` : "";

          const data = {
            title: rawData.title,
            heldDatetime: heldDatetime,
            program: rawData.program,
            onSaleDate: rawData.on_sale_date,
            heldPlace: rawData.held_place,
            payment: rawData.payment,
            srcUrl: rawData.src_url,
            description: rawData.description,
          };
          fixedData.push(data);
        });

        setData(fixedData);
      });

    datastore
      .collection("update_info")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((document) => {
          if (document.id !== "bravo") {
            return;
          }

          const rawData = document.data();
          const timestamp = rawData.datetime.seconds;
          const updateDatetime = new Date(timestamp * 1000);
          setDatetime(updateDatetime);
        });
      });
  }, []);

  const content =
    data.length === 0 ? (
      <ConcertCardSkeleton />
    ) : (
      data.map((concert, index) => {
        return <ConcertCard key={`${index}`} detail={concert} />;
      })
    );

  return (
    <div className="App">
      <Header update={datetime} />
      {content}
    </div>
  );
};

export default App;
