$(".mot_de_passe").on("keyup", function () {
    //Si la valeur n'est pas vide
    if ($(this).val() != "") {
        let taille = $(".taille-mdp");
        taille.children().remove();
        taille.text("");
        let min = $(".min-mdp");
        min.children().remove();
        min.text("");
        let maj = $(".maj-mdp");
        maj.children().remove();
        maj.text("");
        let digit = $(".chiffre-mdp");
        digit.children().remove();
        digit.text("");
        //Vérifie qu'il y a au moins 8 caractères
        if (/^(.{10,})/.test($(this).val())) {
            taille.append('<i class="fas fa-check-circle" is-font-primary"></i> Au moins 10 caractères. (' + $(this).val().length + '/10)');
        } else {
            taille.append('<i class="fas fa-times-circle is-font-danger"></i> Au moins 10 caractères. (' + $(this).val().length + '/10)');
            // alert('Il faut au moins 10 caractères');
        }
        //Vérification du chiffre
        if (/^(?=.*\d)/.test($(this).val())) {
            digit.append('<i class="fas fa-check-circle is-font-primary"></i> Au moins 1 chiffre.');
        } else {
            digit.append('<i class="fas fa-times-circle is-font-danger"></i> Au moins 1 chiffre.');
            // alert('Il faut au moins 1 chiffre');
        }
        //Vérification de la minuscule
        if (/^(?=.*[a-z])/.test($(this).val())) {
            min.append('<i class="fas fa-check-circle is-font-primary"></i> Au moins 1 caractère en minuscule.');
        } else {
            min.append('<i class="fas fa-times-circle is-font-danger"></i> Au moins 1 caractère en minuscule.');
        }
        //Vérification de la majuscule
        if (/^(?=.*[A-Z])/.test($(this).val())) {
            maj.append('<i class="fas fa-check-circle is-font-primary"></i> Au moins 1 caractère en majuscule.');
        } else {
            maj.append('<i class="fas fa-times-circle is-font-danger"></i> Au moins 1 caractère en majuscule.');
            // alert('Il faut une majuscule');
        }
    } 
});






let mdp="mot de passe";
  // On Déclare dans la variable mot de passe le type de texte entré
  
  function verify(element1, element2)
  // La fonction reçois en paramètre les 2 éléments
   {
    let passed=false;
  // On va donner à la variable passed la valeur false (fausse).
  
     if (element1.value=='')
  // si le premier champ est vide (Propriété value vide)
     {
      alert("Veuillez entrer votre "+mdp+" dans le premier champ!");
  // c'est pas bien il faut le remplir :-)
  // On ouvre donc une boite d'alerte grâce à la méthode alert de l'objet window
      element1.focus();
  // et on y place le curseur grâce à la méthode focus
     }
  
  // puis on va faire exactement la même chose pour le second champ
     else if (element2.value=='')
     {
      alert("Veuillez confirmer votre "+mdp+" dans le second champ!");
      element2.focus()
     }
  
     else if (element1.value!=element2.value)
  /* Si les valeurs des 2 éléments ne sont pas égales (on utilise donc l'opérateur
    de comparaison d'inégalité != */
     {
      alert("Les deux "+mdp+" ne pas identiques");
  // toujours la boite d'alerte
      element1.select()
  // Et la on utilise la méthode select qui permet de selectionner la valeur écrite.
     }
  
     else{
     passed=true
     return passed
    }
   }