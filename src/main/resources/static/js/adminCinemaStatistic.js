$(document).ready(function() {


    getScheduleRate();
    
    getBoxOffice();

    getAudiencePrice();

    getPlacingRate();

    getPolularMovie();

    function getScheduleRate() {

        getRequest(
            '/statistics/scheduleRate',
            function (res) {
                var data = res.content||[];
                var tableData = data.map(function (item) {
                   return {
                       value: item.time,
                       name: item.name
                   };
                });
                var nameList = data.map(function (item) {
                    return item.name;
                });
                var option = {
                    title : {
                        text: '今日排片率',
                        subtext: new Date().toLocaleDateString(),
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x : 'center',
                        y : 'bottom',
                        data:nameList
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    series : [
                        {
                            name:'面积模式',
                            type:'pie',
                            radius : [30, 110],
                            center : ['50%', '50%'],
                            roseType : 'area',
                            data:tableData
                        }
                    ]
                };
                var scheduleRateChart = echarts.init($("#schedule-rate-container")[0]);
                scheduleRateChart.setOption(option);
            },
            function (error) {
                alert(JSON.stringify(error));
            }
        );
    }

    function getBoxOffice() {

        getRequest(
            '/statistics/boxOffice/total',
            function (res) {
                var data = res.content || [];
                var tableData = data.map(function (item) {
                    return item.boxOffice;
                });
                var nameList = data.map(function (item) {
                    return item.name;
                });
                var option = {
                    title : {
                        text: '所有电影票房',
                        subtext: '截止至'+new Date().toLocaleDateString(),
                        x:'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: nameList
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: tableData,
                        type: 'bar'
                    }]
                };
                var scheduleRateChart = echarts.init($("#box-office-container")[0]);
                scheduleRateChart.setOption(option);
            },
            function (error) {
                alert(JSON.stringify(error));
            });
    }

    function getAudiencePrice() {
        getRequest(
            '/statistics/audience/price',
            function (res) {
                var data = res.content || [];
                var tableData = data.map(function (item) {
                    return item.price;
                });
                var nameList = data.map(function (item) {
                    return formatDate(new Date(item.date));
                });
                var option = {
                    title : {
                        text: '每日客单价',
                        x:'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: nameList
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: tableData,
                        type: 'line'
                    }]
                };
                var scheduleRateChart = echarts.init($("#audience-price-container")[0]);
                scheduleRateChart.setOption(option);
            },
            function (error) {
                alert(JSON.stringify(error));
            });
    }
    // TODO:
    function getPlacingRate() {
        getRequest(
            'statistics/PlacingRate',
            function (res) {
                var data = res.content || [];
                var tableData = data.map(function (item) {
                    return item.price;
                });
                var nameList = data.map(function (item) {
                    return formatDate(new Date(item.date));
                });
                var option = {
                    title : {
                        text: '所有电影上座率',
                        x:'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: nameList
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: tableData,
                        type: 'line'
                    }]
                };
                var scheduleRateChart = echarts.init($("#place-rate-container")[0]);
                scheduleRateChart.setOption(option);
            },
            function (error) {
                alert(JSON.stringify(error));
            });
    }
    // TODO:
    function getPolularMovie() {
        var Day = $("#days").val();
        var MovieNum = $("#movieNum").val();
        if(Day==''){ day=30;}
        else {day=parseInt(Day);}
        if(MovieNum==''){movieNum=3;}
        else {movieNum =parseInt(MovieNum);}
        getRequest(
            '/statistics/popular/movie?days='+day+'&movieNum='+movieNum,
            function (res) {
                var data = res.content || [];
                var tableData = data.map(function (item) {
                    return item.boxOffice;
                });
                var nameList = data.map(function (item) {
                    return item.name;
                });
                var option = {
                    title : {
                        text: '受欢迎电影',
                        subtext: '截止至'+new Date().toLocaleDateString(),
                        x:'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: nameList
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: tableData,
                        type: 'bar'
                    }]
                };
                var scheduleRateChart = echarts.init($("#popular-movie-container")[0]);
                scheduleRateChart.setOption(option);
            },
            function (error) {
                alert(JSON.stringify(error));
            });
    }
    $('#submit').click(function () {
        if(isNaN($('#days').val()) || isNaN($('#movieNum').val())){
            alert('请输入数字！')
            return
        }
        $('#popular-movie-container').remove();
        $('#actionform').after('<div class="card table-container" id="popular-movie-container"></div>');
        getPolularMovie();
     });
});