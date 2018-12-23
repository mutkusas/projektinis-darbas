const tf = require("@tensorflow/tfjs");

// Load the binding:
require("@tensorflow/tfjs-node"); // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

x_train = tf.tensor2d([], [0, 0]);
y_train = tf.tensor2d([], [0, 0]);

test_data = tf.tensor2d([], [0, 0]);
test_results = [];
pavadinimai = [];
var results;

async function predictWinner() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({ units: 280, inputShape: 6, activation: "sigmoid" })
  );
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: "adam", loss: "binaryCrossentropy", lr: 0.0001, metrics : ['accuracy'] });

  await model.fit(x_train, y_train, {
    batchSize: 40,
    epochs: 10
  });
  console.log("****************");
  results = model.predict(test_data, {metrics : ['accuracy']});
  console.log("****************");
  var stats = 0;
  test_results = results.data().then(function(results) {
    labels_test_tensor = tf.tensor2d(labels_test, [labels_test.length, 1]);
    test_results_tensor = tf.tensor2d(results, [results.length,1]);

      acc = tf.metrics.binaryAccuracy(labels_test_tensor, test_results_tensor);
      teisingu_sk = acc.cumsum();
      teisingu_sk.print();
  });
}

const sqlite3 = require("sqlite3").verbose();

var rungtynes = [];
var labels = [];

var rungtynes_test = [];
var labels_test = [];
// open database in memory
let db = new sqlite3.Database("db.db", err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Prisijungta prie duomenu bazes.");
});

db.serialize(() => {
  db.each(
    `SELECT NamaiEff as Ne,
    IsvykaEff as Ie,
    HomeWins as Hw,
    AwayWins as Aw,
    HomeTotalWins as Htw,
    AwayTotalWins as Atw,
    HomeEnemyWins as Hew,
    AwayEnemyWins as Aew,
    Iseitis as Iseit
             FROM rungtynes_v`,
    (err, row) => {
      if (err) {
        console.error(err.message);
      }
      var temp = [];
      temp.push(row.Hw);
      temp.push(row.Aw);
      temp.push(row.Htw);
      temp.push(row.Atw);
      temp.push(row.Hew);
      temp.push(row.Aew);
      labels.push(row.Iseit);
      rungtynes.push(temp);
      x_train = tf.tensor2d(rungtynes, [rungtynes.length, 6]);
      y_train = tf.tensor2d(labels, [rungtynes.length, 1]);
    }
  );
});

db.serialize(() => {
  db.each(
    `SELECT NamaiEff as Ne,
    IsvykaEff as Ie,
    HomeWins as Hw,
    AwayWins as Aw,
    HomeTotalWins as Htw,
    AwayTotalWins as Atw,
    HomeEnemyWins as Hew,
    AwayEnemyWins as Aew,
    Iseitis as Iseit,
    NamaiName,
    IsvykaName
             FROM rungtynes_v2`,
    (err, row) => {
      if (err) {
        console.error(err.message);
      }
      var temp = [];
      temp.push(row.Hw);
      temp.push(row.Aw);
      temp.push(row.Htw);
      temp.push(row.Atw);
      temp.push(row.Hew);
      temp.push(row.Aew);
      pavadinimai.push(row.NamaiName);
      pavadinimai.push(row.IsvykaName);
      labels_test.push(row.Iseit);
      rungtynes_test.push(temp);
      test_data = tf.tensor2d(rungtynes_test, [rungtynes_test.length, 6]);
    }
  );
});

db.close(err => {
  if (err) {
    return console.error(err.message);
  }
  predictWinner();
  console.log("Atsijungta nuo duomenu bazes.");
});
