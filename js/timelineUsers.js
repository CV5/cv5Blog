var liked = true;

$(document).ready(function () {
    var token = localStorage.getItem("TOKEN");
    if(token == null){

        location.href="index.html";
    }
    var userID = localStorage.getItem("currentUserId");
console.log(userID);
    fetch(`http://68.183.27.173:8080/users/${userID}`, {
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
    })



    fetch(`http://68.183.27.173:8080/post?userId=${userID}`, {
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
                obj.likedClass = data[i].liked ? 'fa-heart' : 'fa-heart-o';
                obj.liked = data[i].liked;
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
        console.log($(this).data('id'))
        var liked = $(this).data('liked');
        var id =$(this).data('id');
    
        $(`.liked-${id}`).removeClass(liked ? 'fa-heart' : 'fa-heart-o').addClass(liked ? 'fa-heart-o' : 'fa-heart');

        $(this).data('liked', !liked);

        fetch(`http://68.183.27.173:8080/post/${id}/like`, {
            method: liked ? 'DELETE':'PUT', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response =>{

         
        })   
    });
});