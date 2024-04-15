'use client'
import { FormEvent } from 'react'
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Graphviz } from 'graphviz-react';


//const SOCKET_URL_ONE = 'ws://localhost:8888';
const SOCKET_URL_ONE = 'ws://localhost:8000/ws/123';
const READY_STATE_OPEN = 1;


const GraphvizPage = (xx) => {
  if (Object.is(xx, null)) { 
       return 'no connection';
  } else {
       console.log('use: ... ')
       console.log( xx)
       console.log( 'done')
       //const obj = JSON.parse( xx );
       //return 'xx';
       return <Graphviz dot={xx}/>;
       //return <Graphviz dot={obj}/>;
  }
}

const mhFunc= () => {
  console.log({isCheckBox1})
  //  <input id="isCheckBox1" type="checkbox" />
  console.log('Send some')
  console.log({isCheckBox1})
  console.log('Done')

    let body = [
     {
            'node_name' : 'Node3',
            'value' : 1,
        },
     {
            'node_name' : 'Node3',
            'value' : 2,
        },
     {
            'node_name' : 'Node3',
            'value' : 3,
        }
      ]

    let bodyj = JSON.stringify(body)

    console.log('post info' + bodyj)

    // if check box, then patch  *3
    axios.patch('http://localhost:8000/items/gbp-usd?value=1' ,
    { headers: {
           'Content-Type': 'application/json; charset=utf-8'
        }
    }
  )

    axios.patch('http://localhost:8000/items/usd-eur?value=1' ,
    { headers: {
           'Content-Type': 'application/json; charset=utf-8'
        }
    }
  )

    axios.patch('http://localhost:8000/items/eur-gbp?value=1' ,
    { headers: {
           'Content-Type': 'application/json; charset=utf-8'
        }
    }
  )


  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


  //if (Object.is(xx, null)) { 
  //     return 'no value';
  //} else {
  //     console.log('use: ' + xx)
  //     // const obj = JSON.parse(xx);
  //     return ;
  //}
}

//Generates the click handler, which returns a promise that resovles to the provided url.
const generateAsyncUrlGetter =
  (url, timeout = 2000) =>
  () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(url);
      }, timeout);
    });
  };
   

export default function Home () {
  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState(null);
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    currentSocketUrl,
    {
      share: true,
      shouldReconnect: () => false,
    }
  );
  const [inputtedMessage, setInputtedMessage] = useState('');

  useEffect(() => {
    lastMessage && setMessageHistory(lastMessage.data);
  }, [lastMessage]);

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];

 
  const [text, setText] = useState(111);
  const [text2, setText2] = useState(222);
  const [text3, setText3] = useState(333);
  let handleChange = (e) => setText(e.target.value)
  let handleChange2 = (e) => setText2(e.target.value)
  let handleChange3 = (e) => setText3(e.target.value)
  
 async function onSubmit2(event: FormEvent<HTMLFormElement>) {
   event.preventDefault()
   console.log(JSON.stringify({text2}))
   let body2 = {
            'node_name' : 'Node2',
            'value' : {text2}.text2
        }
   let bodyj2 = JSON.stringify(body2)
   console.log('post info' + bodyj2)


   axios.patch('http://localhost:8000/items/usd-eur?value='+{text2}.text2 ,
    { headers: {
           'Content-Type': 'application/json; charset=utf-8'
        }
    }
  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  }  

  async function onSubmit3(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(JSON.stringify({text3}))

    let body = {
            'node_name' : 'Node3',
            'value' : {text3}.text3,
        }

    let bodyj = JSON.stringify(body)

    console.log('post info' + bodyj)


    axios.patch('http://localhost:8000/items/eur-gbp?value='+{text3}.text3 ,
    { headers: {
           'Content-Type': 'application/json; charset=utf-8'
        }
    }

  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

   } 
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
     event.preventDefault()
     console.log(JSON.stringify({text}))

      let body = {
            'node_name' : 'Node1',
            'value' : {text}.text
        }
        let bodyj = JSON.stringify(body)
        console.log('post info' + body)


    axios.patch('http://localhost:8000/items/gbp-usd?value='+{text}.text ,
    { headers: {
           'Content-Type': 'application/json; charset=utf-8'
        }
    }

  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  }  



  return (

    <div>

      <button
        onClick={() =>
          setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE))
        }
        disabled={currentSocketUrl === SOCKET_URL_ONE}
      >
        {SOCKET_URL_ONE}
      </button>
      
      <br />
      ReadyState: {readyStateString}
      <br />
      <br />

    <form onSubmit={onSubmit}>
    Input Node 1:
    <input id="isCheckBox1" type="checkbox" />
      <input type="number" value={text} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
      
    <form onSubmit={onSubmit2}>
    Input Node 2:
    <input id="isCheckBox2" type="checkbox" />
      <input type="number" value={text2} onChange={handleChange2} />
      <button type="submit">Submit</button>
    </form>
      
    <form onSubmit={onSubmit3}>
    Input Node 3:
    <input id="isCheckBox3" type="checkbox" />
      <input type="number" value={text3} onChange={handleChange3} />
      <button type="submit">Submit</button>
    </form>
      
    <br />

      <div>
        <button
          onClick={() => mhFunc()}
          disabled={false}
          border-color='blue'
        >
          Send
        </button>
      </div>

      <br />
      <br />
        {GraphvizPage(messageHistory)}

    </div>
  );
};
