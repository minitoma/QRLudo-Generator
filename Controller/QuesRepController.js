/**
 * HARBOUL Abdessabour
 * 2018
 **/

/*
 * Classe permettant à la vue d'interagir avec le controller.
 * La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
 */
class QuesRepController {

  constructor() {}

  //Renvoie un nouveau projet
  creerprojet(nom, questions, reponses) {
    return new Projet(nom, questions, reponses);
  }

  //Renvoie une nouvelle question
  creerquestion(title, reponsesUIDs) {
    return new Question(title, reponsesUIDs);
  }

  //Renvoie une nouvelle reponse
  creerreponse(title) {
    return new Reponse(title);
  }

  //Ajouter une nouvelle valeur a la liste deroulante
  addNewValueToComboBox(new_val, selectid, modalIdToClose, array) {
    if (new_val === "") return false; // si le champ est vide on sort
    //sortir de la fonction si le champ entré existe deja
    let existe = false;
    $('select#' + selectid).find('option').each(function() {
      if ($(this).text() === new_val) {
        existe = true;
        return;
      }
    });
    if (existe) return false;
    //Ajouter a la liste deroulante la nouvelle valeur
    let nouvques = this.creerquestion(new_val, []);
    array.push(nouvques);
    $('#' + selectid).append($('<option>', {
      val: nouvques.id,
      text: new_val
    }));
    //fermer la pop-up
    $("#" + selectid).val(nouvques.id).change();
    $("#" + modalIdToClose + " .close").click();
    return true;
  }

  //Ajouter une nouvelle valeur a un tableau
  addNewValueToArray(new_val, my_array, modalIdToClose) {
    if (new_val === "") return false; // si le champ est vide on sort
    //sortir de la fonction si le champ entré existe deja
    let existe = false;
    $.each(my_array, function(i, val) {
      if (val.title === new_val) {
        existe = true;
        return;
      }
    });
    if (existe) return false;
    //Ajouter au tableau la nouvelle valeur
    my_array[my_array.length] = this.creerreponse(new_val);
    //fermer la pop-up
    $("#" + modalIdToClose + " .close").click();
    return true;
  }

  //Renvoie un Array des valeur d'une liste deroulante
  selectOptionsValuesAsArray(selectId) {
    let resArray = [];
    $('select#' + selectId).find('option').each(function() {
      resArray.push($(this).val());
    });
    return resArray;
  }

  clearModalForm(modal_id) {
    $('#' + modal_id).find('form')[0].reset();
  }


}
