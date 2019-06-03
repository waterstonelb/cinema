$(document).ready(function(){

    var movieId = parseInt(window.location.href.split('?')[1].split('&')[0].split('=')[1]);
    var userId = sessionStorage.getItem('id');
    var isLike = false;

    getMovie();
    if(sessionStorage.getItem('role') === 'admin')
        getMovieLikeChart();

    function getMovieLikeChart() {
       getRequest(
           '/movie/' + movieId + '/like/date',
           function(res){
               var data = res.content,
                    dateArray = [],
                    numberArray = [];
               data.forEach(function (item) {
                   dateArray.push(item.likeTime);
                   numberArray.push(item.likeNum);
               });

               var myChart = echarts.init($("#like-date-chart")[0]);

               // 指定图表的配置项和数据
               var option = {
                   title: {
                       text: '想看人数变化表'
                   },
                   xAxis: {
                       type: 'category',
                       data: dateArray
                   },
                   yAxis: {
                       type: 'value'
                   },
                   series: [{
                       data: numberArray,
                       type: 'line'
                   }]
               };

               // 使用刚指定的配置项和数据显示图表。
               myChart.setOption(option);
           },
           function (error) {
               alert(error);
           }
       );
    }

    function getMovie() {
        getRequest(
            '/movie/'+movieId + '/' + userId,
            function(res){
                var data = res.content;
                isLike = data.islike;
                repaintMovieDetail(data);
                if(data.status === 1){
                    $("#delete-btn").text("上 映")
                }
            },
            function (error) {
                alert(error);
            }
        );
    }

    function repaintMovieDetail(movie) {
        !isLike ? $('.icon-heart').removeClass('error-text') : $('.icon-heart').addClass('error-text');
        $('#like-btn span').text(isLike ? ' 已想看' : ' 想 看');
        $('#movie-img').attr('src',movie.posterUrl);
        $('#movie-name').text(movie.name);
        $('#order-movie-name').text(movie.name);
        $('#movie-description').text(movie.description);
        $('#movie-startDate').text(new Date(movie.startDate).toLocaleDateString());
        $('#movie-type').text(movie.type);
        $('#movie-country').text(movie.country);
        $('#movie-language').text(movie.language);
        $('#movie-director').text(movie.director);
        $('#movie-starring').text(movie.starring);
        $('#movie-writer').text(movie.screenWriter);
        $('#movie-length').text(movie.length);
    }

    // user界面才有
    $('#like-btn').click(function () {
        var url = isLike ?'/movie/'+ movieId +'/unlike?userId='+ userId :'/movie/'+ movieId +'/like?userId='+ userId;
        postRequest(
             url,
            null,
            function (res) {
                 isLike = !isLike;
                getMovie();
            },
            function (error) {
                alert(error);
            });
    });

    // admin界面才有
    $("#modify-btn").click(function () {
        var dates=$('#movie-startDate').text().split('/');
        var date=dates[0] +'-'+ (dates[1].length>1?dates[1]:'0'+dates[1]) +'-'+ (dates[2].length>1?dates[2]:'0'+dates[2]);
        $('#movie-name-input').val($('#movie-name').text());
        $('#movie-img-input').val($('#movie-img').attr('src'));
        $('#movie-type-input').val($('#movie-type').text());
        $('#movie-date-input').val(date);
        $('#movie-length-input').val($('#movie-length').text());
        $('#movie-country-input').val($('#movie-country').text());
        $('#movie-language-input').val($('#movie-language').text());
        $('#movie-director-input').val($('#movie-director').text());
        $('#movie-star-input').val($('#movie-starring').text());
        $('#movie-writer-input').val($('#movie-writer').text());
        $('#movie-description-input').val($('#movie-description').text())
    });
    $("#delete-btn").click(function () {
        var movieName='确定下架'+$('#movie-name').text()+'?';
        confirm(movieName) &&  postRequest(
            '/movie/off/batch',
            {
                movieIdList: [movieId]
            },
            function (res) {
            },
            function (error) {
                alert(error);
            });

    });
    $("#movie-form-btn").click(function () {
        var formData = getMovieForm();
        if(!validateMovieForm(formData)) {
            return;
        }
        postRequest(
            '/movie/update',
            formData,
            function (res) {
                $("#movieModal").modal('hide');
                getMovie();
            },
            function (error) {
                alert(error);
            });
    });

    function getMovieForm() {
        return {
            id: movieId,
            name: $('#movie-name-input').val(),
            startDate: $('#movie-date-input').val(),
            posterUrl: $('#movie-img-input').val(),
            description: $('#movie-description-input').val(),
            type: $('#movie-type-input').val(),
            length: $('#movie-length-input').val(),
            country: $('#movie-country-input').val(),
            starring: $('#movie-star-input').val(),
            director: $('#movie-director-input').val(),
            screenWriter: $('#movie-writer-input').val(),
            language: $('#movie-language-input').val()
        };
    }

    function validateMovieForm(data) {
        var isValidate = true;
        if(!data.name) {
            isValidate = false;
            $('#movie-name-input').parent('.form-group').addClass('has-error');
            alert("请输入电影名称")
        }
        if(data.posterUrl.length>=255 || !data.posterUrl) {
            isValidate = false;
            $('#movie-img-input').parent('.form-group').addClass('has-error');
            alert("海报链接过长或无输入")
        }
        if(!data.startDate) {
            isValidate = false;
            $('#movie-date-input').parent('.form-group').addClass('has-error');
            alert("请输入上映日期")
        }
        return isValidate;
    }
});