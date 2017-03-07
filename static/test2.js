$(function() {
    // JavaScript で表示
    $('#remoteModalButton').on('click', function() {
        $('#modalSpace').removeData(); //< 毎回新規に読み込み
        $.ajax({
            type: 'GET',
            url: '/modal2.html',
            dataType: 'html',
            xhrFields: {
                withCredentials: true
            }
        })
        .then(
            function(data){
                $('#modalSpace').html($(data));
                $('#remoteModal').modal();
            },
            function(){
            }
        );
    });


    $('#myModal2').on('show.bs.modal', function() {
        $('#myModal').css('opacity', .5);
//        $('#myModal').unbind();
    });
    $('#myModal2').on('hide.bs.modal', function() {
        $('#myModal').css('opacity', 1);
//        $('#myModal').removeData("modal").modal({});
    });
});