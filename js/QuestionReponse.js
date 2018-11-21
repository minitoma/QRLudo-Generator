var quesrepcontroller = new QuesRepController();
//var facade = new facadeController();
var fs = require('fs');
var pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
var repnum = 1;

$(document).ready(function() {

  var final_json = {};
  var projet = quesrepcontroller.creerprojet("", [], []);
  //console.log(projet);



  //Cacher le div des reponses par default
  $('#reponsesDivId').hide();

  //Clear Question Form
  $("#addNewQuesBtnId").click(function() {
    quesrepcontroller.clearModalForm('newQuestionModalId');
  });

  //Clear Reponse Form
  $("#addNewRepBtnId").click(function() {
    quesrepcontroller.clearModalForm('newReponseModalId');
  });

  //Clear Choose Reponse form then load the combobox with all the reponses in the project.
  $("#addNewChooseRepBtnId").click(function() {
    $("#reponsesChooseSelectId").empty();
    $('#reponsesChooseSelectId').append($('<option>', {
      val: "norep",
      text: "---Selectionner Une Reponse---"
    }));
    $.each(projet.reponses, function(i, val) {
      $('#reponsesChooseSelectId').append($('<option>', {
        val: val.id,
        text: val.title
      }));
    });
  });

  //Ajout d'une nouvelle question
  $("#addQuestionBtnId").click(function() {
    if (quesrepcontroller.addNewValueToComboBox($('#questionTextAreaId').val(), 'questionsId', 'newQuestionModalId', projet.questions)) {
      $('#reponsesDivId').show();
    }
    console.log(projet);
  });

  //Ajout d'une nouvelle reponse
  $("#addReponseBtnId").click(function() {
    quesrepcontroller.addNewValueToArray($('#reponseTextAreaId').val(), projet.reponses, 'newReponseModalId');
    console.log(projet);
  });

  //cet evenement permet l'affectation d'une reponse a la question selectionnée
  $("#chooseReponseBtnId").click(function() {
    for (i = 0; i < projet.questions.length; i++) {
      if (projet.questions[i].title === $("#questionsId option:selected").text()) {
        for (j = 0; j < projet.questions[i].reponsesUIDs.length; j++) {
          if (projet.questions[i].reponsesUIDs[j] === $("#reponsesChooseSelectId option:selected").val()) {
            return;
          }
        }
        projet.questions[i].reponsesUIDs.push($("#reponsesChooseSelectId option:selected").val());
      }
    }
    $("#reponsesDivLabelsId").append("<label class='control-label col-md-12' style='padding-top:10px;'>" + $("#reponsesChooseSelectId option:selected").text() + "</label>" +
      "<button id='removeRepFromQuesBtnId' type='button' class='btn btn-outline-success'><i class='fa fa-trash-alt'></i></button>");
    $("#chooseReponseModalId .close").click();
    console.log(projet);
  });

  $("#save").click(function() {
    projet.nom = $("#projectId").val();
    console.log(projet);
    let qrCodes_Generes = [];
    qrCodes_Generes.push({
      "name": projet.nom,
      "type": "qrprojet",
      "data": [projet.questions, projet.reponses]
    });
    for (quesqr of projet.questions) {
      qrCodes_Generes.push({
        "name": quesqr.title,
        "type": "qrquestion",
        "data": quesqr.reponsesUIDs
      });
    }
    for (repqr of projet.reponses) {
      qrCodes_Generes.push({
        "name": repqr.title,
        "type": "qrreponse",
        "data": []
      });
    }
    console.log(qrCodes_Generes);

    //{"name":"dodo","type":"unique","data":["sisi","likl"],"color":"#000000"}
  });

  //Evenement quand la liste deroulante de la question change
  $("#questionsId").change(function() {
    if ($(this).val() === "noquest") $('#reponsesDivId').hide(); // le div se cache quand l'option "Selectionner une question est selectionné"
    else {
      $('#reponsesDivId').show(); // Si une autre valeur le div des reponses sera affiché
      $('#reponsesDivLabelsId').html('');
      for (let ques_item of projet.questions) {
        if ($(this).val() == ques_item.id) {
          for (let repUid_item of ques_item.reponsesUIDs) {
            for (let rep of projet.reponses) {
              if (repUid_item == rep.id) {
                $("#reponsesDivLabelsId").append("<div class='form-inline>'><label class='control-label col-md-12' style='padding-top:10px;'>" + rep.title + "</label>"+
                  "<button id='removeRepFromQuesBtnId' type='button' class='btn btn-outline-success'><i class='fa fa-trash-alt'></i></button></div>");
              }
            }
          }
        }
      }
    }
  });

  //Evenement quand une liste deroulante d'une des reponses change
  $('#reponsesId').change(function() {
    console.log("heyo");
  });






  console.log(pathname);
  var nameFileProjects = "QA_ProjectNames_File.json";


  //----------------------------------------------------------------------------
  $("#addQuestion").click(function() {
    var myProject = new Projet(1, $('#project option:selected').text());
    data = $('#formAddQuestion').serializeObject();
    console.log(data);
    var les_reponses = [];
    for (i = 0; i < data.Reponse.length; i++) {
      var myreponse = new Reponse(i, data.Reponse[i]);
      les_reponses[i] = {
        "reponse": myreponse,
        "juste": document.getElementById("isEx" + (i + 1)).checked
      };
    }
    var myQuestion = new Question(1, data.Question, [], myProject);
    for (i = 0; i < les_reponses.length; i++) {
      myQuestion.addReponse(les_reponses[i])
    }
    if (fs.existsSync(pathname + 'test.json')) {
      var m = JSON.parse(fs.readFileSync('test.json').toString());
      if (m === "") {
        fs.writeFile("test.json", "[" + JSON.stringify(myQuestion) + "]", function(err) {
          if (err) {
            console.log("ERROR !!");
          }
        });
      } else {
        console.log(m);
        m[m.length] = myQuestion;
        fs.writeFile('test.json', JSON.stringify(m));
      }
    } else {
      fs.writeFile("test.json", "[" + JSON.stringify(myQuestion) + "]", function(err) {
        if (err) {
          console.log("ERROR !!");
        }
      });
    }
    $("#nouvellequestion .close").click();
  });

  $("#project").change(function() {
    $('#questions').find('option').remove().end();
    if (fs.existsSync(pathname + "test.json")) {
      var jsonl = JSON.parse(fs.readFileSync("test.json").toString());
      $("#questions").append($.map(jsonl, function(o) {
        if (o.project.nom === $("#project option:selected").text()) {
          return $('<option/>', {
            value: o.id,
            text: o.title
          });
        }
      }));
    }
  });

  $("#questions").change(function() {
    console.log("halii");
    var myLoadedQuestion = $("#questions option:selected").text();
    $("#modifyQuest").append(
      "<label class='col-sm-12 control-label' style='color:#28a745;padding-top:10px;'>" + "Question</label>" +
      " <div class='col-sm-10'>" + "<textarea class='form-control' id='question' rows='2' name='Question'>" + myLoadedQuestion + "</textarea></div>"
    );
    $("#questions").append($.map(jsonl, function(o) {
      if (o.project.nom === $("#project option:selected").text()) {
        return $('<option/>', {
          value: o.id,
          text: o.title
        });
      }
    }));

  });
});


function chargerProjects(nameFileProjects) {
  if (fs.existsSync(pathname + nameFileProjects)) {

    var jsonl = JSON.parse(fs.readFileSync(nameFileProjects).toString());
    $("#project").append($.map(jsonl, function(o) {

      return $('<option/>', {
        value: o.id,
        text: o.nom
      });
    }));
  }
}

//pour ajouter une nvlle reponse
function ajouterChampReponse() {
  var Contenu = document.createElement('div');
  Contenu.setAttribute("class", "form-inline");
  Contenu.innerHTML = "<select id='reponsesId' name='reponsesName' class='form-control form-select-options col-md-6' style='margin-right:10px;'>" +
    "<option value='norep'>---Selectionner Une Reponse---</option></select>" +
    "<button id='deleteRepBtnId' type='button' class='btn btn-outline-success'><i class='fa fa-trash-alt'></i></button></div>";
  document.getElementById('reponsesDivId').appendChild(Contenu);
}


$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
