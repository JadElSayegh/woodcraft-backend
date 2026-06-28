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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('homepage')
  getHomepage() {
    return this.cmsService.getHomepage();
  }
  @Patch('homepage')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateHomepage(@Body() updateHomepageDto: UpdateHomepageDto) {
    return this.cmsService.updateHomepage(updateHomepageDto);
  }

  @Get('text-sections')
  getTextSections() {
    return this.cmsService.getTextSections();
  }

  @Get('wood-types')
  getWoodTypes() {
    return this.cmsService.getWoodTypes();
  }

  @Get('product-photos')
  getProductPhotos() {
    return this.cmsService.getProductPhotos();
  }

  @Get('pricing')
  getPricing() {
    return this.cmsService.getPricing();
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getDashboard(@CurrentUser() user: any) {
    return {
      message: 'Admin dashboard access granted.',
      user,
    };
  }
  @Post('wood-types')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createWoodType(@Body() createWoodTypeDto: CreateWoodTypeDto) {
    return this.cmsService.createWoodType(createWoodTypeDto);
  }

  @Patch('wood-types/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateWoodType(
    @Param('id') id: string,
    @Body() updateWoodTypeDto: UpdateWoodTypeDto,
  ) {
    return this.cmsService.updateWoodType(id, updateWoodTypeDto);
  }

  @Delete('wood-types/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteWoodType(@Param('id') id: string) {
    return this.cmsService.deleteWoodType(id);
  }

  @Post('wood-types/:woodTypeId/characteristics')
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateCharacteristic(
    @Param('id') id: string,
    @Body() updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return this.cmsService.updateCharacteristic(id, updateCharacteristicDto);
  }

  @Delete('characteristics/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteCharacteristic(@Param('id') id: string) {
    return this.cmsService.deleteCharacteristic(id);
  }
  @Post('wood-types/:woodTypeId/pricing/groups')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createPriceGroup(
    @Param('woodTypeId') woodTypeId: string,
    @Body() createPriceGroupDto: CreatePriceGroupDto,
  ) {
    return this.cmsService.createPriceGroup(woodTypeId, createPriceGroupDto);
  }

  @Patch('pricing/groups/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updatePriceGroup(
    @Param('id') id: string,
    @Body() updatePriceGroupDto: UpdatePriceGroupDto,
  ) {
    return this.cmsService.updatePriceGroup(id, updatePriceGroupDto);
  }

  @Delete('pricing/groups/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deletePriceGroup(@Param('id') id: string) {
    return this.cmsService.deletePriceGroup(id);
  }

  @Post('pricing/groups/:groupId/variants')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createPriceVariant(
    @Param('groupId') groupId: string,
    @Body() createPriceVariantDto: CreatePriceVariantDto,
  ) {
    return this.cmsService.createPriceVariant(groupId, createPriceVariantDto);
  }

  @Patch('pricing/variants/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updatePriceVariant(
    @Param('id') id: string,
    @Body() updatePriceVariantDto: UpdatePriceVariantDto,
  ) {
    return this.cmsService.updatePriceVariant(id, updatePriceVariantDto);
  }

  @Delete('pricing/variants/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deletePriceVariant(@Param('id') id: string) {
    return this.cmsService.deletePriceVariant(id);
  }
  @Post('product-photos')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createProductPhoto(@Body() createProductPhotoDto: CreateProductPhotoDto) {
    return this.cmsService.createProductPhoto(createProductPhotoDto);
  }

  @Patch('product-photos/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateProductPhoto(
    @Param('id') id: string,
    @Body() updateProductPhotoDto: UpdateProductPhotoDto,
  ) {
    return this.cmsService.updateProductPhoto(id, updateProductPhotoDto);
  }

  @Delete('product-photos/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteProductPhoto(@Param('id') id: string) {
    return this.cmsService.deleteProductPhoto(id);
  }
  @Post('upload')
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
