const corsApi = 'https://iris-cors-anywhere.herokuapp.com/';
const newsListApi = 'https://hex-escape-room.herokuapp.com/api/cors/news';

axios.get(corsApi+newsListApi)
    .then((response) => {
        const newsList = response.data.data;
        renderNewsList(newsList);
    })
    .catch((error) => {
        console.log(error);
    })

function renderNewsList(data) {
    let str = '';
    data.forEach(item => {
        str += `<div class="col">
            <div class="card bg-dark text-white card-gradient"><img src="${item.urlToImage}" class="card-img" alt="${item.title}">
                <div class="card-img-overlay">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.publishedAt.replace('T', ' ').split('Z')[0]}</p>
                    <button type="button" class="news-button opacity-0 position-absolute start-0 top-0 w-100 h-100 stretched-link" data-id="${item.id}"></button>
                </div>
            </div>
        </div>`;
    });
    document.querySelector('.newsList').innerHTML = str;

    let buttonAll = document.querySelectorAll('.news-button');
    buttonAll.forEach((item) => {
        item.addEventListener('click', (event) => {
            renderNewsItem(event.target.dataset.id);
        })
    })
}

function renderNewsItem(id) {
    let item = '';
    console.log(id);
    axios.get(`${corsApi}${newsListApi}/${id}`)
        .then((response) => {
            news = response.data.data;
            document.querySelector('.newsItem').classList.remove('visually-hidden');

            item += `<h2 class="mt-3">${news.title}</h2>
            <span>${news.publishedAt.replace('T', ' ').split('Z')[0]}</span>
            <img src="${news.urlToImage}" class="img-fluid" alt="${news.title}">
            <p>${news.description}</p>
            <a href="${news.url}" target="blank">看更多</a>`;
            document.querySelector('.newsItem .item').innerHTML = item;
        })
        .catch((error) => {
            console.log(error);
        })
}

document.querySelector('.newsItem button').addEventListener('click', (event) => {
    document.querySelector('.newsItem').classList.add('visually-hidden');
});
