import express from "express";
import bodyParser from "body-parser";
import fs from "fs"; // pour lire et écrire dans les fichiers

const app = express(); // création de l'application Express
let posts = []; // les posts seront stockés dans ma memoire.

app.set("view engine", "ejs");
app.use(express.static("public")); // pour mon fichier css
app.use(bodyParser.urlencoded({ extended: true })); // pour parser les données du formulaire


// Fonction pour charger les langues depuis un fichier JSON

function loadTranslations(lang) {
    try {
        const data = fs.readFileSync(`locales/${lang}.json`);
        return JSON.parse(data);
    }   catch (err) {
        return {}; // si le fichier n'existe pas, retourne un objet vide
    }
}

// Middleware pour gérer la langue
app.use("/:lang", (req, res, next) => {
    const lang = req.params.lang;
    if (["fr", "en"].includes(lang)) {
        req.lang = lang;
        req.t = loadTranslations(lang); // charge les traductions pour la langue demandée
        next(); // passe à la prochaine middleware ou route
    } else {
        res.redirect("/fr"); // redirige vers la langue par défaut si la langue n'est pas supportée
    } 
});
// route principale :  affichage des posts
app.get("/:lang", (req, res) => {
    res.render("home", { posts: posts, t: req.t, lang: req.lang }); // envoie les posts et les traductions à la vue

});

// route pour afficher le formulaire de création de post
app.get("/:lang/new", (req, res) => {
    res.render("new-post", { t: req.t, lang: req.lang }); // envoie le formulaire de création de post à la vue
});

// route pour ajouter un nouveau post
app.post("/:lang/new", (req, res) => {
    const newPost = {
        id: Date.now(), // utilisation de Date.now() pour générer un ID unique
        title: req.body.title,
        content:req.body.content
    };
    posts.push(newPost); // ajout du nouveau post à la liste des posts
    res.redirect(`/${req.lang}`); // redirection vers la page d'accueil pour afficher le nouveau post

});

// route pour modifier un post 

app.post("/:lang/edit/:id", (req, res) => {
    const postIndex = posts.findIndex(p => p.id == req.params.id);
    if (postIndex !== -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].content = req.body.content;
    }
    res.redirect(`/${req.lang}`); // redirection vers la page d'accueil après modification
});

// route get pour afficher le formulaire de modification d'un post
app.get("/:lang/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.render("edit-post", { post, t: req.t, lang: req.lang }); // envoie le post à modifier et les traductions à la vue

    } else {
        res.redirect(`/${req.lang}`); // si le post n'existe pas, redirection vers la page d'accueil
    }
});

// route pour supprimer un post
app.post("delete/:id", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id); // filtre les posts pour supprimer celui avec l'ID correspondant
    res.redirect(`/${req.lang}`); // redirection vers la page d'accueil

});

// lancement du serveur
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});