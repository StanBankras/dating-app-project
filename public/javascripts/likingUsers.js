const likeHearts = document.querySelectorAll('.hearts .like');

likeHearts.forEach((heart) => {
    heart.addEventListener('click', (e) => {
        const id = e.target.parentNode.parentNode.dataset.match;
        return axios.post('/like', {
            id: id
        })
        .then((res) => {
            if (res.request.status == 201) {
                e.target.classList.remove('active');
            } else {
                e.target.classList.add('active');
            }
        })
    });
});