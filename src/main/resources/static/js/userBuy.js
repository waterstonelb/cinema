var ticketList;
var cancelTickets=[];
$(document).ready(function () {
    getMovieList();
    function getMovieList() {
        getRequest(
            '/ticket/get/' + sessionStorage.getItem('id'),
            function (res) {
                ticketList=res.content;
                renderTicketList(res.content);
                ticketList.forEach(function (ticket) {
                    $('#movie-cancel-input').append("<option value="+ ticket.id +">"+ticket.schedule.movieName+(ticket.columnIndex+1)+"排"+(ticket.rowIndex+1)+"座"+"</option>");
                })
            },
            function (error) {
                alert(error);
            });
    }

    // TODO:填空
    function renderTicketList(list) {
        var strhtml='';
        for(let scheduleItemwithSeats of list) {
            strhtml+= "<tr>"+"<td>" + scheduleItemwithSeats.schedule.movieName + "</td>" +
                "<td>" + scheduleItemwithSeats.schedule.hallName + "</td>" +
                "<td>" + (scheduleItemwithSeats.rowIndex+1)+"排"+(scheduleItemwithSeats.columnIndex+1)+"座" + "</td>" +
                "<td>" + scheduleItemwithSeats.schedule.startTime.substr(0,19).replace("T", " ") + "</td>" +
                "<td>" + scheduleItemwithSeats.schedule.endTime.substr(0,19).replace("T", " ") + "</td>" +
                "<td>" + scheduleItemwithSeats.state + "</td>"+"</tr>";
        }
        $('#schedule-info').append(strhtml)
    }

    $('#movie-cancel-input').change(function () {
        var ticketId = $('#movie-cancel-input').val();
        cancelTickets.push(ticketId);
        renderSelectedMovies(ticketId);
    });

    //渲染选择的退票的电影
    function renderSelectedMovies(ticketId) {
        var strhtml='';
        for(let scheduleItemwithSeats of ticketList) {
            if (scheduleItemwithSeats.id == ticketId) {
                strhtml +="<tr id='"+scheduleItemwithSeats.id+"'>"+"<td>" + scheduleItemwithSeats.schedule.movieName + "</td>" +
                    "<td>" + scheduleItemwithSeats.schedule.hallName + "</td>" +
                    "<td>" + (scheduleItemwithSeats.rowIndex+ 1) + "排" + (scheduleItemwithSeats.columnIndex + 1) + "座" + "</td>" +
                    "<td>" + scheduleItemwithSeats.schedule.startTime.substr(0, 19).replace("T", " ") + "</td>" +
                    "<td>" + scheduleItemwithSeats.schedule.endTime.substr(0, 19).replace("T", " ") + "</td>" +
                    "<td>" + scheduleItemwithSeats.state + "</td>"+ "</tr>";
            }
        }
        $('#cancel-info').append(strhtml);
    }
    $("#cancel-btn-form").click(function () {
        if (cancelTickets.length<1)
            alert("您没有选择要退的电影票");
        else {
            postRequest(
                "/ticket/cancel",
                cancelTickets,
                function (res) {
                    alert("退票成功");
                    $("#cancel-info").empty();
                },
                function (error) {
                    alert("退票失败")
                }
            )
        }
    });
    $("#back-btn").click(function () {
        $("#cancel-info").empty();
        cancelTickets=[];
    });

});