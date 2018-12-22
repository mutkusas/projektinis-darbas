const sqlite3 = require('sqlite3').verbose();
 
var rungtynes = [];
var labels = [];

var rungtynes_test = [];
var labels_test = [];
// open database in memory
let db = new sqlite3.Database('db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Prisijungta prie duomenu bazes.');
  });

  db.serialize(() => {
    db.each(`SELECT NamaiEff as Ne,
    IsvykaEff as Ie,
    HomeWins as Hw,
    AwayWins as Aw,
    HomeTotalWins as Htw,
    AwayTotalWins as Atw,
    HomeEnemyWins as Hew,
    AwayEnemyWins as Aew,
    Iseitis as Iseit
             FROM rungtynes_v`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.Ne + ' ' 
                    + row.Ie + ' '
                    + row.Hw + ' '
                    + row.Aw + ' '
                    + row.Htw + ' '
                    + row.Atw + ' '
                    + row.Hew + ' '
                    + row.Aew + ' '
                    + row.Iseit + ' '
                );
                rungtynes.push(row.Ne);
                rungtynes.push(row.Ie);
                rungtynes.push(row.Hw);
                rungtynes.push(row.Aw);
                rungtynes.push(row.Htw);
                rungtynes.push(row.Atw);
                rungtynes.push(row.Hew);
                rungtynes.push(row.Aew);
                labels.push(row.Iseit);
                console.log(rungtynes);
                console.log(labels);
    });
  });

  db.serialize(() => {
    db.each(`SELECT NamaiEff as Ne,
    IsvykaEff as Ie,
    HomeWins as Hw,
    AwayWins as Aw,
    HomeTotalWins as Htw,
    AwayTotalWins as Atw,
    HomeEnemyWins as Hew,
    AwayEnemyWins as Aew,
    Iseitis as Iseit
             FROM rungtynes_v2`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.Ne + ' ' 
                    + row.Ie + ' '
                    + row.Hw + ' '
                    + row.Aw + ' '
                    + row.Htw + ' '
                    + row.Atw + ' '
                    + row.Hew + ' '
                    + row.Aew + ' '
                    + row.Iseit + ' '
                );
                rungtynes_test.push(row.Ne);
                rungtynes_test.push(row.Ie);
                rungtynes_test.push(row.Hw);
                rungtynes_test.push(row.Aw);
                rungtynes_test.push(row.Htw);
                rungtynes_test.push(row.Atw);
                rungtynes_test.push(row.Hew);
                rungtynes_test.push(row.Aew);
                labels_test.push(row.Iseit);
                console.log(rungtynes);
                console.log(labels);
    });
  });
 
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Atsijungta nuo duomenu bazes.');
});