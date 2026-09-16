const buttons = document.querySelector('.buttons');
const display = document.querySelector('.display');
const equal = document.querySelector('.equal');
const error = document.querySelector('.error');
const clear = document.querySelector('.clear');
const btnDel = document.querySelector('.backspace');
const displayWraper = document.querySelector('.display-wraper');
let angka = '';
let operasi = [];
let limitInt = false;
//Loop anak dari buttons
Array.from(buttons.children).forEach(btn => {
    //Menambahkan listener ke semua anak dari buttons
    btn.addEventListener('click', () => {
        document.querySelector('.error').textContent = '';
        //check tombol yang di klik berdasarkan textContent
        switch (btn.textContent) {
            case '1': {
                angka += '1'
                break
            }
            case '2': {
                angka += '2'
                break
            }
            case '3': {
                angka += '3'
                break
            }
            case '4': {
                angka += '4'
                break
            }
            case '5': {
                angka += '5'
                break
            }
            case '6': {
                angka += '6'
                break
            }
            case '7': {
                angka += '7'
                break
            }
            case '8': {
                angka += '8'
                break
            }
            case '9': {
                angka += '9'
                break
            }
            case '0': {
                angka += '0'
                break
            }
            case '.': {
                //mengecek jika teks terakhir adalah titik atau sebuah operator
                if(angka=== '') {
                    error.textContent = 'click number first';
                    return;
                }
                if (angka[angka.length - 1] === '.' || angka[angka.length - 1].match(/[\+\-\/\*]/g)) {
                    return;
                }
                angka += '.'
                break
            }
            case '%': {
                if (angka === '') {
                    error.textContent = 'Error operator!';
                    return;
                }
                operasi.push(angka, '%');
                angka = ''
                break
            }

            case '+': {
                if (angka === '') {
                    error.textContent = 'Error operator!';
                    return;
                }
                operasi.push(angka, '+');
                angka = ''
                break
            }
            case '-': {
                if (angka === '') {
                    error.textContent = 'Error operator!';
                    return;
                }
                operasi.push(angka, '-');
                angka = ''
                break
            }
            case 'x': {
                if (angka === '') {
                    error.textContent = 'Error operator!';
                    return;
                }
                operasi.push(angka, '*');
                angka = ''
                break
            }
            case '/': {
                if (angka === '') {
                    error.textContent = 'Error operator!';
                    return;
                }
                operasi.push(angka, '/');
                angka = ''
                break
            }
        }

        //mengatur display saat angka tidak terisi
        if (angka === '') {
            display.textContent = operasi.join('') + angka;

        } else {
            display.textContent = operasi.join('') + angka;
        }

        //mengatur ukuran font jika overflow di display
        if (display.offsetWidth > displayWraper.offsetWidth) {
            displayWraper.style.fontSize = '1.2rem'
        }
    });
});

//listener backspace 
btnDel.addEventListener('click', () => {
    error.textContent = '';

    if (angka !== '') {
        // masih ngetik angka -> hapus 1 karakter terakhir saja
        angka = angka.slice(0, -1);
    } else if (operasi.length > 0) {
        // angka kosong -> yang terakhir diklik itu operator
        operasi.pop();                    // buang operatornya
        angka = operasi.pop() ?? '';      // ambil angka sebelumnya, kembalikan ke `angka`
    }
    // angka kosong DAN operasi kosong -> tidak ada yang perlu dihapus

    display.textContent = operasi.join('') + angka;
    if (angka === '' && operasi.length === 0) {
        display.textContent = '0';
    }
});
//Clear listener
clear.addEventListener('click', () => {
    angka = '';
    if (angka === '') {
        display.textContent = '0';
        operasi.length = 0;
    }
});

//Equal listener 
equal.addEventListener('click', () => {
    operasi.push(angka);
    if (operasi[operasi.length - 1] === '') {
        error.textContent = 'invalid operasi!';
        operasi = operasi.filter(t => t !== '');
        return;
    }

    function hitung() {
        operasi.filter(bil => bil?.match(/[\d+]/g)).forEach(bil => {
            if (bil.length > String(Number.MAX_SAFE_INTEGER).length) {
                limitInt = true;
            }
        });

        if (limitInt) {
            error.textContent = 'Limit int!';
            operasi.length = 0;
            operasi[0] = '0'
            limitInt = false
            return;
        }
        //loop dan mengerjakan operasi prioritas
        for (let i = 0; i < operasi.length; i++) {
            if (operasi[i] === '*') {
                //hapus 3 element yang sudah di hitung dan tambahkan element hasil hitung ke array operasi
                operasi.splice((i - 1), 3, (Number(operasi[i - 1]) * Number(operasi[i + 1])));
                break
            }
            if (operasi[i] === '/') {
                operasi.splice((i - 1), 3, (Number(operasi[i - 1]) / Number(operasi[i + 1])));
                break
            }
            if (operasi[i] === '%') {
                operasi.splice((i - 1), 3, (Number(operasi[i - 1]) % Number(operasi[i + 1])));
                break
            }
        }

        // mengerjakan operasi sisanya
        if (!operasi.includes('*') && !operasi.includes('/') && !operasi.includes('%')) {
            for (let i = 0; i < operasi.length; i++) {
                if (operasi[i] === '+') {
                    operasi.splice((i - 1), 3, (Number(operasi[i - 1]) + Number(operasi[i + 1])));
                    break
                }
                if (operasi[i] === '-') {
                    operasi.splice((i - 1), 3, (Number(operasi[i - 1]) - Number(operasi[i + 1])));
                    break
                }
            }
        }
        //cek apakah masih ada operasi yang harus di hitung 
        if (operasi.length > 1) {
            //jalan function lagi 
            hitung();
        }
    }

    hitung();
    // menampilkan hasil dari operasi
    display.textContent = operasi[0]
    // reset angka menjadi hasil operasi
    angka = operasi[0]
    // reset operasi 
    operasi.length = 0;
});


