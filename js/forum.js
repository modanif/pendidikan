const user =
JSON.parse(localStorage.getItem("user"));

if(!user){

    location.href="login.html";

}

document.getElementById("welcome").innerHTML =
`Halo, ${user.username} (${user.role})`;

function logout(){

    localStorage.removeItem("user");

    location.href="login.html";

}

if(user.role === "user"){

document.getElementById("formKomentar").innerHTML =

`
<textarea id="komentar"
          class="form-control mb-2">
</textarea>

<button onclick="kirimKomentar()"
        class="btn btn-success">

Kirim Komentar

</button>

<hr>
`;

}

loadKomentar();