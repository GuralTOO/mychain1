const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run('CREATE TABLE professors (id INTEGER PRIMARY KEY AUTOINCREMENT, blockchainID INTEGER UNIQUE NOT NULL, name TEXT NOT NULL)');
  db.run('CREATE TABLE university (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  db.run('CREATE TABLE employment (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), universityID INTEGER REFERENCES university(id))');
  db.run('CREATE TABLE reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, professorID INTEGER REFERENCES professors(id), university TEXT NOT NULL, rating INTEGER, review TEXT)');
  // Trigger checks rating is between 0 and 10 before inserting new row
  db.run('CREATE TRIGGER check_rating BEFORE INSERT ON reviews WHEN NEW.rating < 0 OR NEW.rating > 10 BEGIN SELECT RAISE(ABORT, "Rating must be between 0 and 10"); END;');
});

// Create Data
db.addProfessor = (schoolID, profName) => {
  let success = false;
    try {
      success = db.run("INSERT INTO PROFESSORS (name) VALUES (?, ?)", [schoolID, profName]);   
    } catch (dbError) {
      console.error(dBerror);
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


// Update Data
db.deleteProf = (id) => {
  let success = false;
  try {
    success = db.run("Delete from PROFESSORS WHERE id = ?", [id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteReview = (id) => {
  let success = false;
  try {
    success = db.run("Delete from REVIEWS WHERE id = ?", [id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

// Delete Data
db.deleteProf = (id) => {
  let success = false;
  try {
    success = db.run("Delete from PROFESSORS WHERE id = ?", [id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

db.deleteReview = (id) => {
  let success = false;
  try {
    success = db.run("Delete from REVIEWS WHERE id = ?", [id]);
  } catch (dbError) {
    console.error(dbError);
  }
  return success.changes > 0 ? true : false;
}

// Read Data 
// database function to return all reviews for a professor
// wrap this in a function that takes in the id of the professor and returns the reviews
db.getReviews = (id) => {
  db.all("SELECT professors.name, reviews.university, reviews.rating, reviews.review FROM reviews JOIN professors ON reviews.professorID = professors.id WHERE professors.schoolID = ?", [schoolID], (err, rows) => {
    if (err) {
      console.error("Error getting reviews from database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

db.getProfessorID = (id) => {
  db.all("SELECT * FROM professors ON WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};


// Search by professor name
db.getProfessorName = (name) => {
  db.all("SELECT * FROM professors ON WHERE name = ?", [name], (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};



// Search by professor schoolID
db.getProfessorSchoolID = (schoolID) => {
  db.all("SELECT * FROM professors ON WHERE schoolID = ?", [schoolID], (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};


// Search by professor name, schoolID
db.getProfessorSchoolID = (name, schoolID) => {
  db.all("SELECT * FROM professors ON WHERE name = ? AND schoolID = ?", [name, schoolID], (err, rows) => {
    if (err) {
      console.error("Error getting professor from the database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

module.exports = { db, getReviews };