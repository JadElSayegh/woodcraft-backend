import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateHomepageDto } from '../dto/cms/update-homepage.dto';
import { CreateCharacteristicDto } from '../dto/cms/create-characteristic.dto';
import { CreateWoodTypeDto } from '../dto/cms/create-wood-type.dto';
import { UpdateCharacteristicDto } from '../dto/cms/update-characteristic.dto';
import { UpdateWoodTypeDto } from '../dto/cms/update-wood-type.dto';
import { CreatePriceGroupDto } from '../dto/cms/create-price-group.dto';
import { CreatePriceVariantDto } from '../dto/cms/create-price-variant.dto';
import { UpdatePriceGroupDto } from '../dto/cms/update-price-group.dto';
import { UpdatePriceVariantDto } from '../dto/cms/update-price-variant.dto';
import { CreateProductPhotoDto } from '../dto/cms/create-product-photo.dto';
import { UpdateProductPhotoDto } from '../dto/cms/update-product-photo.dto';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepage() {
    const homepage = await this.prisma.homepageContent.findUnique({
      where: {
        singletonKey: 'homepage',
      },
    });

    if (!homepage) {
      throw new NotFoundException('Homepage content not found.');
    }

    return homepage;
  }

  async getTextSections() {
    return this.prisma.textSection.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getWoodTypes() {
    return this.prisma.woodType.findMany({
      where: {
        isActive: true,
      },
      include: {
        characteristics: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getProductPhotos() {
    return this.prisma.productPhoto.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getPricing() {
    return this.prisma.woodType.findMany({
      where: {
        isActive: true,
      },
      include: {
        priceGroups: {
          include: {
            variants: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }
  async updateHomepage(data: UpdateHomepageDto) {
    return this.prisma.homepageContent.upsert({
      where: {
        singletonKey: 'homepage',
      },
      update: data,
      create: {
        singletonKey: 'homepage',
        heroTitle: data.heroTitle || 'Solid wood products',
        heroSubtitle:
          data.heroSubtitle || 'Oak, beech, ash from 1700 CZK per m3',
        heroButtonText: data.heroButtonText || 'Order',
        heroButtonLink: data.heroButtonLink || '/contacts',
        heroBackgroundImage:
          data.heroBackgroundImage || '/images/hero-wood.png',
        heroImageOne: data.heroImageOne || '/images/hero-wood-1.png',
        heroImageTwo: data.heroImageTwo || '/images/hero-wood-2.png',
        heroImageThree: data.heroImageThree || '/images/hero-wood-3.png',
      },
    });
  }
  async createWoodType(data: CreateWoodTypeDto) {
    return this.prisma.woodType.create({
      data: {
        name: data.name,
        image: data.image,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
      include: {
        characteristics: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async updateWoodType(id: string, data: UpdateWoodTypeDto) {
    return this.prisma.woodType.update({
      where: { id },
      data,
      include: {
        characteristics: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async deleteWoodType(id: string) {
    await this.prisma.woodType.delete({
      where: { id },
    });

    return {
      message: 'Wood type deleted successfully.',
    };
  }

  async createCharacteristic(
    woodTypeId: string,
    data: CreateCharacteristicDto,
  ) {
    return this.prisma.woodCharacteristic.create({
      data: {
        woodTypeId,
        text: data.text,
        isPositive: data.isPositive,
        order: data.order ?? 0,
      },
    });
  }

  async updateCharacteristic(id: string, data: UpdateCharacteristicDto) {
    return this.prisma.woodCharacteristic.update({
      where: { id },
      data,
    });
  }

  async deleteCharacteristic(id: string) {
    await this.prisma.woodCharacteristic.delete({
      where: { id },
    });

    return {
      message: 'Characteristic deleted successfully.',
    };
  }
  async createPriceGroup(woodTypeId: string, data: CreatePriceGroupDto) {
    return this.prisma.woodPriceGroup.create({
      data: {
        woodTypeId,
        height: data.height,
        thickness: data.thickness,
        pricePerM3: data.pricePerM3,
      },
      include: {
        variants: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async updatePriceGroup(id: string, data: UpdatePriceGroupDto) {
    return this.prisma.woodPriceGroup.update({
      where: { id },
      data,
      include: {
        variants: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async deletePriceGroup(id: string) {
    await this.prisma.woodPriceGroup.delete({
      where: { id },
    });

    return {
      message: 'Price group deleted successfully.',
    };
  }

  async createPriceVariant(
    woodPriceGroupId: string,
    data: CreatePriceVariantDto,
  ) {
    return this.prisma.woodPriceVariant.create({
      data: {
        woodPriceGroupId,
        length: data.length,
        volumeM3: data.volumeM3,
        pricePerPiece: data.pricePerPiece,
        order: data.order ?? 0,
      },
    });
  }

  async updatePriceVariant(id: string, data: UpdatePriceVariantDto) {
    return this.prisma.woodPriceVariant.update({
      where: { id },
      data,
    });
  }

  async deletePriceVariant(id: string) {
    await this.prisma.woodPriceVariant.delete({
      where: { id },
    });

    return {
      message: 'Price variant deleted successfully.',
    };
  }
  async createProductPhoto(data: CreateProductPhotoDto) {
    return this.prisma.productPhoto.create({
      data: {
        image: data.image,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateProductPhoto(id: string, data: UpdateProductPhotoDto) {
    return this.prisma.productPhoto.update({
      where: { id },
      data,
    });
  }

  async deleteProductPhoto(id: string) {
    await this.prisma.productPhoto.delete({
      where: { id },
    });

    return {
      message: 'Product photo deleted successfully.',
    };
  }
}
