function wsConnect(token) {

    console.log("WS- connect ", token);
    var websocket = new WebSocket(`ws://68.183.27.173:8080/?token=${token}`);
    websocket.onopen = function (evt) {
        console.log(evt)
    };
    websocket.onclose = function (evt) {
        console.log(evt)
    };
    websocket.onerror = function (evt) {
        console.log(evt)
    };

    websocket.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        console.log(data);
        switch (data.type) {
            case "new-comment":
            data.body = data.commentBody;
            data.userName = data.userEmail;
        
            var commentsTemplate = $('#template-coments').html();
            data.createdAt = moment(new Date()).format('hh : mm - DD/MM/YYYY');

           
            $("#comments-post").prepend(Mustache.render(commentsTemplate, data));
                break;
            case "view-post":
                // TODO: cambias likes por views
                $('#articulo-views-' + data.postId).text(data.views);
                break;

        }
    };
}

let arrayMustacheComments = [];
let commentsObj;
$(document).ready(function () {
    var commentsTemplate = $('#template-coments').html();

   
    var t = document.querySelector('#post')
    var p = document.querySelector('#articulo')
    var token = localStorage.getItem("TOKEN");
    if(token == null){

        location.href="index.html";
    }
    wsConnect(token);
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

            var templateTags= $('#template-tags').html();
            var template = $('#template-post').html();
            Mustache.parse(template); // optional, speeds up future uses
            Mustache.parse(templateTags); // optional, speeds up future uses
            $("#tagsList").html('');

            $("#post-details").html('');


            let arrayMustache = [];
            let arrayMustacheTags = [];

            let obj = data;
            let tagsObj = obj.tags

            for (i in obj.tags) {
                
                arrayMustacheTags.push(Mustache.render(templateTags, tagsObj[i]));

            }


            obj.FechaStr = moment(new Date(obj.createdAt)).format('DD/MM/YYYY');
            document.title = obj.title + " - CV5 Blog";

            arrayMustache.push(Mustache.render(template, obj));


            $("#post-details").append(arrayMustache.join(''));
            console.log(arrayMustache)
            $("#tagsList").append(arrayMustacheTags.join(''));
            console.log(obj.tags)
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
           
            Mustache.parse(commentsTemplate); // optional, speeds up future uses
           
            
            
            $("#comments-post").html('');

            comments.forEach(comment => {
                comment.createdAt = moment(new Date(comment.createdAt)).format('hh : mm - DD/MM/YYYY');
            
               arrayMustacheComments.push(Mustache.render(commentsTemplate, comment));

            });
           
            arrayMustacheComments.reverse();
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