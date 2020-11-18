

// Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse
/*var counter = 0

var alphaTab = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P"]


$("#ajouterQuestion").click(function(){
  if(counter < 15){
      var reponse = document.createElement('div');
      reponse.innerHTML = `<div class="form-row">
                            <div class="form-group col-md-2">
                                  <label class="control-label">`+alphaTab[counter]+`</label>
                                </div>
                         <div class="form-group col-md-2">
                                   <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheck`+alphaTab[counter]+`" style="width:70px;" value="option1" >
                                      <label class="form-check-label" for="gridCheck1">
                            </div>
                          <div class="form-group col-md-5">
                                 <input type="text" class="form-control col-sm-6" id="projectId`+alphaTab[counter]+`" rows="2" name="nomprojet"
                                placeholder="Reponse" onkeyup="activerSave();" />
                           </div>
                            <div class="form-group col-md-3">
                                <button id="deleteType`+alphaTab[counter]+`" type="button"
                                    class="btn btn-outline-success align-self-center" onclick=$(this).parent().parent("div").remove();>
                                    <i class="fa fa-trash"></i></button>
                                    </div>
                            </div>`;

      let container = $("#repContainer");
      container.append(reponse);
      counter ++ 
  }

})
*/


$(document).ready(function() {

  //méthode gérant la continuité
  enregistrement();

  // Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse
  var compteurReponse = 1;
  $("#ajouterQuestion").click(function () {

    compteurReponse++;
    if (compteurReponse < 30) {
      type = "Rreponse";
      let reponse = document.createElement('div');
      reponse.innerHTML = `<div class="form-row" id="divQuestion` + compteurReponse + `">
                              <div class="form-group col-md-3">
                                    <label class="control-label">Réponse `+ compteurReponse + ` :</label>
                                  </div>
                          <div class="form-group col-md-2">
                                    <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheck`+ compteurReponse + `" style="width:70px;" value="option"` + compteurReponse + ` >
                                        <label class="form-check-label" for="gridCheck`+ compteurReponse + `">
                              </div>
                            <div class="form-group col-md-6">
                                  <input type="text" class="form-control col-sm-6" id="reponse`+ compteurReponse + `" rows="2" name="nomprojet"
                                  placeholder="Réponse" />
                            </div>
                              <div class="form-group col-md-1">
                                  <button id="deleteQRCode`+ compteurReponse + `" type="button"
                                      class="btn btn-outline-success align-self-center" onclick="supprLigne(` + compteurReponse + ",\'" + type + `\');">
                                      <i class="fa fa-trash"></i></button>
                                      </div>
                              </div>`;

      let container = $("#repContainer");
      container.append(reponse);
    }
  })
});

//Pour supprimer une énigme ou bien une réponse 
function supprLigne(idLigne, element) {
  if (element == "Rreponse") {
    compteurReponse--;
    $("#divQuestion" + idLigne).on('click', function() {
      $(this).remove();
      for(let cpt = idLigne; cpt <= compteurReponse; cpt++) {
        let id = cpt+1;
        let div = $("#divQuestion" + id)[0].getElementsByTagName("div");
        div[0].getElementsByTagName("label")[0].innerHTML = "Réponse " + cpt + " :";
        div[1].getElementsByTagName("input")[0].id = "gridCheck" + cpt;
        div[1].getElementsByTagName("label")[0].for = "gridCheck" + cpt;
        div[2].getElementsByTagName("input")[0].id = "projectId" + cpt;
        div[3].getElementsByTagName("button")[0].id = "deleteQRCode" + cpt;
        div[3].getElementsByTagName("button")[0].setAttribute("onclick", "supprLigne(" + cpt + ",\'" + element +"\')");
        $("#divQuestion" + id)[0].id = "divQuestion" + cpt;
      }
    });
  }
}

$(document).ready(function() {
  $('div.info-content').css('display', 'none');

  $("a.nav-link").click(e => {
    e.preventDefault();
    let element = e.target;
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });

  $('.tab-content').find('a').click(e => {
    let href = $(e.target).attr('href');
    let display = $(href).css('display');

    if (display == 'block')
      $(href).fadeOut();
    else
      $(href).fadeIn();
  });

});

//script 
$("#emptyFields").click(function(){
    viderChamps();
  })


/*function myFunction() {
  document.getElementById("formulaireQCM").reset();
}*/

/*function viderZone(){
  controllerMultiple = new ControllerMultiple();
  $('#Question').val('');
  $('#Bonnereponse').val('');
  $('#MessageBonnereponse').val('');
  $('#MessageMauvaisereponse').val('');
  console.log("zaki");

}*/

function viderChamps(){
  $('#Question').val('');
  $('#Bonnereponse').val('');
  $('#MessageBonnereponse').val('');
  $('#MessageMauvaisereponse').val('');
  $('#reponseinitiale').val('');
  $('#QuestionQCM').val('');
  if($("#checkboxQR").is(':checked') == true){
    console.log("couco");
    $('#checkboxQR').prop('checked', false);
    console.log("dd")
  }
  $('#gridCheck1').prop('checked', false);
  $('#MessageMauvaisereponseQCM').val('');
  $('#MessageBonnereponseQCM').val('');
  console.log(compteurReponse);
    $("#repContainer").empty();
    /*localStorage.removeItem("Question");
    localStorage.removeItem("Bonnereponse");
    localStorage.removeItem("MessageBonnereponse");
    localStorage.removeItem("MessageMauvaisereponse");*/
   compteurReponse = 1; 


}







//test1
/*document.getElementById("Question").value = getSavedValue("Question");    // set the value to this input
document.getElementById("Bonnereponse").value = getSavedValue("Bonnereponse");   // set the value to this input
document.getElementById("MessageBonnereponse").value = getSavedValue("MessageBonnereponse");    // set the value to this input
document.getElementById("MessageMauvaisereponse").value = getSavedValue("MessageMauvaisereponse");   // set the value to this input
    var checkbox = document.getElementById('checkboxQR');
    localStorage.setItem('checkboxQR', checkbox.checked); 

function load(){    
    var checked = JSON.parse(localStorage.getItem('checkboxQR'));
    document.getElementById("checkboxQR").checked = checked;
    console.log('zzzz');
}
load();
function saveValue(e){
         var id = e.id;  
         var val = e.value; 
         localStorage.setItem(id, val);
}

        
function getSavedValue  (v){

  if (!localStorage.getItem(v)) {
     return "";
     }
     return localStorage.getItem(v);
}
*/







//test2
/*
//méthode gérant al continuité sur les eones de texte Question, Bonne Reponse, Mauvaise Reponse et nb reponse
function activerSave(text){
  
  var newText = $("#"+text).val();
  store.set(text,newText);
}*/

function enregistrement(){

  if(store.get(`Question`))
    $("#Question").val(store.get(`Question`));
  
//Question = store.get(`Question`);

  if(store.get(`Bonnereponse`) )
    $("#Bonnereponse").val(store.get(`Bonnereponse`));

  if(store.get(`MessageBonnereponse`) )
    $("#MessageBonnereponse").val(store.get(`MessageBonnereponse`));

  if(store.get('MessageMauvaisereponse'))
    $("#MessageMauvaisereponse").val(store.get('MessageMauvaisereponse'));


}

function activerSave(text){
  deleteStore(text);

  var newText = $("#"+text).val();
  store.set(text,newText);
}

function deleteStore(del){
  if(store.get(del) )
    store.delete(del);
}
