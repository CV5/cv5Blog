function registrarse(){
     
     var email =  $("#email").val();
     var password =  $("#password").val();

     var data = {
          email: email,
          password: password
     }
     
     console.log(data);
     
     fetch("http://68.183.27.173:8080/login", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
if (response.token != null){
     alert("Bienvenido");
}else{

     alert("Maldito campesino");
}
}

$(document).ready(function(){
     $("#btn").click(function(){
          registrarse();
     });
});

