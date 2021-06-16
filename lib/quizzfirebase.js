document.addEventListener("DOMContentLoaded", function () {
  //Your code here

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
  console.log(firebase);

  var db = firebase.firestore();
  // Add a new document in collection "cities"
 

    document.querySelector("form").addEventListener("submit", get_number);
    function get_number(e){
        const n = document.getElementById("number").value;

            // Add a new document in collection "cities"
          db.collection("curso").doc("diseño").set({nombre: n})
         .then(() => {
            console.log("Document successfully written!");
         })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

        console.log('n:', n)
        e.preventDefault();
    }


});
