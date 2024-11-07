import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
import { initDetail } from '../js/init-detail.js';

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  let routeParams = {};

  allRoutes.forEach((route) => {
    const routePattern = route.url.replace(/:([^/]+)/g, "([^/]+)"); // Convertit :id en une expression régulière
    const regex = new RegExp(`^${routePattern}$`);
    const match = url.match(regex);

    if (match) {
      currentRoute = route;
      const paramNames = [...route.url.matchAll(/:([^/]+)/g)].map((m) => m[1]);
      paramNames.forEach((paramName, index) => {
        routeParams[paramName] = match[index + 1]; // Récupère l'ID
      });
    }
  });

  return { route: currentRoute || route404, params: routeParams };
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de l'URL actuelle
  const { route: actualRoute, params } = getRouteByUrl(path);

  //Vérifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;

  if(allRolesArray.length > 0){
    if(allRolesArray.includes("disconnected")){
      if(isConnected()){
        window.location.replace("/");
      }
    }
    else{
      const roleUser = getRole();
      if(!allRolesArray.includes(roleUser)){
        window.location.replace("/");
      }
    }
  }

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS != "") {
    // Création d'une balise script
    let scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    // Ajout de la balise script au corps du document
    document.querySelector("body").appendChild(scriptTag);
  }

  // Appel à initDetail avec le type et les paramètres
  const type = actualRoute.url.split('/')[1]; // Exemple : 'animal' à partir de '/animal/:id'
  await initDetail({ type, ...params });

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  // Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();