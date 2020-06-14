import './App.css';
import 'firebase/firestore';

import * as firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';

import ConcertCard, { ConcertDetail } from './ConcertCard';

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
  });

  return (
    <div className="App">
      {data.map((concert, index) => {
        return <ConcertCard key={`${index}`} detail={concert} />;
      })}
    </div>
  );
};

export default App;
