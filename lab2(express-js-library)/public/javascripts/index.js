let deleteButtons = document.getElementsByClassName('book__delete');

const insertButton = document.getElementById('insert-button');
const insertDialog = document.getElementById('insert-dialog');
const insertForm = document.getElementById('insert-dialog-form')

const filterForm = document.getElementById('filter-form');

function deleteBooks(button) {
    if (confirm('Вы точно хотите удалить эту книгу?')) {
        fetch('/books/' + button.id, {method: 'DELETE'})
            .then(response => response.text())
            .then(data => updateBooks(data));
    }
}

function updateBooks(data) {
    const dom_document = new DOMParser().parseFromString(data, 'text/html');
    const ul = dom_document.getElementsByTagName('ul')[0];
    document.getElementsByTagName('ul')[0].innerHTML = ul.innerHTML;

    deleteButtons = document.getElementsByClassName('book__delete');
    Array.from(deleteButtons).forEach(button => {
        button.addEventListener('click', () => deleteBooks(button))
    });
}

Array.from(deleteButtons).forEach(button => {
    button.addEventListener('click', () => deleteBooks(button))
});

filterForm.addEventListener('submit', () => {
    let params = Object.fromEntries(new FormData(filterForm));

    fetch('/?' + new URLSearchParams(params).toString(), {method: 'GET'})
        .then(response => response.text())
        .then(data => updateBooks(data));
})

insertButton.addEventListener('click', () => insertDialog.showModal());
insertDialog.addEventListener('click', ({currentTarget, target}) => {
    if (target === currentTarget) {
        currentTarget.close();
    }
});
insertForm.addEventListener('submit', () => {
    fetch('/', {
        method: 'POST',
        body: new FormData(insertForm)
    })
        .then(response => response.text())
        .then(data => updateBooks(data));
});


