// File System
var fs = require("fs"); 

// Path
var path = require("path");

// ORM for communicating with MySQL
var Sequelize = require("sequelize"); 

// Identify basename of this file (index.js)
var basename = path.basename(module.filename);

// Identify environment being used or set to development
var env = process.env.NODE_ENV || "development";

// Load configuration based on environment
var config = require(__dirname + "/../config/config.js")[env];

// Initiatlize database as empty object
var db = {};

// If production, use production configuration
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} 
// Otherwise use other configuration
else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Synchronous call to read file names from models directory
// Filter through files in model directory
// Select those that aren't index.js, .env, and that end with .js
// Store models in database object with its name as key
fs.readdirSync(__dirname)
  .filter(function(file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// Create associates between each model if present
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Store sequelize object and sequelize object reference in database object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
