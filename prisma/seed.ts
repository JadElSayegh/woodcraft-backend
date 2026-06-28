import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  await prisma.woodPriceVariant.deleteMany();
  await prisma.woodPriceGroup.deleteMany();
  await prisma.woodCharacteristic.deleteMany();
  await prisma.woodType.deleteMany();
  await prisma.productPhoto.deleteMany();
  await prisma.textSection.deleteMany();
  await prisma.homepageContent.deleteMany();

  const adminPasswordHash = await bcrypt.hash('Password123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.homepageContent.create({
    data: {
      singletonKey: 'homepage',
      heroTitle: 'Solid wood products',
      heroSubtitle: 'Oak, beech, ash from 1700 CZK per m3',
      heroButtonText: 'Order',
      heroButtonLink: '/contacts',
      heroBackgroundImage: '/images/hero-wood.png',
      heroImageOne: '/images/hero-wood-1.png',
      heroImageTwo: '/images/hero-wood-2.png',
      heroImageThree: '/images/hero-wood-3.png',
    },
  });

  await prisma.textSection.createMany({
    data: [
      {
        title: 'Premium natural wood',
        content:
          'We work with selected wood materials for durable furniture, wall details, and interior design projects.',
        image: '/images/text-section-1.png',
        order: 1,
        isActive: true,
      },
      {
        title: 'Custom production',
        content:
          'Each order can be adapted by size, wood type, thickness, finish, and project requirements.',
        image: '/images/text-section-2.png',
        order: 2,
        isActive: true,
      },
    ],
  });

  const oak = await prisma.woodType.create({
    data: {
      name: 'Oak',
      image: '/images/oak.png',
      order: 1,
      isActive: true,
    },
  });

  const buk = await prisma.woodType.create({
    data: {
      name: 'Buk',
      image: '/images/buk.png',
      order: 2,
      isActive: true,
    },
  });

  const ash = await prisma.woodType.create({
    data: {
      name: 'Ash',
      image: '/images/ash.png',
      order: 3,
      isActive: true,
    },
  });

  await seedCharacteristics(oak.id, [
    ['Durability', true],
    ['Beautiful texture', true],
    ['Water resistance', true],
    ['Expensive', false],
  ]);

  await seedCharacteristics(buk.id, [
    ['Durability', true],
    ['Hard to handle', false],
  ]);

  await seedCharacteristics(ash.id, [
    ['Durability', true],
    ['Hard to handle', false],
  ]);

  await seedPricing(oak.id, {
    height: 200,
    thickness: 40,
    pricePerM3: 1700,
    variants: [
      { length: 1000, volumeM3: 0.008, pricePerPiece: 13.6 },
      { length: 1500, volumeM3: 0.012, pricePerPiece: 20.4 },
      { length: 2000, volumeM3: 0.016, pricePerPiece: 27.2 },
      { length: 2500, volumeM3: 0.02, pricePerPiece: 34 },
    ],
  });

  await seedPricing(buk.id, {
    height: 200,
    thickness: 40,
    pricePerM3: 1400,
    variants: [
      { length: 1000, volumeM3: 0.008, pricePerPiece: 11.2 },
      { length: 1500, volumeM3: 0.012, pricePerPiece: 16.8 },
      { length: 2000, volumeM3: 0.016, pricePerPiece: 22.4 },
      { length: 2500, volumeM3: 0.02, pricePerPiece: 28 },
    ],
  });

  await seedPricing(ash.id, {
    height: 200,
    thickness: 40,
    pricePerM3: 1500,
    variants: [
      { length: 1000, volumeM3: 0.008, pricePerPiece: 12 },
      { length: 1500, volumeM3: 0.012, pricePerPiece: 18 },
      { length: 2000, volumeM3: 0.016, pricePerPiece: 24 },
      { length: 2500, volumeM3: 0.02, pricePerPiece: 30 },
    ],
  });

  await prisma.productPhoto.createMany({
    data: [
      {
        image: '/images/work-1.png',
        order: 1,
        isActive: true,
      },
      {
        image: '/images/work-2.png',
        order: 2,
        isActive: true,
      },
      {
        image: '/images/work-3.png',
        order: 3,
        isActive: true,
      },
      {
        image: '/images/work-4.png',
        order: 4,
        isActive: true,
      },
    ],
  });

  console.log('Seed completed.');
}

async function seedCharacteristics(
  woodTypeId: string,
  features: [string, boolean][],
) {
  await prisma.woodCharacteristic.createMany({
    data: features.map(([text, isPositive], index) => ({
      woodTypeId,
      text,
      isPositive,
      order: index + 1,
    })),
  });
}

async function seedPricing(
  woodTypeId: string,
  data: {
    height: number;
    thickness: number;
    pricePerM3: number;
    variants: {
      length: number;
      volumeM3: number;
      pricePerPiece: number;
    }[];
  },
) {
  const group = await prisma.woodPriceGroup.create({
    data: {
      woodTypeId,
      height: data.height,
      thickness: data.thickness,
      pricePerM3: data.pricePerM3,
    },
  });

  await prisma.woodPriceVariant.createMany({
    data: data.variants.map((variant, index) => ({
      woodPriceGroupId: group.id,
      length: variant.length,
      volumeM3: variant.volumeM3,
      pricePerPiece: variant.pricePerPiece,
      order: index + 1,
    })),
  });
}

main()
  .catch((error) => {
    console.error('Seed failed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
