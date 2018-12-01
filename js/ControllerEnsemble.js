
const {
    QRCodeUnique
} = require(`${__dirname}/Model/QRCodeJson`);

const {
    QRCodeEnsemble
} = require(`${__dirname}/Model/QRCodeEnsembleJson`);

const {
    FacadeController
} = require(`${__dirname}/Controller/FacadeController`);

$('#preview ,#empty').attr('disabled', true);

var ligneSelectionne;
var dropZone = document.getElementById('dropZone');
var txtZone = document.getElementById('txtZone');
var files = [];
var qrCodes = [];

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

    let afficherPopUp = false;
    let nomFichierIdentique = "";

    /*
     * Parcours le ou les fichiers drop dans la zone
     */
    for(let i = 0; i < e.dataTransfer.files.length; i++) {
        if(!occurenceFichier(e.dataTransfer.files[i])){
            sauvegarderFichier(e.dataTransfer.files[i]);
            genererLigne(e.dataTransfer.files[i]);
            //recuperationQrCodeEnsemble(e.dataTransfer.files[i]);
        }else{
            afficherPopUp = true;
            nomFichierIdentique += "\t" + e.dataTransfer.files[i].name + "\n";
        }
    }

    /*
     * Affiche un popup avec le nom des fichiers qui n'ont pu être ajouté
     */
    if(afficherPopUp){
        messageInfos("Un ou plusieurs fichiers ont le même nom : " + nomFichierIdentique,"warning");
    }

    recuperationQrCodeUnique();
};

/*
 * Sauvegarde le fichier dans le tableau files
 */
function sauvegarderFichier(file){
    files.push(file);
}

/*
 * Genere une ligne dans la zone de drop en fonction des fichiers drop dans la zone
 * Chaque ligne est clickable pour affichier le qrCode unique
 * Chaque ligne a un bouton pour supprimer la ligne
 */
function genererLigne(file){
    var baliseDiv = document.createElement("DIV");
    var baliseSpan = document.createElement("SPAN");
    var baliseButton = document.createElement("BUTTON");
    var baliseI = document.createElement("I");
    var textDiv = document.createTextNode(file.name);

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
    baliseDiv.id = file.name;

    txtZone.appendChild(baliseDiv);
}

/*
 * Parcours le ou les fichiers existant
 * Si une occurence est trouvé retourne true Sinon retourne false
 */
function occurenceFichier(file) {
    for (var j = 0; j < files.length; j++) {
        if (file.name == files[j].name) {
            return true;
        }else{
            return false;
        }
    }

    return false;
}

/*
 * Recupere les qrCodes qui sont lie à chaque fichier
 * Les sauvegardes dans le tableau qrCodes
 */
function recuperationQrCodeUnique(){
    qrCodes = [];

    let facade = new FacadeController();

    for(var i = 0; i < files.length; i++){
        facade.importQRCode(files[i], function (qrCode) {qrCodes.push(qrCode);});
    }
}

/*
 * Supprime une ligne dans la zone de drop
 */
function effacerLigne(){
    let id = this.parentNode.id;
    let fichiersTmp = [];

    /*
     * Supprime la ligne html lie au fichier
     */
    for(var i = 1; i <= txtZone.childElementCount; i++){
        if(txtZone.childNodes[i].id == id){
            txtZone.removeChild(txtZone.childNodes[i]);
        }
    }

    /*
     * Supprime le fichier dans le tableau files
     */
    for(var i = 0; i < files.length; i++){
        if(files[i].name != id){
            fichiersTmp.push(files[i]);
        }
    }

    files = fichiersTmp;

    recuperationQrCodeUnique();
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
    for(var i = 0; i < files.length; i++){
        if(files[i].name == id){
            let facade = new FacadeController();
            facade.genererQRCode($('#qrView')[0], qrCodes[i]);
        }
    }

    ligneSelectionne = this;
}

/*
 * Redonne l'apparance par default d'une ligne
 */
function affichageLigneParDefault(){
    if(ligneSelectionne != null){
        if(ligneSelectionne.querySelector("span").hasAttribute("style")){
            ligneSelectionne.querySelector("span").setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
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

$().ready(function() {
    /*
 * Genere le qrCode Ensemble
 */
    $("#preview").click(function () {

        affichageLigneParDefault();

        let qrCodeEnsemble = new QRCodeEnsemble(document.getElementById('qrName').value, [],"#000000");

        /*
         * Ajoute les donnees json de chaque qrCode unique dans le qrCode ensemble
         */
        /*for(var i = 0; i < qrCodes.length; i++){
            for(var j = 0; j < qrCodes[i].getQRCode().data.length; j++){
                if((typeof qrCodes[i].getQRCode().data[j] === "object") && (qrCodes[i].getQRCode().data[j] !== null)){
                    qrCodeEnsemble.ajouterQrCode(qrCodes[i].getQRCode().data[j]);
                }
            }
        }*/

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
        qrCodes = [];
        for(var i = txtZone.childElementCount; i > 0; i--){
            txtZone.removeChild(txtZone.firstElementChild);
            files.pop();
        }
    });

    $("#saveQRCode").click(function () {
        console.log("save");
        saveQRCodeImage("/QR-Ensemble/QR/");
    });
});

/*function recuperationQrCodeEnsemble(){
    qrCodes = [];

    let facade = new FacadeController();

    for(var i = 0; i < files.length; i++){
        facade.importQRCode(files[i], function (qrCode) {qrCodes.push(qrCode);});
    }

    setTimeout(suiteTraitement, 1000);
}

function suiteTraitement() {
    for(let i = 0; i < qrCodes.length; i++){
        qrCodes = [];
        for(let j = 0; j < qrCodes[i].getData().length; j++){
            qrCodes.push(qrCodes[i].getData()[j]);
        }
    }
    for(let i = 0; i < qrCodes.length; i++){
        console.log(qrCodes[i].getData());
    }
}*/