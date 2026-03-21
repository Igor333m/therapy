import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common'
import { PublicService } from './public.service'
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto'
import { PublicLocaleQueryDto } from './dto/public-locale-query.dto'
import { PublicTherapistQueryDto } from './dto/public-therapist-query.dto'

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('services')
  listServices(@Query() query: PublicLocaleQueryDto) {
    return this.publicService.listServices(query)
  }

  @Get('therapists')
  listTherapists(@Query() query: PublicTherapistQueryDto) {
    return this.publicService.listTherapists(query)
  }

  @Get('therapists/:slug')
  getTherapist(@Param('slug') slug: string, @Query() query: PublicLocaleQueryDto) {
    return this.publicService.getTherapist(slug, query)
  }

  @Get('blog')
  listBlogPosts(@Query() query: PublicLocaleQueryDto) {
    return this.publicService.listBlogPosts(query)
  }

  @Get('blog/:slug')
  getBlogPost(@Param('slug') slug: string, @Query() query: PublicLocaleQueryDto) {
    return this.publicService.getBlogPost(slug, query)
  }

  @Get('faq')
  listFaqEntries(@Query() query: PublicLocaleQueryDto) {
    return this.publicService.listFaqEntries(query)
  }

  @Post('contact-inquiries')
  @HttpCode(201)
  createContactInquiry(@Body() dto: CreateContactInquiryDto) {
    return this.publicService.createContactInquiry(dto)
  }
}