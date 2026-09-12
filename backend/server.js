const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


/* Excel file location */

const filePath = path.join(__dirname, "..", "contact info.xlsx");


/* Receive contact form data */

app.post("/contact", function(req, res) {

    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;


    /* Check whether all fields are filled */

    if (!name || !email || !message) {

        return res.status(400).json({
            message: "Please fill all the fields."
        });

    }


    /* Open Excel file */

    let workbook = XLSX.readFile(filePath);


    /* Get the first sheet */

    let sheetName = workbook.SheetNames[0];

    let worksheet = workbook.Sheets[sheetName];


    /* Convert Excel data to JavaScript */

    let data = XLSX.utils.sheet_to_json(worksheet);


    /* Add new contact */

    data.push({
        Name: name,
        Email: email,
        Message: message
    });


    /* Convert data back to Excel */

    let newWorksheet = XLSX.utils.json_to_sheet(data);


    workbook.Sheets[sheetName] = newWorksheet;


    /* Save Excel file */

    XLSX.writeFile(workbook, filePath);


    res.json({
        message: "Contact information saved successfully!"
    });

});


/* Start server */

app.listen(3000, function() {

    console.log("Backend server is running on http://localhost:3000");

});