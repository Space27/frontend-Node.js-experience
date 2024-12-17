import '../stylesheets/style.less'
import '../images/static/logo.png'
import '../images/static/favicon-48x48.png'
import '../images/static/favicon.svg'
import '../images/static/favicon.ico'

$('#edit-modal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    const user = button.data('bs-user');
    const modal = $(this);

    modal.find('.modal-title').text(`Редактирование ${user.name}`);
    modal.find('.modal-body #form-id').val(user.id);
    modal.find('.modal-body #form-name').val(user.name);
    modal.find('.modal-body #form-email').val(user.email);
    modal.find('.modal-body #form-birth').val(new Date(user.birth).toISOString().slice(0, 10));
    modal.find('.modal-body #form-birth').attr({max: (new Date().toISOString().slice(0, 10))});
    modal.find('.modal-body #form-role').val(user.role);
    modal.find('.modal-body #form-status').val(user.status);
});

$(document).on('click', '.user__friends-button', function (event) {
    const button = $(this);
    const id = button.data('id');
    location.href = `/users/${id}/friends`;
});

$(document).on('click', '.user__news-button', function (event) {
    const button = $(this);
    const id = button.data('id');
    location.href = `/users/${id}/friends/news`;
});

$('#edit-dialog-form').on('submit', function (event) {
    const formData = new FormData($(this)[0]);
    const id = formData.get('id');

    $.ajax({
        url: '/users/' + id,
        data: formData,
        processData: false,
        contentType: false,
        type: 'PATCH',
        success: function (res) {
            const resDoc = $('<div></div>').html(res);

            $(`#user-${id}`).replaceWith(resDoc.find(`#user-${id}`));
        }
    });
});