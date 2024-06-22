const express = require("express");
const AWS = require("aws-sdk");
const { Sequelize } = require("sequelize");

const app = express();
const port = 3000;


// AWS Configuration
S3_BUCKET = "your_bucket_name";
S3_REGION = "your_s3_region";

AWS.config.update({ region: S3_REGION });
const s3 = new AWS.S3();

// Database Configuration
const DB_NAME = "your_database_name";
const DB_USER = "your_database_user";
const DB_PASSWORD = "your_database_password";
const DB_HOST = "your_database_host";
const DB_PORT = 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// S3 Example
app.get("/upload", async (req, res) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: "test.txt",
    Body: "Hello from Node.js!",
  };

  try {
    const data = await s3.upload(params).promise();
    res.send({ message: `File uploaded successfully. ${data.Location}` });
  } catch (err) {
    res.status(500).send(err);
  }
});


//db example
app.get("/db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send({ message: "Connection has been established successfully." });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.send({ error: "Unable to connect to the database" });
  }
});


app.get("/", (req, res) => {
  res.send({ message: "Hello AWS Demo!" });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
