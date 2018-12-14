var liked = true;

function sumarNumeros(n1, n2) {
    return (parseInt(n1) + parseInt(n2));
};

function showPost(id) {

    localStorage.setItem("currentId", id);

}
var count = 0;

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

        console.log(data)
        switch (data.type) {
            case "likes":

                $('#articulo-like-' + data.postId).text(data.likes);

                if (data.likeType == "like") {
                    $('#liked-button-' + data.postId).removeClass('animated shake');
                    $('#liked-button-' + data.postId).addClass('animated heartBeat');

                } else {
                    $('#liked-button-' + data.postId).removeClass('animated heartBeat');
                    $('#liked-button-' + data.postId).addClass('animated shake');

                }
                break;
            case "view-post":
                // TODO: cambias likes por views
                $('#articulo-views-' + data.postId).text(data.views);
                break;
            case "new-post":
                // TODO: cambias likes por views

                $("#favicon").attr("href", "img/faviconNotification.png");
                $('#news').text(data.userName + " ha creado un articulo nuevo.");
                break;
            case "new-comment":
                toastr["info"](data.userName + " ha hecho un comentario");
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": true,
                    "progressBar": true,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": 300,
                    "hideDuration": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000,
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                };

                break;
            case "user-connected":
                toastr["info"](data.userEmail + " ha iniciado sección");
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": true,
                    "progressBar": true,
                    "positionClass": "toast-botton-left",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": 300,
                    "hideDuration": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000,
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                };
                break;

        }
    };
}

$(document).ready(function () {

    var token = localStorage.getItem("TOKEN");
    document.title = "CV5 Blog";
    if (token == null) {

        location.href = "index.html";
    }
    wsConnect(token);

    fetch("http://68.183.27.173:8080/users/me", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(data => data.json())
        .then(data => {
            // var templateTags = $('#template-tagsColor').html();
            var templateMe = $('#template-me').html();

            // Mustache.parse(templateTags); // optional, speeds up future uses
            Mustache.parse(templateMe); // optional, speeds up future uses


            $("#me").html('');
            let arrayMustacheMe = [];
            let objMe = data;
            objMe.createdAt = moment(new Date(objMe.createdAt)).format('h:mm DD/MM/YYYY');
            arrayMustacheMe.push(Mustache.render(templateMe, objMe));
            $("#me").append(arrayMustacheMe.join(''));
            localStorage.setItem('FavoriteUserId', data.id);
        })



    fetch("http://68.183.27.173:8080/post", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(data => data.json())
        .then(data => {

            var template = $('#template-articulo').html();
            Mustache.parse(template); // optional, speeds up future uses

            $("#articulo").html('');
            let arrayMustache = [];
            for (i in data) {
                let obj = data[i];
                obj.FechaStr = moment(new Date(obj.createdAt)).format('DD/MM/YYYY');
                obj.tags = data[i].tags;
                obj.body = data[i].body.substring(0, 100) + "...";
                obj.likedClass = data[i].liked ? 'fa-heart' : 'fa-heart-o';
                obj.liked = data[i].liked;
                $('#news').text(data[i].title + " - by " + data[i].userName);
                arrayMustache.push(Mustache.render(template, obj));
            };
            arrayMustache.reverse();
            $("#articulo").append(arrayMustache.join(''));

        })

    $('#articulo').on('click', '.tituloArt', function (e) {
        localStorage.setItem("currentId", $(this).data('id'))
        location.href = "post.html";
    });

    $('#articulo').on('click', '.liked', function (r) {

        var liked = $(this).data('liked');
        var id = $(this).data('id');

        $(`.liked-${id}`).removeClass(liked ? 'fa-heart' : 'fa-heart-o').addClass(liked ? 'fa-heart-o' : 'fa-heart');

        $(this).data('liked', !liked);

        fetch(`http://68.183.27.173:8080/post/${id}/like`, {
            method: liked ? 'DELETE' : 'PUT', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {


        })
    });



    $('#sessionarea').on('click', '.Logout', function (r) {
            console.log("hola")
        fetch(`http://68.183.27.173:8080/logout`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            localStorage.removeItem("TOKEN");
            location.href="index.html";
        })
    });



 
});