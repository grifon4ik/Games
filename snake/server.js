const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const limitter = require("express-rate-limit");

const app = express();

const apiLimitter = limitter({
  windowMs: 2 * 60 * 1000,
  max: 2,
});

const localScores = {
  lvl1: [],
  lvl2: [],
};

function isPlaceholder(value) {
  if (!value) {
    return true;
  }

  return (
    value.startsWith("YOUR_") ||
    value.includes("_HERE") ||
    value === "your-project-id" ||
    value === "AIzaSy..."
  );
}

function isFirebaseConfigured() {
  return (
    !isPlaceholder(process.env.PROJECT_ID) &&
    !isPlaceholder(process.env.DATABASE_URL)
  );
}

let firebaseDB = null;

if (isFirebaseConfigured()) {
  const { initializeServerApp } = require("firebase/app");
  const { getDatabase } = require("firebase/database");

  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  };

  const firebaseApp = initializeServerApp(firebaseConfig, {});
  firebaseDB = getDatabase(firebaseApp);
  console.log("Firebase mode: cloud high scores enabled");
} else {
  console.log("Local mode: in-memory high scores (no Firebase required)");
}

const port = process.env.PORT || 1412;

app.use(express.static("public"));
app.use(express.json({ limit: "200b" }));

app.get("/getTheScore", async (_request, response) => {
  console.log("I Got A Request To Send Data!!");

  if (firebaseDB) {
    const { get, ref } = require("firebase/database");
    const [lvl1Data, lvl2Data] = await Promise.all([
      get(ref(firebaseDB, "Outdated Game/Snake Game/Level 1")),
      get(ref(firebaseDB, "Outdated Game/Snake Game/Level 2")),
    ]);

    response.json({
      lvl1: lvl1Data.val() ? Object.values(lvl1Data.val()) : [],
      lvl2: lvl2Data.val() ? Object.values(lvl2Data.val()) : [],
    });
    return;
  }

  response.json({
    lvl1: localScores.lvl1,
    lvl2: localScores.lvl2,
  });
});

app.post("/api", apiLimitter, async (request, response) => {
  console.log("I Got A Request To Add Data!!");

  const data = {
    name: request.body.name.substr(0, 15),
    score: request.body.score - 1,
  };

  if (
    (data.score >= 1456 || data.score != request.body.check) &&
    request.body.check != undefined
  ) {
    request.body.level = 2;
  }

  if (request.body.check == undefined) {
    data.score++;
  }

  if (request.body.level == 0) {
    if (firebaseDB) {
      const { push, ref } = require("firebase/database");
      await push(ref(firebaseDB, "Outdated Game/Snake Game/Level 1"), data);
    } else {
      localScores.lvl1.push(data);
      localScores.lvl1.sort((a, b) => b.score - a.score);
      localScores.lvl1 = localScores.lvl1.slice(0, 10);
    }
  } else if (request.body.level == 1) {
    if (firebaseDB) {
      const { push, ref } = require("firebase/database");
      await push(ref(firebaseDB, "Outdated Game/Snake Game/Level 2"), data);
    } else {
      localScores.lvl2.push(data);
      localScores.lvl2.sort((a, b) => b.score - a.score);
      localScores.lvl2 = localScores.lvl2.slice(0, 10);
    }
  } else {
    console.log("Data Adding Failed :(");
    response.end();
    return;
  }

  console.log(
    firebaseDB
      ? "Data Added To Firebase Successfully!!"
      : "Data Added To Local Scores Successfully!!"
  );
  response.end();
});

app.listen(port, () =>
  console.log(`Starting server at http://localhost:${port}`)
);
