import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { parseISO } from 'date-fns';

dotenv.config();
const prisma = new PrismaClient();

const brands = [
  "Nike", "Adidas", "Air Jordan", "Puma", "Asics", "New Balance", "Converse",
  "Balenciaga", "Vans", "Timberland", "Under Armour", "Fila", "Crocs"
];

const limit = 100;
const maxPerBrand = 1500;
const KICKS_API_KEY = process.env.KICKS_API_KEY;

function extractSku(title: string, rawSku: string | null, fallbackId: string | null): string {
  if (rawSku && rawSku.length <= 100) return rawSku;
  const match = title.match(/([A-Z0-9\-]{6,})$/);
  if (match) return match[1];
  return fallbackId?.slice(0, 100) || "UNKNOWN";
}

async function seed() {
  let totalInserted = 0;

  for (const brandName of brands) {
    console.log(`\n📦 Importation des produits ${brandName}...`);
    let page = 1;
    let brandInserted = 0;

    const brand = await prisma.brands.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName }
    });

    while (brandInserted < maxPerBrand) {
      const url = `https://api.kicks.dev/v3/shopify/products?limit=${limit}&page=${page}&filters=brand='${brandName}'`;
      const headers = { Authorization: `Bearer ${KICKS_API_KEY}` };

      const response = await axios.get(url, { headers });
      const data = response.data?.data || [];

      if (!data.length) {
        console.log(`🛑 Plus de produits ${brandName} disponibles`);
        break;
      }

      for (const s of data) {
        try {
          const images = s.images || [];
          if (!images.length) continue;

          const categoryRaw = (s.product_type || "").toLowerCase();
          if (!["shoe", "sneaker", "sandals"].some(k => categoryRaw.includes(k))) continue;

          const categoryName = s.product_type || "Autre";
          const categorySku = s.product_id;

          const category = await prisma.categories.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName, sku: categorySku }
          });

          const title = s.title;
          const description = s.description;
          const price = parseFloat(s.price_display) || 0;
          const rawSku = s.sku;
          const fallbackId = s.product_id;
          const productSku = extractSku(title, rawSku, fallbackId);
          const createdAt = s.product_created_at ? parseISO(s.product_created_at) : new Date();

          const product = await prisma.products.upsert({
            where: { sku: productSku },
            update: {},
            create: {
              name: title,
              description,
              price,
              sku: productSku,
              created_at: createdAt,
              brand: { connect: { id: brand.id } },
              category: { connect: { id: category.id } },
              variants: {
                create: (s.variants || []).map((v: any) => ({
                  size: v.options?.Size,
                  color: v.options?.Color,
                  price: parseFloat(v.price || price.toString()),
                  stock: v.available ? 1 : 0,
                  created_at: v.created_at ? parseISO(v.created_at) : new Date()
                }))
              },
              images: {
                create: images.map((img: string, i: number) => ({
                  image_url: img,
                  is_primary: i === 0,
                  display_order: i
                }))
              }
            }
          });

          for (const tag of s.tags || []) {
            const tagCategory = await prisma.categories.findUnique({ where: { name: tag } });
            if (tagCategory) {
              await prisma.categories_products.create({
                data: {
                  category_id: tagCategory.id,
                  product_id: product.id
                }
              });
            }
          }

          brandInserted++;
          totalInserted++;

        } catch (e: unknown) {
          if (e instanceof Error) {
            console.error(`⚠️ Erreur produit ${s.title} :`, e.message);
          } else {
            console.error(`⚠️ Erreur produit ${s.title} :`, e);
          }
        }
      }

      page++;
    }
  }

  console.log(`\n✅ Fin du script. Total produits insérés : ${totalInserted}`);
  await prisma.$disconnect();
}

seed();