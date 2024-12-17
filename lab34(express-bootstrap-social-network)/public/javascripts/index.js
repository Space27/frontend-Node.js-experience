import '../stylesheets/style.less'
import '../images/static/logo.png'
import '../images/static/favicon-48x48.png'
import '../images/static/favicon.svg'
import '../images/static/favicon.ico'

$('#sign-form').on('submit', function (event) {
    const formData = new FormData($(this)[0]);

    $.ajax({
        url: 'https://localhost:443/',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
            location.href = 'https://localhost:443/users';
        }
    });
});