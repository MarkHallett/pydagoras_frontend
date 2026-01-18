'use client'
import axios from 'axios'
import useWebSocket from 'react-use-websocket';
import { Graphviz } from 'graphviz-react';

import { useState, useEffect, useCallback } from 'react'
import { Form, Button } from "react-bootstrap";
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

const itemMap = {
  nodeA: 'A',
  nodeB: 'B',
  nodeC: 'C',
  nodeD: 'D',
  node_gbp_usd: 'gbp-usd',
  node_usd_eur: 'usd-eur',
  node_eur_gbp: 'eur-gbp'
};


// Reusable row for node input + optional per-node update button - defined OUTSIDE component
const NodeRow = React.memo(({ label, id, value, setValue, onSubmit, handleKeyDown, showButton = true }) => (
  <Row xs={2} md={4} lg={6}>
    <Col style={{ width: '100px' }}>
      {label}
    </Col>
    <Col>
      <Form.Control
        id={id} type="number" value={value} placeholder="Node value" onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '150px' }}
      />
    </Col>
    <Col style={{ paddingLeft: '0px'}}> 
      {showButton && ( <Button size="sm" variant="primary" type="button" onClick={onSubmit}> Update {label} </Button>)} 
    </Col>
  </Row>
));

const UpdateAll = React.memo(({ onSubmit }) => (
  <Row xs={2} md={4} lg={6}>
    <Col> 
      <Button size="sm" variant="primary" type="button" onClick={onSubmit}> Update All </Button> 
    </Col>
  </Row>
));

function DAGs() {

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
    if (lastMessage) {
      setMessageHistory(lastMessage.data);
      const msgType = lastMessage.data.split(':')[0];

      if (msgType === 'BasicDAG') {
        console.log("Found BasicDAG");
        setmessageBasicDAG(lastMessage.data);
      } else if (msgType === 'DupNodes') {
        console.log("Found DupNodes");
        setmessageDuplicateNodesDAG(lastMessage.data);
      } else if (msgType === 'FX') {
        console.log("Found FX");
        setmessageFxDAG(lastMessage.data);
      }
    }
  }, [lastMessage]);

  const [nodeA, setNodeA] = useState('');
  const [nodeB, setNodeB] = useState('');
  const [nodeC, setNodeC] = useState('');
  const [nodeD, setNodeD] = useState('');
  const [node_gbp_usd, setNodeGbpUsd] = useState('');
  const [node_usd_eur, setNodeUsdEur] = useState('');
  const [node_eur_gbp, setNodeEurGbp] = useState('');
  
  const [value, setValue] = useState('1');

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();
      const itemId = itemMap[event.target.id];
      if (itemId) {
        console.log('Send node/value', event.target.id, event.target.value);
        axios.patch(
          `${API_CALL}/items/${itemId}?value=${event.target.value}&client_id=${start}`,
          { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        ).catch(err => console.error(`Error updating ${itemId}:`, err));
      }
    }
  }, []);

  const sendPatch = (itemId, value) => {
    axios.patch(`${API_CALL}/items/${itemId}?value=${value}&client_id=${start}`,
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    ).catch(err => console.error(`Error updating ${itemId}:`, err));
  }

  const makeSubmitHandler = (itemId, stateValue) => (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    console.log(`Send node value, ${itemId}:`, stateValue);
    sendPatch(itemId, stateValue);
  };

  const makeBatchSubmitHandler = (itemIds, stateValues) =>
    useCallback((e) => {
      e.preventDefault();
      itemIds.forEach((id, i) => sendPatch(id, stateValues[i]));
    }, stateValues);

  const doSubmitA = useCallback(makeSubmitHandler('A', nodeA), [nodeA]);
  const doSubmitB = useCallback(makeSubmitHandler('B', nodeB), [nodeB]);
  const doSubmitC = useCallback(makeSubmitHandler('C', nodeC), [nodeC]);
  const doSubmitD = useCallback(makeSubmitHandler('D', nodeD), [nodeD]);
  const doSubmitGbpUsd = useCallback(makeSubmitHandler('gbp-usd', node_gbp_usd), [node_gbp_usd]);
  const doSubmitUsdEur = useCallback(makeSubmitHandler('usd-eur', node_usd_eur), [node_usd_eur]);
  const doSubmitEurGbp = useCallback(makeSubmitHandler('eur-gbp', node_eur_gbp), [node_eur_gbp]);


  const doSubmitBasic = makeBatchSubmitHandler(['A', 'B', 'C'], [nodeA, nodeB, nodeC]);

  const doSubmitDupNodes = makeBatchSubmitHandler(['A', 'B', 'D'], [nodeA, nodeB, nodeD]);
  
  const doSubmitFX = makeBatchSubmitHandler(['gbp-usd', 'usd-eur', 'eur-gbp'], [node_gbp_usd, node_usd_eur, node_eur_gbp]);


const handleChange = useCallback((event, newValue) => { setValue(newValue); }, []);

useEffect(() => {
  setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE));
  console.log('loaded!!')
}, []);

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
            <NodeRow label="A" id="nodeA" value={nodeA} setValue={setNodeA} onSubmit={doSubmitA} handleKeyDown={handleKeyDown} />
            <NodeRow label="B" id="nodeB" value={nodeB} setValue={setNodeB} onSubmit={doSubmitB} handleKeyDown={handleKeyDown} />
            <NodeRow label="C" id="nodeC" value={nodeC} setValue={setNodeC} onSubmit={doSubmitC} handleKeyDown={handleKeyDown} />
            <br />
            <UpdateAll onSubmit={doSubmitBasic} />
          </TabPanel>


          <TabPanel value="2">{GraphvizPage(messageDuplicateNodesDAG)}
            <br />
            <NodeRow label="A" id="nodeA" value={nodeA} setValue={setNodeA} onSubmit={doSubmitA} handleKeyDown={handleKeyDown} />
            <NodeRow label="B" id="nodeB" value={nodeB} setValue={setNodeB} onSubmit={doSubmitB} handleKeyDown={handleKeyDown} />
            <NodeRow label="D" id="nodeD" value={nodeD} setValue={setNodeD} onSubmit={doSubmitD} handleKeyDown={handleKeyDown} />
            <br />
            <UpdateAll onSubmit={doSubmitDupNodes} />
          </TabPanel>
          
          <TabPanel value="3">{GraphvizPage(messageFxDAG)}
            <br />
            <NodeRow label="gbp_usd" id="node_gbp_usd" value={node_gbp_usd} setValue={setNodeGbpUsd} onSubmit={doSubmitGbpUsd} handleKeyDown={handleKeyDown} />
            <NodeRow label="usd_eur" id="node_usd_eur" value={node_usd_eur} setValue={setNodeUsdEur} onSubmit={doSubmitUsdEur} handleKeyDown={handleKeyDown} />
            <NodeRow label="eur_gbp" id="node_eur_gbp" value={node_eur_gbp} setValue={setNodeEurGbp} onSubmit={doSubmitEurGbp} handleKeyDown={handleKeyDown} />
            <br />
            <UpdateAll onSubmit={doSubmitFX} />
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

function NotFound() {
  return (
    <div style={{margin:"10px"}}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

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