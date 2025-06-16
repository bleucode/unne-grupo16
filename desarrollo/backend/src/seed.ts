import { PrismaClient } from '@prisma/client';
import states from '../data/argentina_states.json';
import localities from '../data/argentina_localities.json';

const prisma = new PrismaClient();

async function main() {
  // 1) Upsert de provincias por nombre
  console.log(`Upserting ${states.length} provincias…`);
  for (const st of states as Array<{ code: string; name: string }>) {
    await prisma.provincia.upsert({
      where: { nombre: st.name },
      update: {},
      create: { nombre: st.name },
    });
  }

  // 2) Creo un mapa nombre → id_provincia
  const allProvs = await prisma.provincia.findMany();
  const provMap = Object.fromEntries(
    allProvs.map(p => [p.nombre, p.id_provincia] as const)
  );

  // 3) Upsert de localidades usando @@unique([nombre, id_provincia])
  console.log(`Upserting ${localities.length} localidades…`);
  for (const loc of localities as Array<{ code: string; name: string }>) {
    const provinciaNombre = codeToProvinciaNameMap[loc.code];
    const id_prov = provMap[provinciaNombre];
    if (!id_prov) {
      console.warn(`⚠️ Provincia "${provinciaNombre}" no existe, salto "${loc.name}"`);
      continue;
    }

    await prisma.localidad.upsert({
      where: {
        nombre_idProvincia: { // <- usar camelCase en claves compuestas
          nombre: loc.name,
          idProvincia: id_prov,
        }
      },
      update: {},
      create: {
        nombre: loc.name,
        id_provincia: id_prov,
      },
    });
  }

  console.log('✅ Seed completado.');
}

// Mapeo de códigos → nombres de provincias
const codeToProvinciaNameMap: Record<string, string> = {
  CAB: "Capital Federal",
  BSA: "Buenos Aires",
  CAT: "Catamarca",
  COR: "Córdoba",
  CRR: "Corrientes",
  CHA: "Chaco",
  CHU: "Chubut",
  ENT: "Entre Ríos",
  FOR: "Formosa",
  JUJ: "Jujuy",
  PAM: "La Pampa",
  RIO: "La Rioja",
  MEN: "Mendoza",
  MIS: "Misiones",
  NEU: "Neuquén",
  RNE: "Río Negro",
  SAL: "Salta",
  SJU: "San Juan",
  SLU: "San Luis",
  SCR: "Santa Cruz",
  SFE: "Santa Fe",
  SDE: "Santiago del Estero",
  TDF: "Tierra del Fuego",
  TUC: "Tucumán",
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
