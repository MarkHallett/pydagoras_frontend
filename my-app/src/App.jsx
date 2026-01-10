'use client'
import axios from 'axios'
import useWebSocket from 'react-use-websocket';
import { Graphviz } from 'graphviz-react';

import { useState, useEffect } from 'react'

import { Form, Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'react-tabs/style/react-tabs.css'
import { MaterialReactTable , useMaterialReactTable, } from 'material-react-table'
import { useMemo } from 'react';

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';

//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const start = Date.now();

// -----------------------------------------------------------
const GetAPI_CALL = () => {
  if (process.env.NODE_ENV === 'production') {
       return 'https://pydagoras.com:8000'
  }
  return 'http://localhost:8000'
}

const GetSOCKET_URL_ONE = () => {
  if (process.env.NODE_ENV === 'production') {
       return 'wss://pydagoras.com:8000/ws/' + start;
  }
  return 'ws://localhost:8000/ws/' + start;
}

const API_CALL = GetAPI_CALL();
const SOCKET_URL_ONE = GetSOCKET_URL_ONE();
console.log('NODE ENV', process.env.NODE_ENV);

// -----------------------------------------------------------

const API_GET_PATCHES = API_CALL + '/patches'
const API_GET_CONNECTIONS = API_CALL + '/connections'

const GraphvizPage = (dag_str) => {
  if (Object.is(dag_str, null)) { 
       return 'no connection';
  } else {
       dag_str = dag_str.split(':')[1];
       return <Graphviz dot={dag_str} options={{height:200}} />;
  }
}

const MHTest = () => {
  return "{messageBasicDAG}"
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
        axios.patch(API_CALL + '/items/A?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeB') {
        axios.patch(API_CALL + '/items/B?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeC') {
        axios.patch(API_CALL + '/items/C?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'nodeD') {
        axios.patch(API_CALL + '/items/D?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'node_gbp_usd') {
        axios.patch(API_CALL + '/items/gbp-usd?value=' + event.target.value +'&client_id=' + start ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'node_usd_eur') {
        axios.patch(API_CALL + '/items/usd-eur?value=' + event.target.value +'&client_id=' + start ,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }

      if (event.target.id === 'node_eur_gbp') {
        axios.patch(API_CALL + '/items/eur-gbp?value=' + event.target.value +'&client_id=' + start,
         { headers: { 'Content-Type': 'application/json; charset=utf-8', } })
      }
    }
  }


function DAGs() {

  const connect_on_load = () => { setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE)) }

  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState(null);
  const [messageBasicDAG, setmessageBasicDAG] = useState(null);
  const [messageDuplicateNodesDAG, setmessageDuplicateNodesDAG] = useState(null);
  const [messageFxDAG, setmessageFxDAG] = useState(null);
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

        if (lastMessage.data.split(':')[0] === 'BasicDAG' ){
               console.log("Found BasicDAG");
               setmessageBasicDAG(lastMessage.data) ;
        };

        if (lastMessage.data.split(':')[0] === 'DupNodes' ){
               console.log("Found DupNodes");
               setmessageDuplicateNodesDAG(lastMessage.data) ;
        };

        if (lastMessage.data.split(':')[0] === 'FX' ){
               console.log("Found FX");
               setmessageFxDAG(lastMessage.data) ;
        };
    };
  }, [lastMessage, messageHistory, messageFxDAG, messageBasicDAG, messageDuplicateNodesDAG ]);

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];

  const [toggleStatusBasic, setToggleStatusBasic] = useState(true)
  const [toggleStatusDupNodes, setToggleStatusDupNodes] = useState(true)
  const [toggleStatusFX, setToggleStatusFX] = useState(true)

  const [nodeValue, setNodeValue] = useState(null)

  const doSubmitA= (e) => {
    e.preventDefault();
    console.log('Send node value, nodeA', nodeA)
    axios.patch(API_CALL + '/items/A?value=' + nodeA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmitB= (e) => {
    e.preventDefault();
    console.log('Send node value, nodeB', nodeB)
    axios.patch(API_CALL + '/items/B?value=' + nodeB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmitC= (e) => {
    e.preventDefault();
    console.log('Send node value, nodeC', nodeC)
    axios.patch(API_CALL + '/items/C?value=' + nodeC ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmitD= (e) => {
    e.preventDefault();
    console.log('Send node value, nodeD', nodeD)
    axios.patch(API_CALL + '/items/D?value=' + nodeD ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmitBasic= (e) => {
    e.preventDefault();
    console.log('Send all node values, nodeA', nodeA, 'nodeB', nodeB, 'nodeC', nodeC)

    axios.patch(API_CALL + '/items/A?value=' + nodeA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/B?value=' + nodeB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/C?value=' + nodeC ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

  const doSubmitDupNodes= (e) => {
    e.preventDefault();
    console.log('Send all node values, nodeA', nodeA, 'nodeB', nodeB, 'nodeD', nodeD)

    axios.patch(API_CALL + '/items/A?value=' + nodeA ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/B?value=' + nodeB ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/D?value=' + nodeD ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }
  
  const doSubmitFX= (e) => {
    e.preventDefault();
    console.log('Send all node values, node_gbp_usd', node_gbp_usd, 'node_usd_eur', node_usd_eur, 'node_eur_gbp', node_eur_gbp)

    axios.patch(API_CALL + '/items/gbp-usd?value=' + node_gbp_usd ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/usd-eur?value=' + node_usd_eur ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )

    axios.patch(API_CALL + '/items/eur-gbp?value=' + node_eur_gbp ,
    { headers: { 'Content-Type': 'application/json; charset=utf-8', } }
    )
  }

const [nodeA, setNodeA] = useState(0);
const [nodeB, setNodeB] = useState(0);
const [nodeC, setNodeC] = useState(0);
const [nodeD, setNodeD] = useState(0);
	
const [node_gbp_usd, setNodeGbpUsd] = useState(0);
const [node_usd_eur, setNodeUsdEur] = useState(0);
const [node_eur_gbp, setNodeEurGbp] = useState(0);



// NEW
const [value, setValue] = useState('1')
const handleChange = (event, newValue) => { setValue(newValue);
};

useEffect(() => {
//    const handleLoad = () => setPageLoaded(true)
    connect_on_load()
    console.log('loaded!!')
    },
    [])



return ( 
    <div style={{margin:"10px"}}>
    {
    <>
    {process.env.NODE_ENV}
      <h1>pydagoras</h1>
      <p>Input new values press enter and see the DAG update.</p>
      <p>For full details of this site see <a href="https://markhallett.github.io/pydagoras/">pydagoras documentation</a> </p>
      <p>Connection Status {readyStateString} </p>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Basic DAG" value="1" />
              <Tab label="Duplicate nodes" value="2" />
              <Tab label="FX DAG" value="3" />
            </TabList>
            </Box>
            <TabPanel value="1">
              {GraphvizPage(messageBasicDAG)}
              <br />
              <Row xs={2} md={4} lg={6}>
                <Col  style={{ width: '15px' }} >A</Col>
                <Col> <Form.Control 
                    id="nodeA"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeA(e.target.value)}
                    /> 
                </Col>
                <Col> <Button size="sm" 
                    variant="primary" 
                    type="submit" 
                    onClick={doSubmitA}> Update A </Button> 
                </Col>
              </Row>

              <Row xs={2} md={4} lg={6}>
                <Col  style={{ width: '15px' }} >B</Col>
                <Col> <Form.Control 
                    id="nodeB"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeB(e.target.value)}
                    /> 
                </Col>
                <Col> 
                  <Button size="sm" 
                          variant="primary" 
                          type="submit" 
                          onClick={doSubmitB}> Update B </Button> </Col>
              </Row>

              <Row xs={2} md={4} lg={6}>
              <Col  style={{ width: '15px' }} >C</Col>
              <Col> <Form.Control 
                    id="nodeC"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeC(e.target.value)}
                /> 
              </Col>
              <Col> 
                <Button size="sm" 
                    variant="primary" 
                    type="submit" 
                    onClick={doSubmitC}> 
                    Update C 
                </Button> 
              </Col>
            </Row>

            <Row xs={2} md={4} lg={6}>
              <Col> 
              </Col>
              </Row>
              <br />
              <Row xs={2} md={4} lg={6}>
                <Col> 
                  <Button size="sm" 
                     variant="primary" 
                     type="submit" 
                     onClick={doSubmitBasic}> Update All
                  </Button> 
                </Col>
              </Row>	
            </TabPanel>

            <TabPanel value="2">{GraphvizPage(messageDuplicateNodesDAG)}
              <Row xs={2} md={4} lg={6}>
                <Col  style={{ width: '15px' }} >A</Col>
                <Col> <Form.Control 
                    id="nodeA"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeA(e.target.value)} /> 
                </Col>
                <Col> <Button size="sm" 
                              variant="primary" 
                              type="submit" 
                              onClick={doSubmitA}> 
                              Update A </Button> 
                </Col>
              </Row>

              <Row xs={2} md={4} lg={6}>
                <Col  style={{ width: '15px' }} >B</Col>
                <Col> <Form.Control 
                    id="nodeB"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeB(e.target.value)} /> 
                </Col>
                <Col> <Button size="sm" 
                              variant="primary" 
                              type="submit" 
                              onClick={doSubmitB}> 
                              Update B 
                      </Button> 
                </Col>
              </Row>

              <Row xs={2} md={4} lg={6}>
                <Col  style={{ width: '15px' }} >D</Col>
                <Col> <Form.Control 
                          id="nodeD"
                          type="number" 
                          value={nodeValue}
                          placeholder="Node value" 
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setNodeD(e.target.value)} /> 
                </Col>
                <Col> <Button size="sm" 
                              variant="primary" 
                              type="submit" 
                              onClick={doSubmitD}> 
                              Update D 
                      </Button> 
                </Col>
              </Row>

              <Row xs={2} md={4} lg={6}>
                <Col> </Col>
              </Row>
              <br/>
              <Row xs={2} md={4} lg={6}>
                <Col> <Button size="sm" 
                              variant="primary" 
                              type="submit" 
                              onClick={doSubmitDupNodes}> Update All 
                      </Button> 
                </Col>
              </Row>
            </TabPanel>

            <TabPanel value="3">{GraphvizPage(messageFxDAG)}
              <Row xs={2} md={4} lg={6}>
                <Col>gbp-usd</Col>
                <Col> <Form.Control 
                    id="node_gbp_usd"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeGbpUsd(e.target.value)} /> 
                </Col>
              </Row>
              <Row xs={2} md={4} lg={6}>
                <Col>usd-eur</Col>
                <Col> <Form.Control 
                    id="node_usd_eur"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeUsdEur(e.target.value)} /> 
                </Col>
              </Row>

              <Row xs={2} md={4} lg={6}>
                <Col>eur-gbp</Col>
                <Col> <Form.Control 
                    id="node_eur_gbp"
                    type="number" 
                    value={nodeValue}
                    placeholder="Node value" 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setNodeEurGbp(e.target.value)} /> 
                </Col>
              </Row>
              <br />
              <Row xs={2} md={4} lg={6}>
                <Col> <Button size="sm" 
                              variant="primary" 
                              type="submit" 
                              onClick={doSubmitFX}> Update All 
                      </Button> 
                </Col>
              </Row>
          </TabPanel>


          </TabContext>
      </Box>
    </>
    }
    </div>
  );
}

function Connections() {
  console.log('IIII CONNECTIONS')
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simple API call
    fetch(API_GET_CONNECTIONS)
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
      <h1 className="text-2xl font-bold mb-4">Connections</h1>
      <MaterialReactTable table={tableConnections} />
    </div>
  </div>
  );
}

function Updates() {
  console.log('IIII Updates')

  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);


  useEffect(() => {
    // Simple API call
    fetch(API_GET_PATCHES)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

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
        header: "Value",
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
function DELRouter({ routes, children }) {
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
    { path: '/', component: DAGs },
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
            <NavLink to="/">DAGs</NavLink>
            <NavLink to="/connections">Connections Log</NavLink>
            <NavLink to="/updates">Updates Log</NavLink>
          </div>
        </div>

    </div>
  );
}

export default App

