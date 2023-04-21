const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS professors (profID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS university (univID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS course (cID INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS teaching (teachID INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(profID), universityID INTEGER REFERENCES university(univID), courseID INTEGER REFERENCES course(cID))"
  );
  //db.run('CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), university TEXT NOT NULL, rating INTEGER, review TEXT)');
  // // Trigger checks rating is between 0 and 10 before inserting new row
  //db.run('CREATE TRIGGER IF NOT EXISTS check_rating BEFORE INSERT ON reviews WHEN NEW.rating < 0 OR NEW.rating > 10 BEGIN SELECT RAISE(ABORT, "Rating must be between 0 and 10"); END;');
});

// INSERT Data
db.addProfessor = function (profName) {
  let success = false;
  try {
    success = db.run("INSERT INTO PROFESSORS (name) VALUES (?)", [profName]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.addUniversity = (name) => {
  let success = false;
  try {
    success = db.run("INSERT INTO UNIVERSITY (name) VALUES (?)", [name]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.addCourse = (code, name) => {
  let success = false;
  try {
    success = db.run("INSERT INTO COURSE (code, name) VALUES (?, ?)", [
      code,
      name,
    ]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.addTeaching = (professorID, universityID, courseID) => {
  let success = false;
  try {
    success = db.run(
      "INSERT INTO TEACHING (professorID, universityID, courseID) VALUES (?, ?, ?)",
      [professorID, universityID, courseID]
    );
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.addReview = (professorId, university, rating, reviewText) => {
  let success = false;
  try {
    success = db.run(
      "INSERT INTO REVIEWS (professorID, university, rating, review) VALUES (?, ?, ?, ?)",
      [professorId, university, rating, reviewText]
    );
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

// UPDATE Data
db.updateProfessor = (profID, blockchainID, name) => {
  let success = false;
  try {
    success = db.run(
      "UPDATE PROFESSORS SET blockchainID = ?, name = ? WHERE profID = ?",
      [blockchainID, name, profID]
    );
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.updateUniversity = (univID, name) => {
  let success = false;
  try {
    success = db.run("UPDATE University SET name = ? WHERE univID = ?", [
      name,
      univID,
    ]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.updateCourse = (cID, code, name) => {
  let success = false;
  try {
    success = db.run("UPDATE course SET code = ?, name = ? WHERE cID = ?", [
      code,
      name,
      cID,
    ]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.updateTeaching = (teachID, professorID, universityID, courseID) => {
  let success = false;
  try {
    success = db.run(
      "UPDATE teaching SET professorID = ?, universityID = ?, courseID = ? WHERE teachID = ?",
      [professorID, universityID, courseID, teachID]
    );
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

// DELETE Data
db.deleteProf = (profID) => {
  let success = false;
  try {
    success = db.run("Delete from PROFESSORS WHERE profID = ?", [profID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.deleteUniversity = (univID) => {
  let success = false;
  try {
    success = db.run("Delete from UNIVERSITY WHERE univID = ?", [univID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.deleteCourse = (cID) => {
  let success = false;
  try {
    success = db.run("Delete from COURSE WHERE cID = ?", [cID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

db.deleteTeaching = (cID) => {
  let success = false;
  try {
    success = db.run("Delete from TEACHING WHERE teachID = ?", [teachID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
};

// GET Data
// get all columns from university table
db.getUniversities = () => {
  db.all("SELECT * FROM university", (err, rows) => {
    if (err) {
      console.error("Error getting universities from the database:", err);
      return rows;
    } else {
      console.log(rows);
      return rows;
    }
  });
};

// get professor id given input professor name
db.getProfID = (name) => {
  db.all(
    "SELECT professors.profID FROM professors WHERE name = ?",
    [name],
    (err, rows) => {
      if (err) {
        console.error(
          "Error getting professor from the database:",
          err
        );
        return rows;
      } else {
        console.log(rows);
        return rows;
      }
    }
  );
};

// get professor id, professor blockchainID, professor name
// for professors who have taught at the universityid inputed
db.getProfessors = (universityID) => {
  db.all(
    "SELECT professors.profID, professors.name FROM professors INNER JOIN teaching ON professors.profID = teaching.professorID WHERE teaching.universityID = ?",
    [universityID],
    (err, rows) => {
      if (err) {
        console.error(
          "Error getting professor from the database for this university:",
          err
        );
        return rows;
      } else {
        console.log(rows);
        return rows;
      }
    }
  );
};

// return all columns from professors table
db.getAllProfessors = () => {
  db.all("SELECT * FROM professors", (err, rows) => {
    if (err) {
      console.error("Error getting all professor from the database:", err);
      return rows;
    } else {
      console.log(rows);
      return rows;
    }
  });
};

// return all professors with the name ?
db.getProfessorsName = (name) => {
  db.all("SELECT * FROM professors WHERE name = ?", [name], (err, rows) => {
    if (err) {
      console.error("Error getting professors from the database:", err);
      return rows;
    } else {
      console.log(rows);
      return rows;
    }
  });
};

// DROP TABLES
db.dropProfessors = () => {
  db.all("DROP TABLE IF EXISTS professors", (err, rows) => {
    if (err) {
      console.error("Error dropping professors table from from database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

db.dropUniversity = () => {
  db.all("DROP TABLE IF EXISTS university", (err, rows) => {
    if (err) {
      console.error("Error dropping university table from database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

db.dropCourse = () => {
  db.all("DROP TABLE IF EXISTS course", (err, rows) => {
    if (err) {
      console.error("Error dropping course table from database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

db.dropTeaching = () => {
  db.all("DROP TABLE IF EXISTS teaching", (err, rows) => {
    if (err) {
      console.error("Error dropping teaching table from database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

// test data
db.addDefaultProfessors = () => {
  db.serialize(() => {
    db.addProfessor("Jeffrey Carruthers");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(1, 1, 1);

    db.addProfessor("Sarah Johnson");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(2, 1, 2);

    db.addProfessor("David Kim");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(3, 1, 3);

    db.addProfessor("Samantha Lee");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(4, 1, 4);

    db.addProfessor("Brian Wilson");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(5, 1, 5);

    db.addProfessor("Jessica Kim");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(6, 1, 6);

    db.addProfessor("Daniel Lee");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(7, 1, 7);

    db.addProfessor("Melissa Jackson");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(8, 1, 8);

    db.addProfessor("Alex Nguyen");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(9, 1, 9);

    db.addProfessor("Sophia Rodriguez");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(10, 1, 10);

    db.addProfessor("Kevin Lee");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(11, 1, 11);

    db.addProfessor("Grace Kim");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(12, 1, 12);

    db.addProfessor("David Lee");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(13, 1, 13);

    db.addProfessor("Michelle Chen");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(14, 1, 14);

    db.addProfessor("Jason Park");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(15, 1, 15);

    db.addProfessor("Karen Lee");
    db.addCourse("CASCS101", "Intro to Programming");
    db.addTeaching(16, 1, 16);

    db.addProfessor("Ryan Kim");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(17, 1, 17);

    db.addProfessor("Jessica Park");
    db.addCourse("CASCS112", "Design by Software");
    db.addTeaching(18, 1, 18);

    db.addProfessor("Ethan Chen");
    db.addCourse("CASCS315", "Artificial Intelligence");
    db.addTeaching(19, 1, 19);

    db.addProfessor("Rachel Lee");
    db.addCourse("CASCS231", "Data Structures");
    db.addTeaching(20, 1, 20);

    db.addProfessor("Adam Smith");
    db.addCourse("CASCS420", "Web Development");
    db.addTeaching(21, 1, 21);
  });
};

module.exports = { db };

db.addDefaultProfessors();
//db.getProfID("Adam Smith");
//db.getAllProfessors();

//   db.getUniversities();
//   db.getAllProfessors();
//   db.getProfessors(1);
//   db.getProfessorsName("Lewis Tseng");