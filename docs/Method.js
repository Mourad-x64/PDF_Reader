/**
 * Collection de méthodes utilitaires JavaScript
 */
class UtilityMethods {
  /**
   * Formate un nombre en prix avec devise
   * @param {number} amount - Le montant à formater
   * @param {string} currency - Le code de la devise (par défaut: EUR)
   * @param {string} locale - La locale à utiliser (par défaut: fr-FR)
   * @returns {string} Le prix formaté
   */
  formatPrice(amount, currency = "EUR", locale = "fr-FR") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  /**
   * Génère un identifiant unique
   * @param {number} length - La longueur souhaitée de l'identifiant (par défaut: 10)
   * @returns {string} L'identifiant unique généré
   */
  generateUniqueId(length = 10) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  /**
   * Tronque un texte à une longueur maximale
   * @param {string} text - Le texte à tronquer
   * @param {number} maxLength - La longueur maximale souhaitée
   * @param {string} suffix - Le suffixe à ajouter (par défaut: "...")
   * @returns {string} Le texte tronqué
   */
  truncateText(text, maxLength, suffix = "...") {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Valide une adresse email
   * @param {string} email - L'adresse email à valider
   * @returns {boolean} True si l'email est valide, false sinon
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Calcule le temps écoulé depuis une date donnée
   * @param {Date} date - La date de référence
   * @returns {string} Le temps écoulé en format lisible
   */
  getTimeElapsed(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
      année: 31536000,
      mois: 2592000,
      semaine: 604800,
      jour: 86400,
      heure: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `Il y a ${interval} ${unit}${interval > 1 ? "s" : ""}`;
      }
    }

    return "À l'instant";
  }

  /**
   * Mélange aléatoirement les éléments d'un tableau
   * @param {Array} array - Le tableau à mélanger
   * @returns {Array} Le tableau mélangé
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Convertit une chaîne en slug URL
   * @param {string} string - La chaîne à convertir
   * @returns {string} Le slug généré
   */
  generateSlug(string) {
    return string
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  /**
   * Vérifie si un objet est vide
   * @param {Object} obj - L'objet à vérifier
   * @returns {boolean} True si l'objet est vide, false sinon
   */
  isEmptyObject(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) return false;
    }
    return true;
  }

  /**
   * Groupe les éléments d'un tableau par une propriété
   * @param {Array} array - Le tableau à grouper
   * @param {string} key - La propriété à utiliser pour le groupement
   * @returns {Object} L'objet groupé
   */
  groupBy(array, key) {
    return array.reduce((acc, current) => {
      const groupKey = current[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(current);
      return acc;
    }, {});
  }

  /**
   * Effectue une requête HTTP avec gestion du délai d'attente
   * @param {string} url - L'URL de la requête
   * @param {Object} options - Les options de la requête
   * @param {number} timeout - Le délai d'attente en millisecondes
   * @returns {Promise} La promesse de la requête
   */
  async fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === "AbortError") {
        throw new Error(
          "La requête a été abandonnée : délai d'attente dépassé"
        );
      }
      throw error;
    }
  }
}

// Exemple d'utilisation
const utils = new UtilityMethods();

// Exemples d'utilisation des méthodes
console.log(utils.formatPrice(42.99)); // 42,99 €
console.log(utils.generateUniqueId()); // Chaîne aléatoire de 10 caractères
console.log(utils.truncateText("Un très long texte", 10)); // "Un très..."
console.log(utils.validateEmail("test@example.com")); // true
console.log(utils.getTimeElapsed(new Date("2024-01-01"))); // "Il y a X mois"
console.log(utils.shuffleArray([1, 2, 3, 4, 5])); // Array mélangé
console.log(utils.generateSlug("Voici un Titre d'Article!")); // "voici-un-titre-d-article"
console.log(utils.isEmptyObject({})); // true
console.log(
  utils.groupBy([{ type: "A" }, { type: "B" }, { type: "A" }], "type")
); // Groupé par type
