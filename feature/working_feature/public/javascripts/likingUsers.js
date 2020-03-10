const likeHearts = document.querySelectorAll('.hearts .like');
const dislikeHearts = document.querySelectorAll('.hearts .dislike');

likeHearts.forEach((heart) => {
    heart.addEventListener('click', (e) => {
        return axios.post('http://localhost:3000/match', {
            id: 'ObjectId(5e6765073cd15e48d4114d7c)'
        })
    });
});