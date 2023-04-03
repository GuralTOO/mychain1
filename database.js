const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, wallet TEXT)");
});

//most likely useless function that would return all reviews for a given professor. 90% sure we will replace this with blockchain lookup.
db.getReviews = (professorId) => {
  db.all(
    "SELECT * FROM XXX WHERE professorId = ?",
    [professorId],
    (err, rows) => {
      if (err) {
        console.error("Error getting reviews from database:", err);
        return rows;
      } else {
        return rows;
      }
    }
  );
};

//database function to return all universities
db.getUniversities = () => {
  db.all("SELECT * FROM XXX", (err, rows) => {
    if (err) {
      console.error("Error getting universities from database:", err);
      return rows;
    } else {
      return rows;
    }
  });
};

//database function to return all professors for a university
db.getProfessors = (universityId) => {
  db.all(
    "SELECT professorId FROM XXX WHERE universityId = ?",
    [universityId],
    (err, rows) => {
      if (err) {
        console.error("Error getting professors from database:", err);
        return rows;
      } else {
        return rows;
      }
    }
  );
};

module.exports = { db };
