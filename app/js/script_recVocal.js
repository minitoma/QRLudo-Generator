

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
// Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse

var compteurReponse = 0;
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
                                 <input type="text" class="form-control col-sm-6" id="projectId`+ compteurReponse + `" rows="2" name="nomprojet"
                                placeholder="Réponse" onkeyup="activerSave();" />
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