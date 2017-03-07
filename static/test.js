$(function() {
    // JavaScript で表示
    $('#remoteModalButton').on('click', function() {
      $('#remoteModal').removeData('bs.modal'); //< 毎回新規に読み込み
      $.ajax({
          type: 'GET',
          url: 'http://wasnot.net/modal2.html',
          dataType: 'html',
          xhrFields: {
            withCredentials: true
          }
     })
     .then(
         function(data){
            $('#remoteModalContent').html($(data));
            $('#remoteModal').modal();
         },
         function(){
         }
     );
//      $('#remoteModal').modal({'remote': 'http://wasnot.net/modal2.html'});
//      $('#remoteModal').modal({'remote': 'modal.html'});
    });
    // ダイアログ表示前にJavaScriptで操作する
    $('#remoteModal').on('show.bs.modal', function(e) {
      $('#remoteModal .modal-body').append('<a class="btn btn-info" href="#addjs">JavaScript で追加したボタン</a>');
        $('#loginForm').on('submit', function(event){
            $('p.error_message').remove();
            event.preventDefault(); // 本来のPOSTを打ち消すおまじない
            var email = $('#email').val();
            var pw = $('#password').val();
            console.log('emali:'+email+", pw:"+pw)
            $.ajax({
              url:'http://wasnot.net/login',
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
                    }else{
                        $('#loginForm').before('<p class="error_message">' + 'Error!' +  '</p>');
                    }
                },
                function(){
                    alert('error')
                }
            );
        });
        $('#account').on('click', function(){
            $.ajax({
              url:'http://wasnot.net/account',
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
              url:'http://wasnot.net/logout',
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
                   }
                },
                function(){
                }
            );
        });
    });
    $('#remoteModal').on('click', '.modal-footer .btn-primary', function() {
      $('#remoteModal').modal('hide');
      alert('変更を保存をクリックしました。');
    });
    $('#remoteModal').on('click', 'a[href="#addjs"]', function() {
      alert('JavaScript で追加したボタンをクリックしました。');
      $('#remoteModal').modal('hide');
    });
});