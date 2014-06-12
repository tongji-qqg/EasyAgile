
jQuery(document).ready(function() {

    $('#register-form').submit(function(){
        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        var repeatpassword = $(this).find('.repeatpassword').val();

        if(username == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '96px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.username').focus();
            });
            return false;
        }
        if(password == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '165px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.password').focus();
            });
            return false;
        }
        if(repeatpassword == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '234px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.repeatpassword').focus();
            });
            return false;
        }

        $.ajax({
            type: 'POST',
            url: '/API/invite/register',
            dataType: 'json',
            data: {                
                name : username,
                password : password
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.state === 'error')
                    bootbox.alert(data.message);
                if(data.state === 'success')
                {                    
                    window.location.replace('/user/'+data.user._id); 
                }
            }            
        });

        return false;
    });

});
