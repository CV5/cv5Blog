$(document).ready(function () {
    var t = document.querySelector('#post')
    var p = document.querySelector('#articulo')
    var token = localStorage.getItem("TOKEN");
    var currentid = localStorage.getItem("currentId");
    
    fetch("http://68.183.27.173:8080/post/" + currentid + "", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(data => data.json())
        .then(data => {


            var template = $('#template-post').html();
            Mustache.parse(template); // optional, speeds up future uses


            $("#post-details").html('');


            let arrayMustache = [];

            let obj = data;

            obj.FechaStr = moment(new Date(obj.createdAt)).format('DD/MM/YYYY');
            document.title = obj.title + " - CV5 Blog";

            arrayMustache.push(Mustache.render(template, obj));


            $("#post-details").append(arrayMustache.join(''));
        })


    fetch("http://68.183.27.173:8080/post/" + currentid + "/comment", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(comments => comments.json())
        .then(comments => {
            console.log(comments);
            var commentsTemplate = $('#template-coments').html();
            
            Mustache.parse(commentsTemplate); // optional, speeds up future uses
            let arrayMustacheComments = [];
            

            for (i in comments) {
            
                let commentsObj = comments[i]
                commentsObj.createdAt = moment(new Date(commentsObj.createdAt)).format('DD/MM/YYYY');
    
            $("#comments-post").html('');


         
            arrayMustacheComments.push(Mustache.render(commentsTemplate, commentsObj));

        };
            $("#comments-post").append(arrayMustacheComments.join(''));
        })


        $("#btn").click(function(){
            comentar();
       });


});
function comentar() {
    var comments = $("#text-comments").val();
    var token = localStorage.getItem("TOKEN");
    if (comments.length > 0) {
        var data = {
            body: comments
        };
        var currentid = localStorage.getItem("currentId");
        fetch("http://68.183.27.173:8080/post/" + currentid + "/comment", {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => console.log('Success:', response));
            var inputNombre = document.getElementById("text-comments");
            inputNombre.value = "";
    } else {
        alert("Comentarios vacios no estan permitidos")

    }
};