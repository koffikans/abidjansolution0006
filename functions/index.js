/**
 * Abidjan Solution - API Cloud Functions v2 (Node 22)
 */
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });

if (!admin.apps.length) admin.initializeApp();
const db = getFirestore("default");

const applyAmpHeaders = (req, res) => {
    res.set("Access-Control-Expose-Headers", "AMP-Control-Allow-Source-Origin");
    const origin = req.query.__amp_source_origin;
    if (origin) res.set("AMP-Control-Allow-Source-Origin", origin);
};

/**
 * Mappage standard pour les produits - CORRIGÉ pour inclure la catégorie
 */
const mapProductData = (docId, d) => {
    const status = d.product_count || d.status || "Disponible";
    const info = d.info_label && d.info_value ? `${d.info_label} : ${d.info_value}` : (d.availability || "En Stock");
    
    return {
        id: docId,
        category: d.category || "divers", // CRUCIAL : Permet le filtrage côté Backend
        name: d.name || "Produit",
        price: d.price || 0,
        price_value: (d.price || 0).toLocaleString('fr-FR'),
        imageUrl: d.imageUrl || "https://firebasestorage.googleapis.com/v0/b/abidjansolution0006.appspot.com/o/abidjansolution_logo1.webp?alt=media",
        brand: d.brand || "EKKS Entreprise Sari",
        status_label: status,
        availability: info,
        payment_link: `payment.html?name=${encodeURIComponent(d.name || "")}&price=${d.price || 0}`
    };
};

const ALLOWED_COLLECTIONS = ['products', 'partners', 'siteConfig'];

exports.getProducts = onRequest({ memory: "256MiB", region: "us-central1" }, (req, res) => {
    cors(req, res, async () => {
        applyAmpHeaders(req, res);
        const { category: cat, q, collection = "products" } = req.query;

        if (!ALLOWED_COLLECTIONS.includes(collection)) {
            return res.status(403).json({ items: [] });
        }

        try {
            const queryRef = db.collection(collection).orderBy("priority", "asc");
            const snapshot = await queryRef.get();
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (collection === 'siteConfig') {
                return res.status(200).json({ items: docs });
            }

            let products = docs.map(d => mapProductData(d.id, d));
            
            // Filtrage par catégorie
            if (cat) {
                products = products.filter(p => p.category.toLowerCase() === cat.toLowerCase());
            }
            
            if (q) {
                const term = q.toLowerCase();
                products = products.filter(p => p.name.toLowerCase().includes(term));
            }

            res.status(200).json({ items: products });
        } catch (e) { 
            console.error(e);
            res.status(200).json({ items: [] }); 
        }
    });
});

exports.getCategories = onRequest({ memory: "128MiB", region: "us-central1" }, (req, res) => {
    cors(req, res, async () => {
        applyAmpHeaders(req, res);
        try {
            const snapshot = await db.collection("categories").get();
            const cats = snapshot.docs.map(doc => doc.data());
            res.status(200).json({ items: cats });
        } catch (e) { res.status(200).json({ items: [] }); }
    });
});

// Dans functions/index.js
exports.getHeroSlides = onRequest({ memory: "256MiB", region: "us-central1" }, (req, res) => {
  cors(req, res, async () => {
    applyAmpHeaders(req, res);
    const { tab } = req.query;
    try {
      let query = db.collection("heroSlides").orderBy("order", "asc");
      if (tab) query = query.where("tab", "==", tab);
      const snapshot = await query.get();
      const slides = snapshot.docs.map(doc => ({
        ...doc.data(),
        imageUrl: (doc.data().imageUrl || "").trim()
      }));
      // ✅ Format compatible avec `single-item items="."`
      res.status(200).json({ items: slides });
    } catch (e) {
      res.status(200).json({ items: [] });
    }
  });
});

// Remplacez par ceci
exports.getPartners = onRequest({ memory: "128MiB", region: "us-central1" }, (req, res) => {
  cors(req, res, async () => {
    applyAmpHeaders(req, res);
    try {
      const snapshot = await db.collection("partners").orderBy("order", "asc").get();
      const partners = snapshot.docs.map(doc => ({
        logoUrl: (doc.data().logoUrl || "").trim(),
        width: doc.data().width || 120,
        height: doc.data().height || 60,
        name: doc.data().name || ""
      }));
      // ✅ Retourne un objet avec un tableau "list"
      res.status(200).json({ list: partners });
    } catch (e) {
      res.status(200).json({ list: [] });
    }
  });
});

exports.getSiteConfig = onRequest({ memory: "256MiB", region: "us-central1" }, (req, res) => {
    cors(req, res, async () => {
        applyAmpHeaders(req, res);
        const config = {
            projectName: "Abidjan Solution",
            contact: {
                phone: "07 07 28 34 05",
                email: "ekks@abidjansolution.biz",
                address: "Abidjan, Cocody Riviera 3 Lycée Francais Blaise Pascal",
                assistanceLabel: "Assistance 0707283405"
            },
            companyInfo: {
                fullName: "EKKS Entreprise Sarl",
                poBox: "18 BP 1786 Abidjan 18",
                rcNumber: "RC:CI-ABJ-2019-B-21896",
                ccNumber: "1973347 D",
                bank: "UBA",
                accountNumber: "105340002263"
            },
            assets: {
                logoUrl: "https://firebasestorage.googleapis.com/v0/b/abidjansolution0006.appspot.com/o/abidjansolution_logo1.webp?alt=media"
            },
            socialLinks: {
                whatsapp: "https://wa.me/2250707283405",
                facebook: "https://www.facebook.com/abidjansolution",
                tiktok: "https://www.tiktok.com/@abidjansolution",
                instagram: "https://www.instagram.com/abidjansolution"
            }
        };
        res.status(200).json({ items: [config] });
    });
});