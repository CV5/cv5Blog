$(document).ready(function () {
    var t = document.querySelector('#post')
    var p = document.querySelector('#articulo')
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
            Mustache.parse(template);   // optional, speeds up future uses
           
            $("#articulo").html(''); 

            let arrayMustache = [];
            for (i = 0; i < 10; i++) {
                let obj = data[i];
                obj.FechaStr = moment(new Date(obj.createdAt)).format('DD/MM/YYYY');
                arrayMustache.push(Mustache.render(template, obj));
             // $("#articulo").append(
                    // ' <div class="row mb-5 articulos">' +
                    // '<div class="col-3">' +
                    // '<img src="img/face.png" class="img-fluid">' +
                    // '<p class="lead text-center">02/11/2018</p>' +
                    // '  </div> ' +
                    // '<div class="col-9">' +
                    // '<div id="articulo">' +


                    // '<a href="#"><h3>' + data[i].title + '</h3></a>' +
                    // '<a href="#"><span class="badge badge-primary">html</span></a>' +
                    // '<a href="#"><span class="badge badge-success">css</span></a>' +
                    // '<p><h4>' + data[i].body + '</h4>' +
                    // '</div></div></div></div>'
              //  )
            };

            $("#articulo").append(arrayMustache.join(''));
        })

    $('#articulo').on('click','.tituloArt',function(e){
        console.log('id',$(this).data('id'));
    })  ;      
});