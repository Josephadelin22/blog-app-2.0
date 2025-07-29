import express from "express";
import bodyParser from "body-parser";
import fs from "fs"; // pour lire et écrire dans les fichiers
import axios from "axios";
import { error } from "console";

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
app.post("/:lang/delete/:id", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id); // filtre les posts pour supprimer celui avec l'ID correspondant
    res.redirect(`/${req.lang}`); // redirection vers la page d'accueil

});

// route pour afficher une citation inspirante
app.get("/:lang/quotes", async (req, res) => {
    try {
        const response = await axios.get("https://zenquotes.io/api/random");
        console.log("Reponse from Api", response.data);

        const quote = response.data[0].q; // texte de la citation
        const author = response.data[0].a; // auteur de la citation


        res.render("quotes", {
            quote,
            author,
            t: req.t, 
            lang: req.lang,               
            error: null
        });
        
        // - la citation
        // - l'auteur
        // - l'objet de traduction pour la langue courante (t)
        // - la langue courante (lang)
        // - aucun message d'erreur

    } catch (err) {
        console.error("Erreur lors de la récupération de la citation :", err);
        // Si l'appel API échoue, on affiche un message d'erreur
        res.render("quotes", {
            quote: null,
            author: null,
            t: req.t,
            lang: req.lang,
            error: req.quote_api_error || "Impossible de récupérer une citation pour le moment."
        });
    }
});


app.get("/:lang/quotes", async (req, res) => {
    try {
        let quote, author;
        const search = req.query.q;
        if (search) {
            // Recherche: recupere plusieurs citations et filtre par mot-clé
            const resp = await axios.get("https://zenquotes.io/api/rendom");
            const results = resp.data.filter(q => 
                q.q.toLowerCase().includes(search.toLowerCase())
            );
            if (results.length > 0) {
                quote = results[0].q;
                author = results[0].a;
            } else {
                quote = null;
                autho = null;
            }
        } else {

            // Citation aléatoire: recupere une citation aléatoire
            const resp = await axios.get("https://zenquotes.io/api/random");
            quote = resp.data[0].q;
            author = resp.data[0].a;
        }
        res.render("quotes", { quote, author, t: req.t, lang: req.lang, error: null });
    } catch (err) {
        console.error("Erreur lors de la récupération de la citation :", err);
        res.render("quotes", { quote: null, author: null, t: req.t, lang: req.lang, error: "Impossible de récupérer une citation pour le moment." });
    }
});

// Redirige toute requête racine vers /fr
app.get('/', (req, res) => {
    res.redirect('/fr');
});


// lancement du serveur
app.listen(3000, '0.0.0.0', () => {
    console.log("Server is running on port 3000");
});