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
import { MaterialReactTable , useMaterialReactTable, } from 'material-react-table'
import { useMemo } from 'react';

const start = Date.now();


// -----------------------------------------------------------
//const SOCKET_URL_ONE = 'ws://localhost:8000/ws/123';
const SOCKET_URL_ONE = 'ws://localhost:8000/ws/' + start;
const API_CALL = 'http://localhost:8000'
const API_CALL_PATCHES = 'http://localhost:8000/patches'


//const SOCKET_URL_ONE = 'wss://pydagoras.com:8000/ws/123';
//const SOCKET_URL_ONE = 'wss://pydagoras.com:8000/ws/' + start;
//const API_CALL = 'https://pydagoras.com:8000'
// -----------------------------------------------------------


const READY_STATE_OPEN = 1;

const GraphvizPage = (xx) => {
  if (Object.is(xx, null)) { 
       return 'no connection';
  } else {
       xx = xx.slice(2,xx.length);
       return <Graphviz dot={xx} options={{height:200}} />;
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
        axios.patch(API_CALL + '/items/gbp-usd?value=' + event.target.value +'&client_id=' + start ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeB') {
        axios.patch(API_CALL + '/items/usd-eur?value=' + event.target.value +'&client_id=' + start ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeC') {
        axios.patch(API_CALL + '/items/eur-gbp?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeAA') {
        axios.patch(API_CALL + '/items/A?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeBB') {
        axios.patch(API_CALL + '/items/B?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeCC') {
        axios.patch(API_CALL + '/items/C?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeDD') {
        axios.patch(API_CALL + '/items/D?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }


    }
  }



function Home() {

const columns = useMemo(
  () => [
    {
      header: 'Name',
      accessorKey: 'name', //simple recommended way to define a column
      //more column options can be added here to enable/disable features, customize look and feel, etc.
      //optional custom cell render
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '2ch', alignItems: 'center' }}>
          <img src={row.original.imageUrl} />
          <a href={row.profileUrl}>{row.name}</a>
        </Box>
      ),
    },
    //{
    //  header: 'Value',
    //  accessorFn: (dataRow) => parseInt(dataRow.age), //alternate way to access data if processing logic is needed
    //},
  ],
  [],
);


  const shoot = () => { console.log("Great Shot!"); }
  const lowd = () => { setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE)) }

  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState(null);
  const [messageHistoryA, setMessageHistoryA] = useState(null);
  const [messageHistoryB, setMessageHistoryB] = useState(null);
  const [messageHistoryC, setMessageHistoryC] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);

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
               console.log("Found A");
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

  const [toggleStatus2, setToggleStatus2] = useState(true)
  const [nodeValue2, setNodeValue2] = useState(null)

  const [toggleStatus3, setToggleStatus3] = useState(true)
  const [nodeValue3, setNodeValue3] = useState(null)

  const sendValue= (e) => {
    console.log("SEND SINGLE NODE VALUE")
  }

  const doSubmit= (e) => {
    e.preventDefault();
    console.log('Send all node values, nodeA', nodeA, 'nodeB', nodeB, 'nodeC', nodeC)

    axios.patch(API_CALL + '/items/gbp-usd?value=' + nodeA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/usd-eur?value=' + nodeB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/eur-gbp?value=' + nodeC ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmit2= (e) => {
    e.preventDefault();
    console.log('Send all node values, nodeAA', nodeAA, 'nodeBB', nodeBB, 'nodeCC', nodeCC)

    axios.patch(API_CALL + '/items/A?value=' + nodeAA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/B?value=' + nodeBB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/C?value=' + nodeCC ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmit3= (e) => {
    e.preventDefault();
    console.log('Send all node values, nodeAA', nodeAA, 'nodeBB', nodeBB, 'nodeDD', nodeDD)

    axios.patch('https://pydagoras.com:8000/items/A?value=' + nodeAA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch('https://pydagoras.com:8000/items/B?value=' + nodeBB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/D?value=' + nodeDD ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

const [nodeA, setNodeA] = useState(0);
const [nodeB, setNodeB] = useState(0);
const [nodeC, setNodeC] = useState(0);

const [nodeAA, setNodeAA] = useState(0);
const [nodeBB, setNodeBB] = useState(0);
const [nodeCC, setNodeCC] = useState(0);
const [nodeDD, setNodeDD] = useState(0);
	
// <body onload="setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE)">
//      alert("Working MH")
//        setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE))

useEffect(() => {
    const handleLoad = () => setPageLoaded(true)
    lowd()
    console.log('loaded!!')
    },
    [])


return ( 
    <div style={{margin:"10px"}}>
    {
    <>
      <h1>pydagoras</h1>
      <p> {SOCKET_URL_ONE} </p>
      <p>Look at the DAG images below.</p>
      <p>Input new values at the bottom of the page and see the updates in the DAGs.</p>
      <p>For full details of this site see <a href="https://markhallett.github.io/pydagoras/">pydagoras documentation</a> </p>
      <p>Connection Status {readyStateString} </p>
      <p>Basic examples</p>
      
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
                    onChange={(e) => setNodeA(e.target.value)} /> 
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
                    onChange={(e) => setNodeB(e.target.value)} /> 
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
                    onChange={(e) => setNodeC(e.target.value)} /> 
                </Col>
              </Row>
              <Row xs={2} md={4} lg={6}>
                <Col> </Col>
                <Col> <Form.Check
                    type="switch"
                    label= {toggleStatus ? "Send individually" : "Send all"} 
                    onClick = {() => setToggleStatus(!toggleStatus)} />
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
      <br />

        <Row xs={2} md={4} lg={6}>
          <Col>A</Col>
          <Col> <Form.Control 
                    id="nodeAA"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeAA(e.target.value)}
                /> 
            </Col>
        </Row>

        <Row xs={2} md={4} lg={6}>
          <Col>B</Col>
          <Col> <Form.Control 
                    id="nodeBB"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeBB(e.target.value)}
                /> 
            </Col>
        </Row>

        <Row xs={2} md={4} lg={6}>
          <Col>C</Col>
          <Col> <Form.Control 
                    id="nodeCC"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeCC(e.target.value)}
                /> 
            </Col>
        </Row>
	
          <Row xs={2} md={4} lg={6}>
            <Col> </Col>
            <Col> 
              <Form.Check
                  type="switch"
                  label= {toggleStatus2 ? "Send individually" : "Send all"} 
                  onClick = {() => setToggleStatus2(!toggleStatus2)}
                  />
            </Col>
          </Row>

          <Row xs={2} md={4} lg={6}>
            <Col> </Col>
            <Col> <Button variant="primary" type="submit" disabled={toggleStatus2} onClick={doSubmit2}> Submit </Button> </Col>
          </Row>


      </Container>
    </TabPanel>

    <TabPanel>
      <Container>
      {GraphvizPage(messageHistoryC)}
      <br />

        <Row xs={2} md={4} lg={6}>
          <Col>A</Col>
          <Col> <Form.Control 
                    id="nodeAA"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeAA(e.target.value)}
                /> 
            </Col>
        </Row>

        <Row xs={2} md={4} lg={6}>
          <Col>B</Col>
          <Col> <Form.Control 
                    id="nodeBB"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeBB(e.target.value)}
                /> 
            </Col>
        </Row>

        <Row xs={2} md={4} lg={6}>
          <Col>D</Col>
          <Col> <Form.Control 
                    id="nodeDD"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeDD(e.target.value)}
                /> 
            </Col>
        </Row>

          <Row xs={2} md={4} lg={6}>
            <Col> </Col>
            <Col> 
              <Form.Check
                  type="switch"
                  label= {toggleStatus3 ? "Send individually" : "Send all"} 
                  onClick = {() => setToggleStatus3(!toggleStatus3)}
                  />
            </Col>
          </Row>

          <Row xs={2} md={4} lg={6}>
            <Col> </Col>
            <Col> <Button variant="primary" type="submit" disabled={toggleStatus3} onClick={doSubmit3}> Submit </Button> </Col>
          </Row>

      </Container>
    </TabPanel>
  </Tabs>
  </>
  }
  </div>
);
}

function Connections() {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

 useEffect(() => {
    // Simple API call
    fetch('http://localhost:8000/connections')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const columns = useMemo(
    () => [
      {   
        accessorKey: "number", //simple recommended way to define a column
        header: "#",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
      {   
        accessorKey: "updater_id", //simple recommended way to define a column
        header: "Updater reference",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
      {   
        accessorKey: "connect_time", //simple recommended way to define a column
        header: "Connect time",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
      {   
        accessorKey: "disconnect_time", //simple recommended way to define a column
        header: "Disconnect time",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
      {   
	accessorKey: "client_id", //simple recommended way to define a column
	header: "Client ID",
	muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
	Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
    ],  
    []  
  ); 

  const tableConnections = useMaterialReactTable({
    data,
    columns
  }); 



  return (
    <div style={{margin:"10px"}}>
    <div className="p-8">
      <h1>pydagoras</h1>
      <p> {SOCKET_URL_ONE} </p>
      <MaterialReactTable table={tableConnections} />
    </div>
  </div>
  );
}

function Updates() {

  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);


 useEffect(() => {
    // Simple API call
    fetch('http://localhost:8000/patches')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);
  console.log('xxxxxxxxxxxxx')
  console.log(users)  

  const columns = useMemo(
    () => [
      {   
        accessorKey: "update_number", //simple recommended way to define a column
        header: "Update number",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },   
      {   
        accessorKey: "input", //simple recommended way to define a column
        header: "Input",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
      {   
        accessorKey: "value", //simple recommended way to define a column
        header: "Value1",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
      {   
        accessorFn: (row) => row.time_of_update, //alternate way 
        id: "time", //id required if you use accessorFn instead of accessorKey
        header: "Time_of_update",
        Header: <i style={{ color: "red" }}>TimeOfUpdate</i> //optional custom markup
      },   
      {   
        accessorKey: "updater_id", //simple recommended way to define a column
        header: "Updater ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong> //optional custom cell render
      },  
    ],  
    []  
  ); 

  const tableUpdates = useMaterialReactTable({
    data,
    columns
  }); 

  return (
    <div style={{margin:"10px"}}>
    <div className="p-8">
      <h1>pydagoras</h1>
      <p> {SOCKET_URL_ONE} </p>
      {API_CALL_PATCHES}

      <h1 className="text-2xl font-bold mb-4">Inputs</h1>
      
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="p-4 bg-white border rounded shadow">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>

      <MaterialReactTable table={tableUpdates} />



    </div>
  </div>
  );
}

// Simple Router Implementation
function Router({ routes, children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Make navigate function available globally
  window.navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const currentRoute = routes.find(route => route.path === currentPath);
  const Component = currentRoute ? currentRoute.component : NotFound;

  return <Component />;
}

// Navigation Hook
function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

//export default function App() {
// Main App with React Router
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const routes = [
    { path: '/', component: Home },
    { path: '/updates', component: Updates },
    { path: '/connections', component: Connections },
  ];

  const currentRoute = routes.find(route => route.path === currentPath);
  const CurrentComponent = currentRoute ? currentRoute.component : NotFound;

  const NavLink = ({ to, children }) => (
    <button
      onClick={() => navigateTo(to)}
      className={`px-4 py-2 mx-2 rounded transition-colors ${
        currentPath === to
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <main>
        <CurrentComponent />
      </main>

      {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/updates">Updates</NavLink>
            <NavLink to="/connections">Connections</NavLink>
          </div>
        </div>

    </div>
  );
}

export default App

