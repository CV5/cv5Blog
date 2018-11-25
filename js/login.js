

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
        .then(response => {
          if(response.token != null){
          localStorage.setItem("TOKEN",response.token)
          location.href="inicio.html";
          console.log('Success:', JSON.stringify(response))
        }else{
          alert("El usuario o la contraseña esta incorrecta.");

        }
        })
        .catch(error => console.error('Error:', error));

     

}



$(document).ready(function(){
     var token = localStorage.getItem("TOKEN");
     if (token != null){
          location.href="inicio.html";

     }

     $("#btn").click(function(){
          registrarse();
     });
});

