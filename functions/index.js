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

const mapProductData = (docId, d) => {
    return {
        id: docId,
        name: d.name || "Produit",
        price: d.price || 0,
        price_value: (d.price || 0).toLocaleString('fr-FR'),
        imageUrl: d.imageUrl || d.image || d.imageURL || "https://firebasestorage.googleapis.com/v0/b/abidjansolution0006.appspot.com/o/abidjansolution_logo1.webp?alt=media",
        brand: d.brand || "EKKS Entreprise Sari",
        status_label: d.status || "Disponible",
        availability: d.availability || "En Stock",
        payment_link: `payment.html?name=${encodeURIComponent(d.name || "")}&price=${d.price || 0}`
    };
};

const ALLOWED_COLLECTIONS = [
    'products', 'shop', 'promo', 'locally', 'rentals', 'appliances', 
    'manufactory', 'miscellaneous', 'stock', 'computers', 'crypto', 
    'estate', 'hardware', 'partners', 'siteConfig'
];

exports.getProducts = onRequest({ memory: "256MiB", region: "us-central1" }, (req, res) => {
    cors(req, res, async () => {
        applyAmpHeaders(req, res);
        const { cat, q, collection = "products" } = req.query;

        if (!ALLOWED_COLLECTIONS.includes(collection)) {
            return res.status(403).json({ items: [] });
        }

        try {
            const queryRef = db.collection(collection);
            const snapshot = await queryRef.get();
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Format spécial pour le scroller infini de partenaires
            if (collection === 'partners') {
                return res.status(200).json({ 
                    items: [{ 
                        items: docs.map(d => ({
                            logoUrl: d.logoUrl || d.imageUrl || "",
                            width: d.width || 120,
                            height: d.height || 60,
                            name: d.name || "Partenaire"
                        }))
                    }] 
                });
            }

            // Pour siteConfig, on renvoie les objets bruts (pour accéder à companyInfo, contact, etc.)
            if (collection === 'siteConfig') {
                return res.status(200).json({ items: docs });
            }

            let products = docs.map(d => mapProductData(d.id, d));
            if (q) {
                const term = q.toLowerCase();
                products = products.filter(p => p.name.toLowerCase().includes(term));
            }

            res.status(200).json({ items: products });
        } catch (e) { 
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
                imageUrl: doc.data().imageUrl || doc.data().image || "",
                payment_link: `payment.html?name=${encodeURIComponent(doc.data().title || "")}&price=${doc.data().price || 0}`
            }));
            res.status(200).json({ items: slides });
        } catch (e) { res.status(200).json({ items: [] }); }
    });
});

exports.saveLeadAndNotify = onRequest({ memory: "256MiB", region: "us-central1" }, (req, res) => {
    cors(req, res, async () => {
        applyAmpHeaders(req, res);
        try {
            await db.collection("leads").add({ ...req.body, timestamp: admin.firestore.FieldValue.serverTimestamp() });
            res.status(200).json({ status: "success" });
        } catch (e) { res.status(500).json({ status: "error" }); }
    });
});