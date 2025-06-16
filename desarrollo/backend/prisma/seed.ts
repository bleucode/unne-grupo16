// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import ubicacionData from "../data/ubicacion.json";

const prisma = new PrismaClient();

async function main() {
  for (const prov of ubicacionData) {
    // Upsert Provincia por nombre (o por código si lo tuvieras)
    const provincia = await prisma.provincia.upsert({
      where: { nombre: prov.name },
      update: {},
      create: {
        nombre: prov.name
      }
    });

    console.log(`Provincia procesada: ${provincia.nombre}`);

    // Para cada localidad, creamos o actualizamos
    for (const loc of prov.localidades) {
      const localidad = await prisma.localidad.upsert({
        where: {
          localidad_unique: {
            nombre: loc.name,
            id_provincia: provincia.id_provincia
          }
        },
        update: {},
        create: {
          nombre: loc.name,
          id_provincia: provincia.id_provincia
        }
      });
      console.log(`  └ Localidad procesada: ${localidad.nombre}`);
    }
  }
}

main()
  .catch((e) => {
    console.error("Error en seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
