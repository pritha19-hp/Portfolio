const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");
const os = require("os");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

/* ================================
   ROOT ROUTE
   Test whether backend is running
================================ */

app.get("/", function(req, res) {
    res.send("Backend API is running!");
});


/* ================================
   CONTACT FORM
================================ */

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


    /* ================================
       EXCEL FILE LOCATION

       Vercel:
       Use /tmp because the project
       folder is read-only.

       Local:
       Use the original Excel location.
    ================================= */

    const isVercel = process.env.VERCEL === "1";

    const filePath = isVercel
        ? path.join(os.tmpdir(), "contact_info.xlsx")
        : path.join(__dirname, "..", "contact info.xlsx");


    /* ================================
       OPEN OR CREATE EXCEL FILE
    ================================= */

    let workbook;

    if (fs.existsSync(filePath)) {

        workbook = XLSX.readFile(filePath);

    } else {

        workbook = XLSX.utils.book_new();

        const worksheet = XLSX.utils.json_to_sheet([]);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Contacts"
        );

    }


    /* Get the first sheet */

    let sheetName = workbook.SheetNames[0];

    let worksheet = workbook.Sheets[sheetName];


    /* Convert Excel data to JavaScript */

    let data = XLSX.utils.sheet_to_json(worksheet);


    /* Add new contact */

    data.push({

        Name: name,
        Email: email,
        Message: message,
        Date: new Date().toISOString()

    });


    /* Convert JavaScript data back to Excel */

    let newWorksheet = XLSX.utils.json_to_sheet(data);

    workbook.Sheets[sheetName] = newWorksheet;


    /* Save Excel file */

    XLSX.writeFile(workbook, filePath);


    /* Send success response */

    res.json({

        message: "Contact information received successfully!"

    });

});


/* ================================
   LOCAL SERVER

   Only runs when testing locally.
   Vercel does NOT use app.listen().
================================ */

if (process.env.NODE_ENV !== "production") {

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, function() {

        console.log(
            `Backend server is running on http://localhost:${PORT}`
        );

    });

}


/* ================================
   EXPORT APP FOR VERCEL
================================ */

module.exports = app;
