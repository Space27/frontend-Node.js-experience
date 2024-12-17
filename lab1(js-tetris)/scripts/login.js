const input = document.getElementById('username');
read();

function store() {
    localStorage.setItem('name', input.value);
}

function read() {
    input.value = localStorage.getItem('name');
}