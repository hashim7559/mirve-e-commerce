const token = localStorage.getItem("userToken");

if(!token){
  window.location.href="login.html";
}

async function loadProfile(){

  const res = await fetch("http://localhost:5000/api/users/me",{
    headers:{
      Authorization:"Bearer "+token
    }
  });

  const user = await res.json();

  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-email").textContent = user.email;

}

function logout(){
  localStorage.removeItem("userToken");
  window.location.href="login.html";
}

function goOrders(){
  window.location.href="my-orders.html";
}

loadProfile();