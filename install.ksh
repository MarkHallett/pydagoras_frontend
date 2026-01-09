# install.ksh
echo "install.ksh"

# create base app
npm create vite pydagoras -- --template react

cd pydagoras

npm install axios
npm install --save react-use-websocket
npm install graphviz-react
npm install typescript --save-dev
npm install react-hook-form
npm install bootstrap
npm install react-router-dom
npm install material-react-table
npm install @mui/material 
npm install @emotion/react 
npm install @emotion/styled
npm install @mui/lab
npm install react-bootstrap
npm install react-tabs

# update the basic app area with the pydagoras files

# copy to base app, pydagoras files
cp ../my-app/src/App.jsx src
cp ../my-app/src/main.jsx src
cp ../my-app/index.html .
cp ../my-app/public/pydagoras.ico public
cp ../my-app/vite.config.js .

echo ""
echo "now ..."
echo "cd pydagoras"
echo "npm run dev -- --host"

