function getValue() {
    const input = document.getElementById("angka") as HTMLInputElement;
    const x = parseInt(input.value);
    if (isNaN(x) || x < 0 || x > 100) {
        alert('You can only enter a value between 0 and 100!');
    } else {
        createTriangle(x);
    }
}

function createTriangle(x: number) {
    let html = '';
    for (let y = 1; y <= x; y++) {
        let spasi = '';
        let pagar = '';

 
        for (let i = 0; i < x - y; i++) {
            spasi += ' ';
        }


        for (let j = 0; j < y; j++) {
            pagar += '#';
        }

        html += spasi + pagar + '<br>';
        console.log(spasi + pagar); 
    }

    const resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerHTML = html;
    }
}

const btnSubmit = document.getElementById("btnSubmit");
btnSubmit?.addEventListener("click", getValue);
