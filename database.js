const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS professors (profID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS university (univID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS course (cID INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS teaching (teachID INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(profID), universityID INTEGER REFERENCES university(univID), courseID INTEGER REFERENCES course(cID))');
  //db.run('CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), university TEXT NOT NULL, rating INTEGER, review TEXT)');
  // // Trigger checks rating is between 0 and 10 before inserting new row
  //db.run('CREATE TRIGGER IF NOT EXISTS check_rating BEFORE INSERT ON reviews WHEN NEW.rating < 0 OR NEW.rating > 10 BEGIN SELECT RAISE(ABORT, "Rating must be between 0 and 10"); END;');
});

// INSERT Data
db.addProfessor = function(profName) {
  let success = false;
    try {
      success = db.run("INSERT INTO PROFESSORS (name) VALUES (?)", [profName]);   
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
}

db.addUniversity = (name) => {
  let success = false;
    try {
      success = db.run("INSERT INTO UNIVERSITY (name) VALUES (?)", [name]);   
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
}

db.addCourse = (code, name) => {
  let success = false;
    try {
      success = db.run("INSERT INTO COURSE (code, name) VALUES (?, ?)", [code, name]);   
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
}

db.addTeaching = (professorID, universityID, courseID) => {
  let success = false;
    try {
      success = db.run("INSERT INTO TEACHING (professorID, universityID, courseID) VALUES (?, ?, ?)", [professorID, universityID, courseID]);   
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
}

db.addReview = (professorId, university, rating, reviewText) => {
  let success = false;
    try {
      success = db.run("INSERT INTO REVIEWS (professorID, university, rating, review) VALUES (?, ?, ?, ?)", [professorId, university, rating, reviewText]);
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  }

// UPDATE Data
db.updateProfessor = (profID, blockchainID, name) => {
  let success = false;
  try {
    success = db.run("UPDATE PROFESSORS SET blockchainID = ?, name = ? WHERE profID = ?", [blockchainID, name, profID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.updateUniversity = (univID, name) => {
  let success = false;
  try {
    success = db.run("UPDATE University SET name = ? WHERE univID = ?", [name, univID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.updateCourse = (cID, code, name) => {
  let success = false;
  try {
    success = db.run("UPDATE course SET code = ?, name = ? WHERE cID = ?", [code, name, cID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.updateTeaching = (teachID, professorID, universityID, courseID) => {
  let success = false;
  try {
    success = db.run("UPDATE teaching SET professorID = ?, universityID = ?, courseID = ? WHERE teachID = ?", [ professorID, universityID, courseID, teachID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

// DELETE Data
db.deleteProf = (profID) => {
  let success = false;
  try {
    success = db.run("Delete from PROFESSORS WHERE profID = ?", [profID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteUniversity = (univID) => {
  let success = false;
  try {
    success = db.run("Delete from UNIVERSITY WHERE univID = ?", [univID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteCourse = (cID) => {
  let success = false;
  try {
    success = db.run("Delete from COURSE WHERE cID = ?", [cID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteTeaching = (cID) => {
  let success = false;
  try {
    success = db.run("Delete from TEACHING WHERE teachID = ?", [teachID]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

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

// get professor id, professor blockchainID, professor name 
// for professors who have taught at the universityid inputed
db.getProfessors = (universityID) => {
  db.all("SELECT professors.profID, professors.name FROM professors INNER JOIN teaching ON professors.profID = teaching.professorID WHERE teaching.universityID = ?", 
  [universityID], 
  (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database for this university:", err);
      return rows;
    } else {
      console.log(rows);
      return rows;
    }
  });
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

// get Reviews for a professor by professor id
// db.getReviews = (id) => {
//   db.all("SELECT professors.name, reviews.university, reviews.rating, reviews.review FROM reviews INNER JOIN professors ON reviews.professorID = professors.id WHERE professors.ID = ?", [id], (err, rows) => {
//     if (err) {
//       console.error("Error getting reviews from database:", err);
//       return rows;
//     } else {
//       return rows;
//     }
//   });
// };

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

module.exports = { db };

db.serialize(() => {
  db.addProfessor("John Doe");
  db.addProfessor("Lewis Tseng");
  db.addUniversity("Boston College");
  db.addUniversity("Boston University");
  db.addCourse("CS101", "Introduction to Computer Science");
  db.addCourse("CS3000", "Blockchain and Consensus Systems");
  db.addTeaching(1, 2, 1);
  db.addTeaching(2, 1, 2);
  db.getUniversities();
  db.getAllProfessors();
  db.getProfessors(1);

  // UPDATE Data
//   db.updateProfessor(1, "Jane Doe");
//   db.updateUniversity(1, "MIT");
//   db.updateCourse(1, "CS102", "Computer Science II");
//   db.updateTeaching(1, 2, 2, "CS102");
//   db.getUniversities();
//   db.getAllProfessors();
//   db.getProfessors(1);

//   // DELETE Data
//   db.deleteProf(1);
//   db.deleteUniversity(1);
//   db.deleteCourse("CS102");
//   db.deleteTeaching(1);
//   db.deleteReview(1);

//   db.getUniversities();
//   db.getAllProfessors();
//   db.getProfessors(1);
});