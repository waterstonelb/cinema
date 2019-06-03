$(document).ready(function() {
    var movieList;
    getMovies();
    function getMovies() {
        getRequest(
            "/movie/all/exclude/off",
            function (res) {
                movieList=res.content;
                renderMovie(movieList)
            },
            function () {

            }
        )
    }
    function renderMovie(movieList) {
        $('.movie-on-list').empty();
        var movieDomStr = '';
        movieList.forEach(function (movie) {
            movie.description = movie.description || '';
            movieDomStr +=
                "<li class='movie-item card'>" +
                "<img class='movie-img' src='" + (movie.posterUrl || "../images/defaultAvatar.jpg") + "'/>" +
                "<div>"+movie.name+"</div>"+
                "</li>";
        });
        $('.movie-on-list').append(movieDomStr);
    }
    
});