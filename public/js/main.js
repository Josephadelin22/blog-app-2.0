$(document).ready(function() {

    //recuperer la langue a partir du html
    $('#toggle-posts').click(function() {
        $('#post-list').slideToggle(300);
        if ($('#post-list').is(':visible')) {
            $(this).text(hideText);
        } else {
            $(this).text(showText);
        }
    });



// Confirmation avant la suppression d'un post
    $("form.delete-post-form").submit(function (e) {
        if (!confirm(deleteConfirmMsg)) {
        e.preventDefault(); // empêche la soumission du formulaire si l'utilisateur annule
        }
    });

});

