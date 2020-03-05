// UL containing all movies
const moviesUl = document.querySelector('#movies');

// Listen to clicks on the UL, from there, check if a title or description was clicked.
moviesUl.addEventListener('click', (e) => {
    if (e.target.tagName == 'H2') {
        if (e.target.childNodes.length > 1) return;
        createForm(e, 'title');
    } else if (e.target.tagName == 'P') {
        if (e.target.childNodes.length > 1) return;
        createForm(e, 'description');
    }
});

// Create form with an input field or text area
function createForm(e, field) {
    let form = document.createElement('form');
    let inputHidden = document.createElement('input');
    let button = document.createElement('button');
    button.textContent = 'Change';
    inputHidden.setAttribute('type', 'hidden');
    inputHidden.setAttribute('value', e.target.parentNode.dataset.movie);
    inputHidden.setAttribute('name', 'movieNr');
    button.setAttribute('type', 'submit');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/edit');
    form.appendChild(inputHidden);
    if (field == 'title') {
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'newTitle');
        form.appendChild(input);
    } else if (field == 'description') {
        let textarea = document.createElement('textarea');
        textarea.setAttribute('rows', '3');
        textarea.setAttribute('name', 'newDescription');
        form.appendChild(textarea);
    }
    form.appendChild(button);
    e.target.appendChild(form);
}