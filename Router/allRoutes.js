import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/services", "Services", "/pages/services.html", [],"/js/services.js"),
    new Route("/signin", "Connexion", "/pages/signin.html", ["disconnected"],"/js/auth/signin.js"),
    new Route("/contact-us", "Contactez-nous", "/pages/contact-us.html", [],"/js/contact-us.js"),
    new Route("/schedules", "Les horaires", "/pages/schedules.html", [],"/js/schedules.js"),
    new Route("/user-management", "Gestion des utilisateurs", "/pages/admin/users.html", [],"/js/admin/users.js"),
    new Route("/service-management", "Gestion des services", "/pages/admin/services.html", [],"/js/admin/services.js"),
    new Route("/schedule-management", "Gestion des horaires", "/pages/admin/schedules.html", [],"/js/admin/schedules.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia";