import Route from "./Route.js";

//Définir ici les routes
export const allRoutes = [
    new Route("/", "Accueil", "/modules/home/home.html", [],"/modules/home/home.js"),
    new Route("/schedules", "Les horaires", "/modules/schedules/schedules.html", [],"/modules/schedules/schedules.js"),
    new Route("/contact-us", "Contactez-nous", "/modules/contact-us/contact-us.html", [],"/modules/contact-us/contact-us.js"),
    new Route("/signin", "Connexion", "/modules/auth/signin.html", ["disconnected"],"/modules/auth/signin.js"),
    new Route("/user-management", "Gestion des utilisateurs", "/modules/user-management/users.html", ["admin"],"/modules/user-management/users.js"),
    new Route("/service-management", "Gestion des services", "/modules/service-management/services.html", ["admin", "employee"],"/modules/service-management/services.js"),
    new Route("/habitat-management", "Gestion des habitats", "/modules/habitat-management/habitats.html", ["admin"],"/modules/habitat-management/habitats.js"),
    new Route("/animal-management", "Gestion des animaux", "/modules/animal-management/animals.html", ["admin"],"/modules/animal-management/animals.js"),
    new Route("/schedule-management", "Gestion des horaires", "/modules/schedule-management/schedules.html", ["admin"],"/modules/schedule-management/schedules.js"),
    new Route("/daily-feed-management", "Alimentation quotidienne des animaux", "/modules/daily-feed-management/daily-feeds.html", ["employee", "veterinarian"],"/modules/daily-feed-management/daily-feeds.js"),
    new Route("/veterinary-report-management", "Comptes rendus des animaux", "/modules/veterinary-report-management/veterinary-reports.html", ["veterinarian", "admin"],"/modules/veterinary-report-management/veterinary-reports.js"),
    new Route("/veterinary-review-management", "Les avis sur les habitats", "/modules/veterinary-review-management/veterinary-reviews.html", ["veterinarian"],"/modules/veterinary-review-management/veterinary-reviews.js"),
    new Route("/visitor-review-management", "Gestion des avis visiteurs", "/modules/visitor-review-management/visitor-reviews.html", ["employee"],"/modules/visitor-review-management/visitor-reviews.js"),
    new Route("/habitat/:id", "Détail de l'habitat", "/modules/habitat-detail/habitat-detail.html", [],"/modules/habitat-detail/habitat-detail.js"),
    new Route("/animal/:id", "Détail de l'animal", "/modules/animal-detail/animal-detail.html", [], "/modules/animal-detail/animal-detail.js"),
    new Route("/dashboard", "Tableau de bord", "/modules/dashboard/dashboard.html", ["admin"], "/modules/dashboard/dashboard.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Arcadia";