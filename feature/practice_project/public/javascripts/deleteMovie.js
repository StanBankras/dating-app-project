// UL containing all movies
const moviesList = document.querySelector('#movies');

// Listen to clicks on the UL, from there, check if a title or description was clicked.
moviesList.addEventListener('click', (e) => {
    if (e.target.tagName == 'LI') {
        let form = document.createElement('form');
        let cancelButton = document.createElement('a');
        let deleteButton = document.createElement('button');
        form.setAttribute('method', 'post');
        form.setAttribute('action', '/delete');
        cancelButton.textContent = 'Cancel';
        cancelButton.setAttribute('class', 'cancel');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('type', 'submit');
        form.appendChild(deleteButton);
        form.appendChild(cancelButton);
        e.target.appendChild(form);
    }

    if (e.target.tagName == 'A' && e.target.classList.contains('cancel')) {
        const parentNode = e.target.parentNode.parentNode
        parentNode.removeChild(parentNode.lastChild);
    }
});

