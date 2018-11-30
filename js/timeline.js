$(document).ready(function () {
    var token = localStorage.getItem("TOKEN");
    fetch("http://68.183.27.173:8080/post", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(data => data.json())
        .then(data => {
            console.log(data);

            var template = $('#template-articulo').html();

            Mustache.parse(template); // optional, speeds up future uses
            $("#articulo").html('');
            let arrayMustache = [];
            for (i in data) {
                let obj = data[i];
                obj.FechaStr = moment(new Date(obj.createdAt)).format('DD/MM/YYYY');
                obj.tags = data[i].tags;
                obj.body = data[i].body.substring(0, 100) + "...";
                arrayMustache.push(Mustache.render(template, obj));
            };

            $("#articulo").append(arrayMustache.join(''));
        })

    $('#articulo').on('click', '.tituloArt', function (e) {
        localStorage.setItem("currentId", $(this).data('id'))
        location.href = "post.html";
    });
});