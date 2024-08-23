function getValue() {
    var input = document.getElementById("angka");
    var x = parseInt(input.value);
    if (isNaN(x) || x < 0 || x > 100) {
        alert('You can only enter a value between 0 and 100!');
    }
    else {
        createTriangle(x);
    }
}
function createTriangle(x) {
    var html = '';
    for (var y = 1; y <= x; y++) {
        var spasi = '';
        var pagar = '';
        for (var i = 0; i < x - y; i++) {
            spasi += ' ';
        }
        for (var j = 0; j < y; j++) {
            pagar += '#';
        }
        html += spasi + pagar + '<br>';
        console.log(spasi + pagar);
    }
    var resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerHTML = html;
    }
}
var btnSubmit = document.getElementById("btnSubmit");
btnSubmit === null || btnSubmit === void 0 ? void 0 : btnSubmit.addEventListener("click", getValue);
