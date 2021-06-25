
$("#login").click(function () {
  $("#id01").show();
});


$("#close").click(function () {
  $("#id01").hide();
});


const modal = document.querySelector("#id01");
const modal2 = document.querySelector("#id02"); 
const modalBtn = document.querySelector("#mdp");

$("#mdp").click(function(){
  const name = document.getElementById("name").value
  const psw = document.getElementById("psw").value
  const login = "benjamin"
  const motdepasse = "benjamin"
  if ( name === login  && motdepasse === psw ) {
    modal.style.display = "none"
    modal2.style.display = "grid"
  }
  else{
    alert("Identifiant ou mot de passe incorrect")
  }
 
})
