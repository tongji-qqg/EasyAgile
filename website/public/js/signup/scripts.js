
jQuery(document).ready(function() {

    $('#register-form').submit(function(){
        var emailaddress = $(this).find('.emailaddress').val();
        var username = $(this).find('.username').val();
        var password = $(this).find('.password').val();
        var repeatpassword = $(this).find('.repeatpassword').val();

        if(emailaddress == '') {
            $(this).find('.error').fadeOut('fast', function(){
                $(this).css('top', '27px');
            });
            $(this).find('.error').fadeIn('fast', function(){
                $(this).parent().find('.emailaddress').focus();
            });
            return false;
        }
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
            url: '/reg',
            dataType: 'json',
            data: {
                email: emailaddress,
                name : username,
                password : password
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                if(data.state === 'error')
                    alert('error! '+ data.message);
                if(data.state === 'success')
                {                    
                    //location.href = "user/"+data.user._id;
                    alert('register success, please activate your account within 1 day')
                }
            }            
        });

        return false;
    });

    $('.page-container form .emailaddress, .page-container form .username, .page-container form .password, .page-container form .repeatpassword').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });

});
