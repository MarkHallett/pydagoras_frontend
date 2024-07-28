# install.ksh

echo "install.ksh"

npm create vite mh -- --template react
cd mh

npm install axios
npm install --save react-use-websocket
npm install graphviz-react
npm install typescript --save-dev

npm install react-hook-form

npm install bootstrap
npm install react-tabs


cd src
cp /Users/python/pydagoras/git/mhwork/src/App.jsx .
cp /Users/python/pydagoras/git/mhwork/src/main.jsx .
