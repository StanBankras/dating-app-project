const likeHearts = document.querySelectorAll('.hearts .like');

likeHearts.forEach((heart) => {
    heart.addEventListener('click', (e) => {
        let id = e.target.parentNode.parentNode.dataset.match;
        return axios.post('/like', {
            id: id
        })
        .then(() => {
            e.target.classList.add('active');
        })
    });
});