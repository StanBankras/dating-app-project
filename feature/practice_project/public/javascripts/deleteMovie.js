// Listen to clicks on the UL, from there, check if a title or description was clicked.
moviesUl.addEventListener('click', (e) => {
    if (e.target.tagName == 'LI') {
        let form = document.createElement('form');
        let cancelButton = document.createElement('a');
        let deleteButton = document.createElement('button');
        let inputHidden = document.createElement('input');
        inputHidden.setAttribute('type', 'hidden');
        inputHidden.setAttribute('value', e.target.dataset.movie);
        inputHidden.setAttribute('name', 'movieNr');
        form.setAttribute('method', 'post');
        form.setAttribute('action', '/delete');
        cancelButton.textContent = 'Cancel';
        cancelButton.setAttribute('class', 'cancel');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('type', 'submit');
        form.appendChild(deleteButton);
        form.appendChild(cancelButton);
        form.appendChild(inputHidden);
        e.target.appendChild(form);
    }

    if (e.target.classList.contains('cancel')) {
        const parentNode = e.target.parentNode.parentNode
        parentNode.removeChild(parentNode.lastChild);
    }
});

