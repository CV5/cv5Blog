var token = localStorage.getItem("TOKEN");
if(token == null){

     location.href="index.html";
 }
function postear() {


     var titulo = $("#titulo").val();
     var body = $('#froala-editor').froalaEditor('html.get');
     // body = body.replace(/<[^>]*>/g, '');
     var tags = [`${$("#tags").val()}`];
     // tags = `[${tags}]`;
      body

      function html2text(body) {
          var tag = document.createElement('div');
          tag.innerHTML = body;
          
          return tag.innerText;
      }

      
     var data = {
          title: titulo,
          body: body,
          tags: tags
     }
     console.log(data.body)

     fetch("http://68.183.27.173:8080/post", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }).then(res => res.json())
        .then(response => location.href="crear.html"
        
        )
        .catch(error => console.error('Error:', error));

        
}

$(document).ready(function () {
     $(function () {
          $('div#froala-editor').froalaEditor({
               height: 400
          })
     });

     $("#btnPublicar").click(function () {
          postear();
     });
});
