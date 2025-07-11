$(document).ready(function() {

    //recuperer la langue a partir du html

    const lang = $('html').attr('lang') || 'fr';
    // fonction qui renvoie le message selon la langue
    function getConfirmationMessage(){
        if (lang === 'en') {
            return 'Do you really want to delete this post?';
        }
        return 'Voulez-vous vraiment supprimer ce post ?';

    }
    // cacher afficher les articles
    $('#toggle-posts').click(function() {
        $('#post-list').toggle();
        $(this).text(function(i,text) {
            return text === "Cacher les articles" || text === "Hide posts"
                ? (text === "Cacher les articles" ? "Afficher les articles" : "Show posts")
                : (text === "Afficher les articles" ? "Cacher les articles" : "Hide posts");
        })
    });

});

// Confirmation avant la suppression d'un post
$("form.delete-post-form").submit(function (e) {
    if (!confirm('Voulez-vous vraimnent supprimer ce post ?')) {
        e.preventDefault(); // empêche la soumission du formulaire si l'utilisateur annule
    }
});

