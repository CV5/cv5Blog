var liked = true;

$(document).ready(function () {
    var token = localStorage.getItem("TOKEN");
    if(token == null){

        location.href="index.html";
    }
    fetch("http://68.183.27.173:8080/users", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(data => data.json())
        .then(data => {
            console.log(data);
            var template = $('#template-users').html();

            // Mustache.parse(templateTags); // optional, speeds up future uses
            Mustache.parse(template); // optional, speeds up future uses
            
            $("#users").html('');
            let arrayMustache = [];
            for (i in data) {
                let obj = data[i];
                obj.createdAt = moment(new Date(obj.createdAt)).format('DD/MM/YYYY');
                arrayMustache.push(Mustache.render(template, obj));
            };

            $("#users").append(arrayMustache.join(''));
           
        })
        $('#users').on('click', '.link', function (e) {
            localStorage.setItem("currentUserId", $(this).data('id'))
                       location.href = "timeline users.html";
        });
        $('#users').on('click', '.flink', function (e) {
            localStorage.setItem("FavoriteUserId", $(this).data('id'))
          
            location.href = "timeline Favoritos.html";
        });
    
});