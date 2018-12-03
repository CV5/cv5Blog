var liked = true;

$(document).ready(function () {
    var token = localStorage.getItem("TOKEN");
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

    // $('#articulo').on('click', '.tituloArt', function (e) {
      
    // });

    // $('#articulo').on('click', '.liked', function (r) {
       
    // });
});