// CmsController: HTTP endpoints for CMS management and public content
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCharacteristicDto } from '../dto/cms/create-characteristic.dto';
import { CreateWoodTypeDto } from '../dto/cms/create-wood-type.dto';
import { UpdateCharacteristicDto } from '../dto/cms/update-characteristic.dto';
import { UpdateHomepageDto } from '../dto/cms/update-homepage.dto';
import { UpdateWoodTypeDto } from '../dto/cms/update-wood-type.dto';
import { CmsService } from '../services/cms.service';
import { CreatePriceGroupDto } from '../dto/cms/create-price-group.dto';
import { CreatePriceVariantDto } from '../dto/cms/create-price-variant.dto';
import { UpdatePriceGroupDto } from '../dto/cms/update-price-group.dto';
import { UpdatePriceVariantDto } from '../dto/cms/update-price-variant.dto';
import { CreateProductPhotoDto } from '../dto/cms/create-product-photo.dto';
import { UpdateProductPhotoDto } from '../dto/cms/update-product-photo.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

const homepageExample = {
  id: 'homepage-id',
  singletonKey: 'homepage',
  heroTitle: 'Solid wood products',
  heroSubtitle: 'Oak, beech, ash from 1700 CZK per m3',
  heroButtonText: 'Order',
  heroButtonLink: '/contacts',
  heroBackgroundImage: '/images/hero-wood.png',
  heroImageOne: '/images/hero-wood-1.png',
  heroImageTwo: '/images/hero-wood-2.png',
  heroImageThree: '/images/hero-wood-3.png',
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const textSectionExample = {
  id: 'text-section-id',
  title: 'About our wood',
  content: 'We source durable hardwoods with careful grading.',
  image: '/images/about-wood.png',
  order: 0,
  isActive: true,
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const woodCharacteristicExample = {
  id: 'characteristic-id',
  woodTypeId: 'wood-type-id',
  text: 'High density and strong grain structure',
  isPositive: true,
  order: 0,
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const woodPriceVariantExample = {
  id: 'variant-id',
  woodPriceGroupId: 'price-group-id',
  length: '600.00',
  volumeM3: '0.024000',
  pricePerPiece: '240.00',
  order: 0,
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const woodPriceGroupExample = {
  id: 'price-group-id',
  woodTypeId: 'wood-type-id',
  height: '120.00',
  thickness: '45.00',
  pricePerM3: '14500.00',
  variants: [woodPriceVariantExample],
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const woodTypeExample = {
  id: 'wood-type-id',
  name: 'Oak',
  image: '/images/oak.png',
  order: 0,
  isActive: true,
  characteristics: [woodCharacteristicExample],
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const woodTypePricingExample = {
  ...woodTypeExample,
  priceGroups: [woodPriceGroupExample],
};

const productPhotoExample = {
  id: 'product-photo-id',
  image: '/uploads/1719576000000-oak-board.jpg',
  order: 0,
  isActive: true,
  createdAt: '2026-06-28T12:00:00.000Z',
  updatedAt: '2026-06-28T12:00:00.000Z',
};

const adminUserExample = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  role: 'ADMIN',
};

const okObject = (example: object) => ({
  'application/json': {
    schema: {
      example,
    },
  },
});

const messageResponse = (message: string) => ({
  'application/json': {
    schema: {
      example: { message },
    },
  },
});

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('homepage')
  @ApiOperation({ summary: 'Get homepage content' })
  @ApiOkResponse({
    description: 'Homepage content returned.',
    content: okObject(homepageExample),
  })
  getHomepage() {
    return this.cmsService.getHomepage();
  }

  @Patch('homepage')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update homepage content' })
  @ApiBody({
    description:
      'Update any homepage field. Omitted properties stay unchanged.',
    schema: {
      type: 'object',
      example: {
        heroTitle: 'Solid wood products',
        heroButtonText: 'Order',
      },
    },
  })
  @ApiOkResponse({
    description: 'Homepage content updated.',
    content: okObject(homepageExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateHomepage(@Body() updateHomepageDto: UpdateHomepageDto) {
    return this.cmsService.updateHomepage(updateHomepageDto);
  }

  @Get('text-sections')
  @ApiOperation({ summary: 'Get active text sections' })
  @ApiOkResponse({
    description: 'Active text sections returned.',
    content: {
      'application/json': {
        schema: {
          example: [textSectionExample],
        },
      },
    },
  })
  getTextSections() {
    return this.cmsService.getTextSections();
  }

  @Get('wood-types')
  @ApiOperation({ summary: 'Get active wood types' })
  @ApiOkResponse({
    description: 'Wood types returned with characteristics.',
    content: {
      'application/json': {
        schema: {
          example: [woodTypeExample],
        },
      },
    },
  })
  getWoodTypes() {
    return this.cmsService.getWoodTypes();
  }

  @Get('product-photos')
  @ApiOperation({ summary: 'Get active product photos' })
  @ApiOkResponse({
    description: 'Product photos returned.',
    content: {
      'application/json': {
        schema: {
          example: [productPhotoExample],
        },
      },
    },
  })
  getProductPhotos() {
    return this.cmsService.getProductPhotos();
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Get pricing data' })
  @ApiOkResponse({
    description: 'Pricing returned.',
    content: {
      'application/json': {
        schema: {
          example: [woodTypePricingExample],
        },
      },
    },
  })
  getPricing() {
    return this.cmsService.getPricing();
  }

  @Get('dashboard')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get admin dashboard access payload' })
  @ApiOkResponse({
    description: 'Admin access granted.',
    content: okObject({
      message: 'Admin dashboard access granted.',
      user: adminUserExample,
    }),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  getDashboard(@CurrentUser() user: typeof adminUserExample) {
    return {
      message: 'Admin dashboard access granted.',
      user,
    };
  }

  @Post('wood-types')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Create a wood type' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      example: {
        name: 'Oak',
        image: '/images/oak.png',
        order: 0,
        isActive: true,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Wood type created.',
    content: okObject(woodTypeExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  createWoodType(@Body() createWoodTypeDto: CreateWoodTypeDto) {
    return this.cmsService.createWoodType(createWoodTypeDto);
  }

  @Patch('wood-types/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update a wood type' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        name: 'Oak',
        order: 1,
      },
    },
  })
  @ApiOkResponse({
    description: 'Wood type updated.',
    content: okObject(woodTypeExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateWoodType(
    @Param('id') id: string,
    @Body() updateWoodTypeDto: UpdateWoodTypeDto,
  ) {
    return this.cmsService.updateWoodType(id, updateWoodTypeDto);
  }

  @Delete('wood-types/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Delete a wood type' })
  @ApiOkResponse({
    description: 'Wood type deleted.',
    content: messageResponse('Wood type deleted successfully.'),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteWoodType(@Param('id') id: string) {
    return this.cmsService.deleteWoodType(id);
  }

  @Post('wood-types/:woodTypeId/characteristics')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Create a wood characteristic' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['text', 'isPositive'],
      example: {
        text: 'High density and strong grain structure',
        isPositive: true,
        order: 0,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Characteristic created.',
    content: okObject(woodCharacteristicExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  createCharacteristic(
    @Param('woodTypeId') woodTypeId: string,
    @Body() createCharacteristicDto: CreateCharacteristicDto,
  ) {
    return this.cmsService.createCharacteristic(
      woodTypeId,
      createCharacteristicDto,
    );
  }

  @Patch('characteristics/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update a wood characteristic' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        text: 'Selected and kiln-dried',
      },
    },
  })
  @ApiOkResponse({
    description: 'Characteristic updated.',
    content: okObject({
      ...woodCharacteristicExample,
      text: 'Selected and kiln-dried',
    }),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateCharacteristic(
    @Param('id') id: string,
    @Body() updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return this.cmsService.updateCharacteristic(id, updateCharacteristicDto);
  }

  @Delete('characteristics/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Delete a wood characteristic' })
  @ApiOkResponse({
    description: 'Characteristic deleted.',
    content: messageResponse('Characteristic deleted successfully.'),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteCharacteristic(@Param('id') id: string) {
    return this.cmsService.deleteCharacteristic(id);
  }

  @Post('wood-types/:woodTypeId/pricing/groups')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Create a price group' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['height', 'thickness', 'pricePerM3'],
      example: {
        height: 120,
        thickness: 45,
        pricePerM3: 14500,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Price group created.',
    content: okObject(woodPriceGroupExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  createPriceGroup(
    @Param('woodTypeId') woodTypeId: string,
    @Body() createPriceGroupDto: CreatePriceGroupDto,
  ) {
    return this.cmsService.createPriceGroup(woodTypeId, createPriceGroupDto);
  }

  @Patch('pricing/groups/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update a price group' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        pricePerM3: 15000,
      },
    },
  })
  @ApiOkResponse({
    description: 'Price group updated.',
    content: okObject({ ...woodPriceGroupExample, pricePerM3: '15000.00' }),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  updatePriceGroup(
    @Param('id') id: string,
    @Body() updatePriceGroupDto: UpdatePriceGroupDto,
  ) {
    return this.cmsService.updatePriceGroup(id, updatePriceGroupDto);
  }

  @Delete('pricing/groups/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Delete a price group' })
  @ApiOkResponse({
    description: 'Price group deleted.',
    content: messageResponse('Price group deleted successfully.'),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  deletePriceGroup(@Param('id') id: string) {
    return this.cmsService.deletePriceGroup(id);
  }

  @Post('pricing/groups/:groupId/variants')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Create a price variant' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['length', 'volumeM3', 'pricePerPiece'],
      example: {
        length: 600,
        volumeM3: 0.024,
        pricePerPiece: 240,
        order: 0,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Price variant created.',
    content: okObject(woodPriceVariantExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  createPriceVariant(
    @Param('groupId') groupId: string,
    @Body() createPriceVariantDto: CreatePriceVariantDto,
  ) {
    return this.cmsService.createPriceVariant(groupId, createPriceVariantDto);
  }

  @Patch('pricing/variants/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update a price variant' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        pricePerPiece: 250,
      },
    },
  })
  @ApiOkResponse({
    description: 'Price variant updated.',
    content: okObject({ ...woodPriceVariantExample, pricePerPiece: '250.00' }),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  updatePriceVariant(
    @Param('id') id: string,
    @Body() updatePriceVariantDto: UpdatePriceVariantDto,
  ) {
    return this.cmsService.updatePriceVariant(id, updatePriceVariantDto);
  }

  @Delete('pricing/variants/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Delete a price variant' })
  @ApiOkResponse({
    description: 'Price variant deleted.',
    content: messageResponse('Price variant deleted successfully.'),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  deletePriceVariant(@Param('id') id: string) {
    return this.cmsService.deletePriceVariant(id);
  }

  @Post('product-photos')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Create a product photo record' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      example: {
        image: '/uploads/1719576000000-oak-board.jpg',
        order: 0,
        isActive: true,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Product photo created.',
    content: okObject(productPhotoExample),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  createProductPhoto(@Body() createProductPhotoDto: CreateProductPhotoDto) {
    return this.cmsService.createProductPhoto(createProductPhotoDto);
  }

  @Patch('product-photos/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update a product photo record' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        isActive: false,
      },
    },
  })
  @ApiOkResponse({
    description: 'Product photo updated.',
    content: okObject({ ...productPhotoExample, order: 1, isActive: false }),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateProductPhoto(
    @Param('id') id: string,
    @Body() updateProductPhotoDto: UpdateProductPhotoDto,
  ) {
    return this.cmsService.updateProductPhoto(id, updateProductPhotoDto);
  }

  @Delete('product-photos/:id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Delete a product photo record' })
  @ApiOkResponse({
    description: 'Product photo deleted.',
    content: messageResponse('Product photo deleted successfully.'),
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteProductPhoto(@Param('id') id: string) {
    return this.cmsService.deleteProductPhoto(id);
  }

  @Post('upload')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a single image file. The response returns the public uploads URL.',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      example: {
        file: 'binary file upload',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Image uploaded successfully.',
    content: okObject({ url: '/uploads/1719320000000-image.png' }),
  })
  @ApiBadRequestResponse({
    description: 'Only image files are allowed or file is missing.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @ApiForbiddenResponse({ description: 'Admin access required.' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          // sanitize and create a unique filename for uploaded images
          const fileExtension = extname(file.originalname);
          const safeName = file.originalname
            .replace(fileExtension, '')
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();

          const uniqueName = `${Date.now()}-${safeName}${fileExtension}`;

          callback(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, callback) => {
        // only accept image mime types
        if (!file.mimetype.startsWith('image/')) {
          callback(
            new BadRequestException('Only image files are allowed.'),
            false,
          );
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
