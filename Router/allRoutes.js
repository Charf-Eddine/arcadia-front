import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/modules/home/home.html", [],"/modules/home/home.js"),
    new Route("/schedules", "Les horaires", "/modules/schedules/schedules.html", [],"/modules/schedules/schedules.js"),
    new Route("/contact-us", "Contactez-nous", "/modules/contact-us/contact-us.html", [],"/modules/contact-us/contact-us.js"),
    new Route("/signin", "Connexion", "/modules/auth/signin.html", ["disconnected"],"/modules/auth/signin.js"),
    new Route("/user-management", "Gestion des utilisateurs", "/modules/user-management/users.html", [],"/modules/user-management/users.js"),
    new Route("/service-management", "Gestion des services", "/modules/service-management/services.html", [],"/modules/service-management/services.js"),
    new Route("/habitat-management", "Gestion des habitats", "/modules/habitat-management/habitats.html", [],"/modules/habitat-management/habitats.js"),
    new Route("/animal-management", "Gestion des animaux", "/modules/animal-management/animals.html", [],"/modules/animal-management/animals.js"),
    new Route("/schedule-management", "Gestion des horaires", "/modules/schedule-management/schedules.html", [],"/modules/schedule-management/schedules.js"),
    new Route("/daily-feed-management", "Alimentation quotidienne des animaux", "/modules/daily-feed-management/daily-feeds.html", [],"/modules/daily-feed-management/daily-feeds.js"),
    new Route("/veterinary-report-management", "Comptes rendus des animaux", "/modules/veterinary-report-management/veterinary-reports.html", [],"/modules/veterinary-report-management/veterinary-reports.js"),
    new Route("/veterinary-review-management", "Les avis sur les habitats", "/modules/veterinary-review-management/veterinary-reviews.html", [],"/modules/veterinary-review-management/veterinary-reviews.js"),
    new Route("/visitor-review-management", "Gestion des avis visiteurs", "/modules/visitor-review-management/visitor-reviews.html", [],"/modules/visitor-review-management/visitor-reviews.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia";