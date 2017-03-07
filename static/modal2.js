function setButtonAction(){
    $('#loginForm').on('submit', function(event){
        $('p.error_message').remove();
        event.preventDefault(); // 本来のPOSTを打ち消すおまじない
        var email = $('#email').val();
        var pw = $('#password').val();
        console.log('emali:'+email+", pw:"+pw)
        $.ajax({
          url:'/login',
          type:'post',
          data:{
            json: true,
            email: email,
            pw: pw
          },
          xhrFields: {
            withCredentials: true
          }
        })
        .then(
            function(data) {
                console.log(data)
                if(data.status == 'success'){
                    $('#loginForm').addClass('hidden');
                    $('#userMessage').removeClass('hidden');
                    $('#accountButton').text()
                }else{
                    $('#loginForm').before('<p class="error_message alert alert-danger">' + 'Error!' +  '</p>');
                }
            },
            function(){
                alert('error')
            }
        );
    });
    $('#account').on('click', function(){
        $.ajax({
          url:'/account',
          type:'get',
          xhrFields: {
            withCredentials: true
          }
        }).done(function(data) {
           console.log(data);
        });
    });
    $('#logout').on('click', function(){
        $('p.error_message').remove();
        $.ajax({
          url:'/logout',
          type:'get',
          data: {
            json: true
          },
          xhrFields: {
            withCredentials: true
          }
        })
        .then(
            function(data) {
               console.log(data);
               if(data.status == 'success'){
                    $('#loginForm').removeClass('hidden');
                    $('#userMessage').addClass('hidden');
                    $('#accountButton').text('ログイン')
               }
            },
            function(){
            }
        );
    });
}

$(function(){
    // ダイアログ表示前にJavaScriptで操作する
    $('#remoteModal').on('show.bs.modal', function(e) {
        setButtonAction();
    });
//    $('#remoteModal').on('click', '.modal-footer .btn-primary', function() {
//        $('#remoteModal').modal('hide');
//        alert('変更を保存をクリックしました。');
//    });

    // JavaScript で表示
    $('#accountButton').on('click', function() {
      $('#accountModal').modal();
    });
    // ダイアログ表示前にJavaScriptで操作する
    $('#accountModal').on('show.bs.modal', function(event) {
      $('#remoteModal').css('opacity', .5);
      var button = $(event.relatedTarget);
      var recipient = button.data('whatever');
      var modal = $(this);
      modal.find('.modal-body .recipient').text(recipient);
      //modal.find('.modal-body input').val(recipient);
    });
    // ダイアログ表示直後にフォーカスを設定する
    $('#accountModal').on('shown.bs.modal', function(event) {
      $(this).find('.modal-footer .btn-default').focus();
    });
    $('#accountModal').on('hide.bs.modal', function(event) {
      $('#remoteModal').css('opacity', 1);
    });
//    $('#accountModal').on('click', '.modal-footer .btn-primary', function() {
//      $('#accountModal').modal('hide');
//      alert('変更を保存をクリックしました。');
//    });

});