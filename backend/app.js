var createError = require("http-errors");
var express = require("express");
var path = require("path");
var mysql = require("mysql2");
var cors = require("cors");
var port = 3001;

//Connection Info
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pltnhan07072002",
  database: "HDMS2",
  multipleStatements: true,
});

//Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

//Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

//Signup, Login, Password Reset Related Queries

//Checks if patient exists in database
app.get("/checkIfPatientExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Patient WHERE p_email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//Creates User Account
app.get("/makeAccount", (req, res) => {
  let query = req.query;
  let name = query.name + " " + query.lastname;
  let dob = query.dob;
  let email = query.email;
  let phone = query.phone;
  let password = query.password;
  let province = query.province;
  let gender = query.gender;
  let sql_statement1 =
    `INSERT INTO Account (username, passwo, usertype) 
                       VALUES ` + `("${email}", "${password}", "Patient")`;
  console.log(sql_statement1);
  con.query(sql_statement1, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_statement1 =
        `INSERT INTO Patient (p_email, p_dob, p_name, p_province, p_biogender, p_phone) 
                            VALUES ` +
        `("${email}", "${dob}", "${name}", "${province}", "${gender}", "${phone}")`;
      console.log(sql_statement1);
      con.query(sql_statement1, function (error, results, fields) {
        if (error) throw error;
      });
      email_in_use = email;
      password_in_use = password;
      who = "pat";
      return res.json({
        data: results,
      });
    }
  });
});

//Checks If Doctor Exists
app.get("/checkIfDocExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE doc_email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//Makes Doctor Account
app.get("/makeDocAccount", (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let phone = params.phone;
  let sql_statement =
    `INSERT INTO Doctor (doc_email, doc_phone, doc_name) 
                       VALUES ` + `("${email}", "${phone}", "${name}")`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_statement =
        `INSERT INTO Account (username, passwo, usertype) 
                       VALUES ` + `("${email}", "${password}", "Doctor")`;
      console.log(sql_statement);
      con.query(sql_statement, function (error) {
        if (error) throw error;
      });
      email_in_use = email;
      password_in_use = password;
      who = "doc";
      return res.json({
        data: results,
      });
    }
  });
});

//Checks if patient is logged in
app.get("/checklogin", (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Account 
                       WHERE username="${email}" 
                       AND passwo="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: "error ocurred" });
    } else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = email;
        password_in_use = password;
        who = "pat";
      }
      return res.json({
        data: results,
      });
    }
  });
});

//Checks if doctor is logged in
app.get("/checkDoclogin", (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * 
                       FROM Account
                       WHERE username="${email}" AND passwo="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("eror");
      return res.status(500).json({ failed: "error ocurred" });
    } else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = email;
        password_in_use = password;
        who = "doc";
        console.log(email_in_use);
        console.log(password_in_use);
      }
      return res.json({
        data: results,
      });
    }
  });
});

//Returns Who is Logged in
app.get("/userInSession", (req, res) => {
  return res.json({ email: `${email_in_use}`, who: `${who}` });
});

//Logs the person out
app.get("/endSession", (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});

//Returns Date/Time of Appointment
app.get("/getDateTimeOfAppt", (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                          endtime as end, 
                          a_date as theDate 
                   FROM Appointment 
                   WHERE a_id = "${id}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({
        data: results,
      });
    }
  });
});

//Patient Info Related

//to get all doctor names
app.get("/docInfo", (req, res) => {
  let statement = "SELECT * FROM Doctor";
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//To return a particular patient history
app.get("/OneHistory", (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement =
    `SELECT p_biogender,p_name,p_email,p_province, p_phone
                    FROM Patient
                    WHERE p_email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//Returns Appointment Info To patient logged In
app.get("/patientViewAppt", (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT b.a_id as ID,
                  p.p_name as user, 
                  b.symptoms as theSymptoms, 
                  a.a_date as theDate,
                  a.starttime as theStart,
                  a.endtime as theEnd,
                  a.status as status
                  FROM Appointment a
                  JOIN PatientBookAppointment b ON a.a_id = b.a_id
                  JOIN Patient p ON b.p_id = p.p_id
                  WHERE p.p_email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//Checks if history exists
app.get("/checkIfHistory", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement =
    `SELECT p_email FROM Patient p 
                    JOIN PatientViewMedicalRecord v ON p.p_id = v.p_id
                    WHERE p_email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//Adds to Appointment Table
app.get("/addToPatientSeeAppt", (req, res) => {
  let pa = req.query;
  let email = pa.email;
  let id = pa.id;
  let symptoms = pa.symptoms;
  let sql = `SELECT p_id FROM Patient WHERE p_email = "${email}"`;
  con.query(sql, function (error, results, fields) {
    if (error) throw error;
    else {
      let p_id2 = results[0].p_id;
      let sql_try1 = `INSERT INTO PatientBookAppointment (p_id, a_id, symptoms)
                      VALUES (${p_id2}, ${id}, "${symptoms}")`;
      console.log(sql_try1);
      con.query(sql_try1, function (error, result, fields) {
        if (error) throw error;
      });
    }
  });
});

//Schedules Appointment
app.get("/schedule", (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10);
  let sql_date = `STR_TO_DATE('${ndate}', '%m/%d/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${time}', TIME)`;
  //sql to turn string to sql time obj
  let sql_end = `CONVERT('${endtime}', TIME)`;
  let doctor = params.doc;
  let symptom = params.symptoms;
  let sql_try = `INSERT INTO Appointment (a_id, a_date, starttime, endtime, status) 
                 VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
  console.log(sql_try);
  con.query(sql_try, function (error, result, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: result,
      });
    }
  });
  let sql_doctor = `SELECT doc_id as id FROM Doctor d WHERE doc_email = "${doctor}"`;
  con.query(sql_doctor, function (error, results, fields) {
    if (error) throw error;
    else {
      let doc_id = results[0].id;
      let sql_try1 = `INSERT INTO DoctorViewAppointment (doc_id, a_id)
                      VALUES (${doc_id}, ${id})`;
      console.log(sql_try1);
      con.query(sql_try1, function (error, results, fields) {
        if (error) throw error;
        else {
          let sql_try1 = `INSERT INTO MedicalRecord (mr_date, symptom) 
                                VALUES (${sql_date}, "${symptom}")`;
          console.log(sql_try1);
          con.query(sql_try1, function (error, results, fields) {
            if (error) throw error;
          });
        }
      });
    }
  });
});

//Generates ID for appointment
app.get("/genApptUID", (req, res) => {
  let statement =
    "SELECT a_id as id FROM Appointment ORDER BY id DESC LIMIT 1;";
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    }
  });
});

//To show appointments to doctor
app.get("/doctorViewAppt", (req, res) => {
  let params = req.query;
  let email = params.email;
  let sql_doctor = `SELECT doc_id as did FROM Doctor WHERE doc_email = "${email}"`;
  console.log(sql_doctor);
  con.query(sql_doctor, function (error, results, fields) {
    if (error) throw error;
    else {
      let doc_id = results[0].did;
      console.log(doc_id);
      let statement = `SELECT a.a_id as aid, a.a_date as date, a.starttime as starttime, a.status as status, p.p_name as name, pba.symptoms as symptoms
                    FROM Doctor d
                    JOIN DoctorViewAppointment dva ON d.doc_id=dva.doc_id
                    JOIN Appointment a ON dva.a_id = a.a_id
                    JOIN PatientBookAppointment pba ON a.a_id = pba.a_id
                    JOIN Patient p ON pba.p_id = p.p_id
                    WHERE d.doc_id = ${doc_id}`;
      console.log(statement);
      con.query(statement, function (error, result) {
        if (error) throw error;
        else {
          return res.json({
            data: result,
          });
        }
      });
    }
  });
});

// //To show diagnoses to patient
// app.get('/showDiagnoses', (req, res) => {
//   let id = req.query.id;
//   let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
//   console.log(statement);
//   con.query(statement, function (error, results, fields) {
//     if (error) throw error;
//     else {
//       return res.json({
//         data: results
//       })
//     };
//   });
// });

//To Show all diagnosed appointments till now
app.get("/allDiagnoses", (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement =
    `SELECT m.mr_date as date, m.symptom as symptom, m.disease as disease, m.treatment as treatment, d.doc_email as doctor
                  FROM MedicalRecord m
                  JOIN PatientViewMedicalRecord pvm ON m.mr_id = pvm.mr_id
                  JOIN Patient p ON pvm.p_id = p.p_id
                  JOIN DoctorViewMedicalRecord dvm ON m.mr_id = dvm.mr_id
                  JOIN Doctor d ON dvm.doc_id = d.doc_id
                  WHERE p.p_email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results,
      });
    }
  });
});

// //To delete appointment
// app.get('/deleteAppt', (req, res) => {
//   let a = req.query;
//   let uid = a.uid;
//   let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
//   console.log(statement);
//   con.query(statement, function (error, results, fields) {
//     if (error) throw error;
//     else {
//       results = results[0].status
//       if(results == "NotDone"){
//         statement = `DELETE FROM Appointment WHERE id=${uid};`;
//         console.log(statement);
//         con.query(statement, function (error, results, fields) {
//           if (error) throw error;
//         });
//       }
//       else{
//         if(who=="pat"){
//           statement = `DELETE FROM PatientsAttendAppointments p WHERE p.appt = ${uid}`;
//           console.log(statement);
//           con.query(statement, function (error, results, fields) {
//             if (error) throw error;
//           });
//         }
//       }
//     };
//   });
//   return;
// });

// If 404, forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;
