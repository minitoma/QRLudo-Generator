$('#preview ,#empty').attr('disabled', true);

var dropZone = document.getElementById('dropZone');
var txtZone = document.getElementById('txtZone');
var qrCodes = [];
var qrCodeEnsemble;
var qrCodesUniqueSelectionne;

var txtDragAndDrop = document.createElement("P");

txtDragAndDrop.setAttribute("id", "txtDragAndDrop");
txtDragAndDrop.setAttribute("class", "col-sm-7");
txtDragAndDrop.setAttribute("style", "text-align: center; margin-top: 15%");
txtDragAndDrop.innerText = "Déposez vos fichiers ici";

txtZone.appendChild(txtDragAndDrop);
/*
 * Ce declenche quand un element entre dans la zone de drop
 */
dropZone.ondragenter = function(e){
};

/*
 * Ce declenche quand un element quitte la zone de drop
 */
dropZone.ondragleave = function(e){
};

/*
 * Ce declenche quand un element se deplace dans la zone de drop
 */
dropZone.ondragover = function(e){
    e.preventDefault();
};

/*
 * Ce declenche quand un element est depose dans la zone de drop
 */
dropZone.ondrop = function(e){
    e.preventDefault();

    txtDragAndDrop.remove();

    let afficherPopUp = false;
    let nomFichierIdentique = "";

    /*
     * Parcours le ou les fichiers drop dans la zone
     */
    for(let i = 0; i < e.dataTransfer.files.length; i++) {
        let words = e.dataTransfer.files[i].name.split(".");
        if(!occurenceFichier(words[0])){
            genererLigne(words[0]);
            recuperationQrCodeUnique(e.dataTransfer.files[i]);
            //recuperationQrCodeEnsemble(e.dataTransfer.files[i]);
        }else{
            afficherPopUp = true;
            nomFichierIdentique += "\t" + words[0] + "\n";
        }
    }

    /*
     * Affiche un popup avec le nom des fichiers qui n'ont pu être ajouté
     */
    if(afficherPopUp){
        messageInfos("Un ou plusieurs fichiers ont le même nom : " + nomFichierIdentique,"warning");
    }
};

/*
 * Genere une ligne dans la zone de drop en fonction des fichiers drop dans la zone
 * Chaque ligne est clickable pour affichier le qrCode unique
 * Chaque ligne a un bouton pour supprimer la ligne
 */
function genererLigne(name){
    let baliseDiv = document.createElement("DIV");
    let baliseSpan = document.createElement("SPAN");
    let baliseButton = document.createElement("BUTTON");
    let baliseI = document.createElement("I");
    let textDiv = document.createTextNode(name);

    baliseI.setAttribute("class", "fa fa-eraser");
    baliseI.setAttribute("style", "height:12px; width:12px;");

    baliseButton.addEventListener("click", effacerLigne);
    baliseButton.setAttribute("class", "btn btn-outline-success");
    baliseButton.appendChild(baliseI);

    baliseSpan.appendChild(textDiv);
    baliseSpan.setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");

    baliseDiv.addEventListener("click", afficherQrCode);
    baliseDiv.appendChild(baliseButton);
    baliseDiv.appendChild(baliseSpan);
    baliseDiv.id = name;

    txtZone.appendChild(baliseDiv);
}

/*
 * Parcours le ou les QR Code existant
 * Si une occurence est trouvé retourne true Sinon retourne false
 */
function occurenceFichier(name) {
    for (let i = 0; i < qrCodes.length; i++) {
        if (name == qrCodes[i].getName()) {
            return true;
        }
    }
    return false;
}

/*
 * Recupere les qrCodes qui sont lie à chaque fichier
 * Les sauvegardes dans le tableau qrCodes
 */
function recuperationQrCodeUnique(file){
    let facade = new FacadeController();
    facade.importQRCode(file, function (qrCode) {qrCodes.push(qrCode);});
}

/*
 * Supprime une ligne dans la zone de drop
 */
function effacerLigne(){
    let id = this.parentNode.id;
    let qrCodeTmp = [];

    /*
     * Supprime la ligne html lie au fichier
     */
    for(let i = 1; i <= txtZone.childElementCount; i++){
        if(txtZone.childNodes[i].id == id){
            txtZone.removeChild(txtZone.childNodes[i]);
        }
    }

    /*
     * Supprime le fichier dans le tableau files
     */
    for(let i = 0; i < qrCodes.length; i++){
        if(qrCodes[i].getName() != id){
            qrCodeTmp.push(qrCodes[i]);
        }
    }

    qrCodes = qrCodeTmp;
}

/*
 * Affiche le qrCode unique lie à la ligne cliquable
 */
function afficherQrCode(){
    let id = this.id;

    affichageLigneParDefault();

    this.querySelector("span").setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em; background-color:#99cc00;");

    /*
     * Affiche le qrCode que l'on vien de selectionner
     */
    for(let i = 0; i < qrCodes.length; i++){
        if(qrCodes[i].getName() == id){
            let facade = new FacadeController();
            facade.genererQRCode($('#qrView')[0], qrCodes[i]);
        }
    }

    qrCodesUniqueSelectionne = this;
}

/*
 * Redonne l'apparance par default d'une ligne
 */
function affichageLigneParDefault(){
    if(qrCodesUniqueSelectionne != null){
        if(qrCodesUniqueSelectionne.querySelector("span").hasAttribute("style")){
            qrCodesUniqueSelectionne.querySelector("span").setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
        }
    }
}

/*
 * Active le button vider et generer apres avoir donne un nom au qrCode
 */
function activer_button(){
    if (document.getElementById('qrName').value.length > 0)
    {
        $('#preview ,#empty').attr('disabled', false);
    }
}

/*
 * Recupere un QR Code ensemble pour le supprimer ou rajouter des données
 */
function recuperationQrCodeEnsemble(file){
    let facade = new FacadeController();
    facade.importQRCode(file, function (qrCode) {qrCodeEnsemble = qrCode;});

    setTimeout(suiteTraitement, 400);
}

/*
 * Suite du traitement de la recuperation du QR Code ensemble
 * 400 ms de sleep à cause de la fonction importQRCode
 */
function suiteTraitement() {
    let data = qrCodeEnsemble.getData();
    document.getElementById('qrName').value = qrCodeEnsemble.getName();
    activer_button();

    for(let i = 0; i < data.length; i++){
        console.log(data[i]);
        let qrCode = Object.assign(new QRCodeUnique("", [], ""), data[i]);
        qrCodes.push(qrCode);
        genererLigne(qrCode.getName());
    }
}

$().ready(function() {

  var settings = require("electron-settings");

  if (settings.has("defaultColor")) {
    $("#qrColor").val(settings.get("defaultColor"));
  }
    /*
     * Genere le qrCode Ensemble
     */
    $("#preview").click(function () {

        affichageLigneParDefault();

        var qrColor = $("#qrColor").val();
        let qrCodeEnsemble = new QRCodeEnsembleJson(document.getElementById('qrName').value, [],qrColor);

        // /*
        //  * Ajoute les donnees json de chaque qrCode unique dans le qrCode ensemble
        //  */
        // for(let i = 0; i < qrCodes.length; i++){
        //     for(let j = 0; j < qrCodes[i].getQRCode().data.length; j++){
        //         if((typeof qrCodes[i].getQRCode().data[j] === "object") && (qrCodes[i].getQRCode().data[j] !== null)){
        //             qrCodeEnsemble.ajouterQrCode(qrCodes[i].getQRCode().data[j]);
        //         }
        //     }
        // }

        for(let i = 0; i < qrCodes.length; i++){
            qrCodeEnsemble.ajouterQrCode(qrCodes[i]);
        }

        let facade = new FacadeController();
        facade.genererQRCode($('#qrView')[0],qrCodeEnsemble);

        $('#saveQRCode').attr('disabled', false);
    });

    /*
     * Vide les tableaux qrCodes, files et les lignes de la zone drop
     */
    $("#empty").click(function () {

        for(let i = txtZone.childElementCount; i > 0; i--){
            txtZone.removeChild(txtZone.firstElementChild);
            qrCodes.pop();
        }

        txtZone.appendChild(txtDragAndDrop);
    });

    $("#saveQRCode").on("click", function(){
      saveQRCodeImage();
    });

    // save image qr code
    function saveQRCodeImage() {
      const fs = require('fs');

      let img = $('#qrView img')[0].src;

      // var data = img.replace(/^data:image\/\w+;base64,/, '');

      var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      console.log(data);
      xhr.open('GET', data, true);

      xhr.onreadystatechange = function() {
        if (xhr.readyState == xhr.DONE) {
          var filesaver = require('file-saver');
          console.log(xhr.response);
          filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg');
        }
      }

      xhr.send();


      // fs.writeFile(`${root}/QR-Unique/QR/${qrcode.getName()}.jpeg`, data, {
      //   encoding: 'base64'
      // }, (err) => {
      //   if (err) throw err;
      //   messageInfos("votre QR est bien sauvegardé","success");
      // });

    }
});
