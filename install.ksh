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


cp ../my-app/src/App.jsx src
cp ../my-app/src/main.jsx src
cp ../my-app/index.html .

cd mh
npm run dev
