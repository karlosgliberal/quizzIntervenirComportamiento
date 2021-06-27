document.addEventListener("DOMContentLoaded", function () {
  const listaAciertos = [
    "1lindaa",
    "2cuadroc",
    "2cuadro2a",
    "2cuadro3b",
    "4mermeladaa",
    "4mermelada1b",
    "4bosqueb",
    "5blindspotc",
    "6cafeterial",
    "6cafeterias",
    "6cafeteria2",
    "6economistc",
    "6relatantarc",
    "6colonosd",
    "7mediasd",
    "7pillc",
    "7viajea",
    "7salariob",
    "7nievea",
    "7toallasb",
    "7origamia",
    "7aburrid",
  ];

  Reveal.configure({
    keyboard: {
      40: null,
      39: null,
      37: null,
      38: null
    },
  });

  var firebaseConfig = {
    apiKey: "AIzaSyCeYVlqBsH78W8ots365SUBmualI_p5TMg",
    authDomain: "quizz-cursos.firebaseapp.com",
    projectId: "quizz-cursos",
    storageBucket: "quizz-cursos.appspot.com",
    messagingSenderId: "104208096698",
    appId: "1:104208096698:web:a4dc6b9f9ae071935c9183",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  if ("nombreQuizz" in localStorage) {
    console.log("yes");
    document.getElementById("nombreQuizz").disabled = true;
  } else {
    document.getElementById("nombreQuizz").disabled = false;
    console.log("no");
  }

  document.querySelector("form").addEventListener("submit", formulario);

  function formulario(e) {
    const n = document.getElementById("nombreQuizz").value;
    localStorage.setItem("nombreQuizz", n);
    db.collection("curso")
      .doc(n)
      .set({ puntuacion: 0 })
      .then(() => {
        console.log("Document successfully written!");
        Reveal.down();
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    console.log("n:", n);
    e.preventDefault();
  }

  let invest = document.getElementById("invest");
  if (invest) {
    //const r = 10;
    let sketch = function (p) {
      let datos = [];

      p.preload = function () {
        db.collection("curso")
          .where("puntuacion", ">", 0)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              datos[doc.id] = doc.data().puntuacion;
            });
          })
          .then(() => {
            circulos();
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      };

      const count = 200;
      let y = 0;
      let firebaseInit = false;
      let cities = [];

      p.setup = function () {

        p.createCanvas(1280, 720);
        p.background("#fdff75");
        p.noStroke();
        p.colorMode(p.HSB, 100);
        p.blendMode(p.MULTIPLY);
        p.noiseDetail(2);
      };

      p.draw = function () {
        p.blendMode(p.BLEND);
        p.background("#fdff75");
        p.blendMode(p.MULTIPLY);

        if (firebaseInit) {
          drawCicless(
            [200, 200],
            cities[0][0],
            cities[0][1],
            400,
            0.8,
            0,2
          );
          drawCicless(
            [400, -40],
            cities[1][0],
            cities[1][1],
            100,
            0.3,
            0,7
          );
          drawCicless(
            [220, 350],
            cities[2][0],
            cities[2][1],
            400,
            0.6,
            0,2
          );
          drawCicless(
            [-250, -120],
            cities[3][0],
            cities[3][1],
            200,
            0.4,
            0,6
          );
          drawCicless(
            [-200, 150],
            cities[4][0],
            cities[4][1] ,
            100,
            0.3,
            0,7
          );
          drawCicless(
            [600, -300],
            cities[5][0],
            cities[5][1],
            1000,
            0.1,
            0,1
          );
        }
      

        y += 0.01;

      };

      function drawCicless(position, text, r, nis0, nis1, nis2) {
        p.translate(position[0], position[1]);
        r = r;
        drawCircle(p.color(25, 100, 100), nis0, r);
        drawCircle(p.color(60, 100, 60), nis1, r);
        drawCircle(p.color(0, 100, 80), nis2, r);

        p.push();
        p.translate(-60, 100);
        p.colorMode(p.RGB);
        p.fill(p.color(0,0,00));
        p.textSize(20);
        p.text(text +': '+r, 0, 0);
        p.textAlign(p.LEFT);
        p.pop()
      }
      function drawCircle(color, diff, r) {

        p.beginShape();
        p.fill(color);
        for (let i = 0; i <= count; i++) {
          const deg = (p.TWO_PI / count) * (i % count);
          const nr =
            p.noise((p.sin(deg) + 1) * 0.4, (p.cos(deg) + 1) * 0.4, y + diff) *
              100 +
            r;
          p.vertex(p.sin(deg) * nr, p.cos(deg) * nr);
        }
        p.endShape();  

      }

      function circulos() {
        db.collection("curso")
          .where("puntuacion", ">", 0)
          .orderBy("puntuacion", "desc")
          .limit(6)
          .onSnapshot((querySnapshot) => {
            p.push();
            querySnapshot.forEach((doc) => {
              console.log("mm");
              firebaseInit = true;
              cities.push([doc.id, doc.data().puntuacion]);
            });
            console.log(cities[1][0]);
            console.log("Current cities in CA: ", cities.join(", "));
          });
      }
    };
    new p5(sketch, "invest");
  }

  Reveal.on("slidechanged", (event) => {
    console.log(event);
    var inSlidesCorrect = listaAciertos.includes(event.currentSlide.id);
    var docRef = db
      .collection("curso")
      .doc(localStorage.getItem("nombreQuizz"));

    if (inSlidesCorrect) {
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data().puntuacion);
            var puntuacion = doc.data().puntuacion + 1;
            docRef
              .update({
                puntuacion: puntuacion,
              })
              .then(() => {
                console.log("Document successfully updated!");
              })
              .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  });
});
