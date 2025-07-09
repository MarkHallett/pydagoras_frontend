# install.ksh
# TODO add date to app dir

echo "install.ksh"

# create base app
npm create vite pydagoras -- --template react
cd pydagoras

npm install axios
npm install --save react-use-websocket
npm install graphviz-react
npm install typescript --save-dev
npm install react-hook-form
npm install bootstrap
npm install react-tabs
npm install react-router-dom

# update the basic app area with the pydagoras files
cp ../my-app/src/App.jsx src
cp ../my-app/src/main.jsx src
cp ../my-app/index.html .
cp ../my-app/public/pydagoras.ico public
cp ../my-app/vite.config.js .

cd 
#npm run dev -- --host
