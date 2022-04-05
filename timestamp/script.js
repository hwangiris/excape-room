let newsDate = 'https://hex-escape-room.herokuapp.com/api/news/v1/data';
let returns = [];

axios.get(newsDate)
  .then((response) => {
    // handle success
    returns = response.data.articles;
    returns.forEach((item, index) => {
        returns[index].publishedAt = moment(item.publishedAt).tz(item.iana).format("YYYY-MM-DD HH:mm:ss");
    });
    postData(returns);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

function postData(returns) {
    axios.post(newsDate, {
        data: returns
    })
        .then((response) => {
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}