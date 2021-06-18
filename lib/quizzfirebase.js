document.addEventListener("DOMContentLoaded", function () {
  const listaAciertos = ['1lindaacierto', '2cuadroacierto', '2cuadro2acierto']; 
  Reveal.configure({
    keyboard: {
      //40: null,
    }
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

  document.querySelector("form").addEventListener("submit", get_number);

  function get_number(e) {
    const n = document.getElementById("nombreQuizz").value;
    localStorage.setItem("nombreQuizz", n);

    db.collection("curso")
      .doc(n)
      .set({ puntuacion:0})
      .then(() => {
        console.log("Document successfully written!");       
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    console.log("n:", n);
    e.preventDefault();
  }
  




  Reveal.on( 'slidechanged', event => {
    var n = listaAciertos.includes(event.currentSlide.id);
    if(n){
      var docRef = db.collection("curso").doc(localStorage.getItem("nombreQuizz"));
      docRef.get().then((doc) => {
        if (doc.exists) {
              console.log("Document data:", doc.data().puntuacion);
              var puntuacion = doc.data().puntuacion + 1;
              docRef.update({
                puntuacion: puntuacion
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    }

    console.log(n)
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
  } );
  
});
