'use client'
import axios from 'axios'
import useWebSocket from 'react-use-websocket';
import { Graphviz } from 'graphviz-react';

import { useState, useEffect } from 'react'

import { Form, Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

//const BACK_END_HOST = 'localhost';
const BACK_END_HOST = 'pydagoras.com';
const BACK_END_PORT = '8000';
const BACK_END = BACK_END_HOST + ':' + BACK_END_PORT;
const SOCKET_URL_ONE = 'ws://' + BACK_END + '/ws/123';
const READY_STATE_OPEN = 1;


const GraphvizPage = (xx) => {
  if (Object.is(xx, null)) { 
       return 'no connection';
  } else {
       xx = xx.slice(2,xx.length);
       return <Graphviz dot={xx}/>;
  }
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


const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('Send node/value', event.target.id, event.target.value)

      if (event.target.id === 'nodeA') {
        axios.patch('http://' + BACK_END + '/items/gbp-usd?value=' + event.target.value ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeB') {
        axios.patch('http://' + BACK_END + '/items/usd-eur?value=' + event.target.value ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeC') {
        axios.patch('http://' + BACK_END + '/items/eur-gbp?value=' + event.target.value ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }
    }
  }

function App() {

  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState(null);
  const [messageHistoryA, setMessageHistoryA] = useState(null);
  const [messageHistoryB, setMessageHistoryB] = useState(null);
  const [messageHistoryC, setMessageHistoryC] = useState(null);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    currentSocketUrl,
    {
      share: true,
      shouldReconnect: () => false,
    }
  );

  useEffect(() => {
    lastMessage && setMessageHistory(lastMessage.data);
   
    if (lastMessage){
        setMessageHistory(lastMessage.data);

        if (lastMessage.data.slice(0,1) === 'A' ){
               setMessageHistoryA(lastMessage.data) ;
        };

        if (lastMessage.data.slice(0,1) === 'B' ){
               console.log("Found B");
               setMessageHistoryB(lastMessage.data) ;
        };

        if (lastMessage.data.slice(0,1) === 'C' ){
               console.log("Found C");
               setMessageHistoryC(lastMessage.data) ;
        };
    };


  }, [lastMessage, messageHistory, messageHistoryA, messageHistoryB, messageHistoryC ]);

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];


  const [toggleStatus, setToggleStatus] = useState(true)
  const [nodeValue, setNodeValue] = useState(null)

  const sendValue= (e) => {
    console.log("SEND SINGLE NODE VALUE")
  }

  const doSubmit= (e) => {
    e.preventDefault();
    console.log('Send all node values, nodeA', nodeA, 'nodeB', nodeB, 'nodeC', nodeC)

    axios.patch('http://' + BACK_END + '/items/gbp-usd?value=' + nodeA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch('http://' + BACK_END + '/items/usd-eur?value=' + nodeB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch('http://' + BACK_END + '/items/eur-gbp?value=' + nodeC ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

const [nodeA, setNodeA] = useState(0);
const [nodeB, setNodeB] = useState(0);
const [nodeC, setNodeC] = useState(0);

return ( 
    <>
      <p></p>
      <h1>pydagoras</h1>
      <p>Basic examples</p>

        <Row xs={2} md={4} lg={6}>
          <Col>Backend websockets</Col>
          <Col>{SOCKET_URL_ONE}</Col>
        </Row>
        <Row xs={2} md={4} lg={6}>
          <Col></Col>
          <Col> <button type="button" 
               className="btn btn-primary me-3" 
               data-bs-toggle="connect" 
               data-bs-target="#offcanvasExample"
               onClick={() => setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE)) }
               disabled={currentSocketUrl === SOCKET_URL_ONE}
               >Connect</button>
          </Col>
        </Row>
        <Row xs={2} md={4} lg={6}>
          <Col>Connection Status</Col>
          <Col> {readyStateString} </Col>
        </Row>
        <p></p>
      
      <Tabs>
    <TabList>
      <Tab>Basic</Tab>
      <Tab>Long calculation</Tab>
      <Tab>Duplicate nodes</Tab>
    </TabList>

    <TabPanel>
    <Container>
      {GraphvizPage(messageHistoryA)}
      <br />

        <Row xs={2} md={4} lg={6}>
          <Col>gbp-usd</Col>
          <Col> <Form.Control 
                    id="nodeA"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeA(e.target.value)}
                /> 
            </Col>
        </Row>

      <Row xs={2} md={4} lg={6}>
        <Col>usd-eur</Col>
        <Col> <Form.Control 
                    id="nodeB"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeB(e.target.value)}
              /> 
        </Col>
      </Row>

      <Row xs={2} md={4} lg={6}>
        <Col>eur-gbp</Col>
        <Col> <Form.Control 
                    id="nodeC"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeC(e.target.value)}
        /> 
        </Col>
      </Row>

      <Row xs={2} md={4} lg={6}>
        <Col> </Col>
        <Col> 
          <Form.Check
              type="switch"
              label= {toggleStatus ? "Send individually" : "Send all"} 
              onClick = {() => setToggleStatus(!toggleStatus)}
          />
        </Col>
      </Row>

      <Row xs={2} md={4} lg={6}>
        <Col> </Col>
        <Col> <Button variant="primary" type="submit" disabled={toggleStatus} onClick={doSubmit}> Submit </Button> </Col>
      </Row>
    </Container>
    </TabPanel>
    <TabPanel>
      <Container>
       {GraphvizPage(messageHistoryB)}
      </Container>
    </TabPanel>
    <TabPanel>
      <Container>
      {GraphvizPage(messageHistoryC)}
      </Container>
    </TabPanel>
  </Tabs>
    </>
  )
}

export default App
