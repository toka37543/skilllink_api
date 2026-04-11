const express = require('express');
const fs = require('fs');
const path = require('path');
const { passport } = require('./lib/passport');
const app = express();
const port = 3003;
app.use(express.json())
app.use(passport.initialize())

/*
 * define where all the orutes are 
 * init routesPath constant
 * 
 * read all files and folders from routesPath
 * if a file is found, register it as a route using app.use
 * 
 * if a folder is found, read all files inside the folder
 * for each file inside the folder, register it as a route using app.use
 * the route prefix should be the folder name 
 */

const routesPath = path.join(__dirname, 'routes');

fs.readdir(routesPath, (err, files) => {
  if (err) {
    console.log("Error reading files",err);
    return;
  }
  files.forEach(file => {
    const filePath = path.join(routesPath, file);
    if (fs.lstatSync(filePath).isFile()){
      const route = require(filePath);
      app.use(route);
    }
    
    if (fs.lstatSync(filePath).isDirectory()) {
      const dirFiles = fs.readdirSync(filePath);
      dirFiles.forEach(dirFile => {
        const dirFilePath = path.join(filePath, dirFile);
        const route = require(dirFilePath);
        const routePrefix = `/${file}`; // folder name as prefix

        app.use(routePrefix, route);
      });
    }
  });
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
