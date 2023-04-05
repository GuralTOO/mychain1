const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS professors (id INTEGER PRIMARY KEY AUTOINCREMENT, blockchainID INTEGER UNIQUE NOT NULL, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS university (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS course (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS teaching (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), universityID INTEGER REFERENCES university(id), courseID TEXT REFERENCES course(id))');
  //db.run('CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), university TEXT NOT NULL, rating INTEGER, review TEXT)');
  // Trigger checks rating is between 0 and 10 before inserting new row
  //db.run('CREATE TRIGGER IF NOT EXISTS check_rating BEFORE INSERT ON reviews WHEN NEW.rating < 0 OR NEW.rating > 10 BEGIN SELECT RAISE(ABORT, "Rating must be between 0 and 10"); END;');
});

// INSERT Data
db.addProfessor = (blockchainID, profName) => {
  let success = false;
    try {
      success = db.run("INSERT INTO PROFESSORS (blockchainID, name) VALUES (?, ?)", [blockchainID, profName]);   
    } catch (dbError) {
      console.error(dBerror);
    }
    return success.changes > 0 ? true : false;
}

db.addUniversity = (name) => {
  let success = false;
    try {
      success = db.run("INSERT INTO UNIVERSITY (name) VALUES (?)", [name]);   
    } catch (dbError) {
      console.error(dBerror);
    }
    return success.changes > 0 ? true : false;
}

db.addCourse = (code, name) => {
  let success = false;
    try {
      success = db.run("INSERT INTO COURSE (code, name) VALUES (?, ?)", [code, name]);   
    } catch (dbError) {
      console.error(dBerror);
    }
    return success.changes > 0 ? true : false;
}

db.addTeaching = (professorID, universityID, course) => {
  let success = false;
    try {
      success = db.run("INSERT INTO TEACHING (professorID, universityID, course) VALUES (?, ?, ?)", [professorID, universityID, courseID]);   
    } catch (dbError) {
      console.error(dBerror);
    }
    return success.changes > 0 ? true : false;
}

// UPDATE Data
db.updateProfessor = (id, blockchainID, name) => {
  let success = false;
  try {
    success = db.run("UPDATE PROFESSORS SET blockchainID = ?, name = ? WHERE id = ?", [blockchainID, name, id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.updateUniversity = (id, name) => {
  let success = false;
  try {
    success = db.run("UPDATE University SET name = ? WHERE id = ?", [name, id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.updateCourse = (id, code, name) => {
  let success = false;
  try {
    success = db.run("UPDATE course SET code = ?, name = ? WHERE id = ?", [name, code, id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.updateTeaching = (id, professorID, universityID, courseID) => {
  let success = false;
  try {
    success = db.run("UPDATE teaching SET professorID = ?, universityID = ?, courseID = ? WHERE id = ?", [ professorID, universityID, courseID, id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

// DELETE Data
db.deleteProf = (id) => {
  let success = false;
  try {
    success = db.run("Delete from PROFESSORS WHERE id = ?", [id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteUniversity = (id) => {
  let success = false;
  try {
    success = db.run("Delete from UNIVERSITY WHERE id = ?", [id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteCourse = (code) => {
  let success = false;
  try {
    success = db.run("Delete from COURSE WHERE code = ?", [code]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteTeaching = (id) => {
  let success = false;
  try {
    success = db.run("Delete from TEACHING WHERE id = ?", [id]);
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
      return rows;
    }
  });
};

// get professor id, professor blockchainID, professor name 
// for professors who have taught at the universityid inputed
db.getProfessors = (universityID) => {
  db.all("SELECT professor.id, professor.blockchainID, professor.name FROM professors INNER JOIN teaching ON professor.id = teaching.professorID WHERE teaching.universityID = ?", 
  [universityID], 
  (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

// return all columns from professors table
db.getAllProfessors = () => {
  db.all("SELECT * FROM professors", (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database:", err);
      return rows;
    } else {
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

module.exports = { db };