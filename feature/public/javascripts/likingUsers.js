const likeHearts = document.querySelectorAll('.hearts .like');
const dislikeHearts = document.querySelectorAll('.hearts .dislike');

likeHearts.forEach((heart) => {
    heart.addEventListener('click', (e) => {
        let id = e.target.parentNode.parentNode.dataset.match;
        return axios.post('/match', {
            id: id
        });
    });
});