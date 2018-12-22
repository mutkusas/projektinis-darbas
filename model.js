const tf = require("@tensorflow/tfjs");

// Load the binding:
require("@tensorflow/tfjs-node"); // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

x_train = tf.tensor2d([], [0, 0]);
y_train = tf.tensor2d([], [0, 0]);

test_data = tf.tensor2d([], [0, 0]);
test_results = [];
pavadinimai = [];
var results;

//x_train.print();
//y_train.print();

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
  // console.log(results.dataSync());
  // console.log(tf.metrics.binaryAccuracy(labels_test, results));
  var stats = 0;
  test_results = results.data().then(function(results) {
    labels_test_tensor = tf.tensor2d(labels_test, [labels_test.length, 1]);
    test_results_tensor = tf.tensor2d(results, [results.length,1]);

      acc = tf.metrics.binaryAccuracy(labels_test_tensor, test_results_tensor);
      // console.log(acc.metrics);
      // console.log(acc.stats)
      // tf.cast(acc, 'int32').print();
      teisingu_sk = acc.cumsum();
      teisingu_sk.print(true);
      // acc.cumsum().print();
      // tf.print(teisingu_sk.values[teisingu_sk.shape], [teisingu_sk])
      // console.log(teisingu_sk);
      // console.log(teisingu_sk.shape[0]);
  });
  //   for (var i = 0; i < labels_test.length; i+2) {
  //     if (results[i] > 0.5) {
  //       results[i] = 1;
  //     } else {
  //       results[i] = 0;
  //     }
  //   console.log('rezultatas : ' + results[i] + ' realybe: ' + labels_test[i])
  //     if (results[i] == labels_test[i]){
  //       console.log("O " + (results[i] == 1 ? "*"+ pavadinimai[i] + ":" + pavadinimai[i+1] : pavadinimai[i] + ":" + pavadinimai[i+1] + "*"));
  //     } else {
  //       console.log("X " + (results[i] == 1 ? "*"+ pavadinimai[i] + ":" + pavadinimai[i+1] : pavadinimai[i] + ":" + pavadinimai[i+1] + "*"));
  //     }
  //     console.log("Spejimas: " + results[i] + " Realybe: " + labels_test[i] + " Komanda: " + pavadinimai[i]);
  //     if (results[i] == labels_test[i]) {
  //       stats++;
  //     }
  //   }
  //     // "MODELIS TEISINGAI ATSPEJO " +
  //     //   (stats / labels_test.length) * 100 +
  //     //   "% REZULTATU"
  // //   );
  // // }
  // });
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
      // console.log(
      //   row.Ne +
      //     " " +
      //     row.Ie +
      //     " " +
      //     row.Hw +
      //     " " +
      //     row.Aw +
      //     " " +
      //     row.Htw +
      //     " " +
      //     row.Atw +
      //     " " +
      //     row.Hew +
      //     " " +
      //     row.Aew +
      //     " " +
      //     row.Iseit +
      //     " "
      // );
      var temp = [];
      // temp.push(row.Ne);
      // temp.push(row.Ie);
      temp.push(row.Hw);
      temp.push(row.Aw);
      temp.push(row.Htw);
      temp.push(row.Atw);
      temp.push(row.Hew);
      temp.push(row.Aew);
      labels.push(row.Iseit);
      // if (row.Iseit == 0) {
      //   labels.push(1);
      // } else {
      //   labels.push(1);
      // }
      rungtynes.push(temp);
      x_train = tf.tensor2d(rungtynes, [rungtynes.length, 6]);
      y_train = tf.tensor2d(labels, [rungtynes.length, 1]);
      // console.log(rungtynes);
      // console.log(labels);
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
      // console.log(
      //   row.Ne +
      //     " " +
      //     row.Ie +
      //     " " +
      //     row.Hw +
      //     " " +
      //     row.Aw +
      //     " " +
      //     row.Htw +
      //     " " +
      //     row.Atw +
      //     " " +
      //     row.Hew +
      //     " " +
      //     row.Aew +
      //     " " +
      //     row.Iseit +
      //     " "
      // );
      var temp = [];
      // temp.push(row.Ne);
      // temp.push(row.Ie);
      temp.push(row.Hw);
      temp.push(row.Aw);
      temp.push(row.Htw);
      temp.push(row.Atw);
      temp.push(row.Hew);
      temp.push(row.Aew);
      pavadinimai.push(row.NamaiName);
      pavadinimai.push(row.IsvykaName);
      labels_test.push(row.Iseit);
      // if (row.Iseit == 0) {
      //   labels_test.push(1);
      //   labels_test.push(0);
      // } else {
      //   labels_test.push(0);
      //   labels_test.push(1);
      // }
      rungtynes_test.push(temp);
      test_data = tf.tensor2d(rungtynes_test, [rungtynes_test.length, 6]);

      //      console.log(rungtynes);
      // console.log(labels);
    }
  );
});

// close the database connection
db.close(err => {
  if (err) {
    return console.error(err.message);
  }
  predictWinner();
  console.log("Atsijungta nuo duomenu bazes.");
});
