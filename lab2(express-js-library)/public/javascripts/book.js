const bookId = document.currentScript.dataset.id;

const editButton = document.getElementById('edit-button');
const editDialog = document.getElementById('edit-dialog');
const editForm = document.getElementById('edit-dialog-form');
const bringButton = document.getElementById('bring-button');
const bringDialog = document.getElementById('bring-dialog');
const bringForm = document.getElementById('bring-dialog-form');

const returnButton = document.getElementById('return-button');


if (returnButton) {
    returnButton.addEventListener('click', () => {
        fetch('/books/' + bookId, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({available: true})
        })
            .then(() => location.reload());
    });
}

editButton.addEventListener('click', () => editDialog.showModal());
editDialog.addEventListener('click', ({currentTarget, target}) => {
    if (target === currentTarget) {
        currentTarget.close();
    }
});
editForm.addEventListener('submit', () => {
    fetch('/books/' + bookId, {
        method: 'PATCH',
        body: new FormData(editForm)
    })
        .then(() => location.reload());
});

bringButton.addEventListener('click', () => bringDialog.showModal());
bringDialog.addEventListener('click', ({currentTarget, target}) => {
    if (target === currentTarget) {
        currentTarget.close();
    }
});
bringForm.addEventListener('submit', () => {
        fetch('/books/' + bookId, {
            method: 'PATCH',
            body: new FormData(bringForm)
        })
            .then(() => location.reload());
    }
)