import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { AppLocale, CoreService } from '@therapy/shared'
import { Repository } from 'typeorm'
import { BlogPost, ContactInquiry, FaqEntry, Service, TherapistProfile } from '../database/entities'
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto'
import type { PublicLocaleQueryDto } from './dto/public-locale-query.dto'
import type { PublicTherapistQueryDto } from './dto/public-therapist-query.dto'

type PublicServiceResponse = {
  slug: CoreService
  label: string
}

type PublicTherapistResponse = {
  slug: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  countryCodes: string[]
  languageCodes: string[]
  yearsExperience: number | null
  sessionPriceUsdCents: number | null
  timezone: string | null
  services: PublicServiceResponse[]
}

type PublicBlogPostResponse = {
  slug: string
  title: string
  content: string[]
  locale: AppLocale
  publishedAt: Date | null
}

type PublicFaqResponse = {
  id: string
  question: string
  answer: string
  locale: AppLocale
  sortOrder: number
}

type CreateContactInquiryResponse = {
  inquiryId: string
  status: 'new'
}

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(TherapistProfile)
    private readonly therapistProfileRepo: Repository<TherapistProfile>,
    @InjectRepository(BlogPost)
    private readonly blogPostRepo: Repository<BlogPost>,
    @InjectRepository(FaqEntry)
    private readonly faqRepo: Repository<FaqEntry>,
    @InjectRepository(ContactInquiry)
    private readonly inquiryRepo: Repository<ContactInquiry>
  ) {}

  async listServices(query: PublicLocaleQueryDto): Promise<PublicServiceResponse[]> {
    const locale = query.locale ?? 'en'
    const services = await this.serviceRepo.find({
      where: { active: true },
      order: { slug: 'ASC' }
    })

    return services.map((service) => this.mapService(service, locale))
  }

  async listTherapists(query: PublicTherapistQueryDto): Promise<PublicTherapistResponse[]> {
    const locale = query.locale ?? 'en'
    const therapistQuery = this.therapistProfileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.services', 'service')
      .where('profile.verificationStatus = :status', { status: 'approved' })
      .distinct(true)
      .orderBy('profile.displayName', 'ASC')

    if (query.countryCode) {
      therapistQuery.andWhere(':countryCode = ANY(profile.countryCodes)', {
        countryCode: query.countryCode
      })
    }

    if (query.languageCode) {
      therapistQuery.andWhere(':languageCode = ANY(profile.languageCodes)', {
        languageCode: query.languageCode
      })
    }

    if (query.services?.length) {
      therapistQuery.andWhere('service.slug IN (:...serviceSlugs)', {
        serviceSlugs: query.services
      })
    }

    const profiles = await therapistQuery.getMany()

    return profiles.map((profile) => this.mapTherapist(profile, locale))
  }

  async getTherapist(slug: string, query: PublicLocaleQueryDto): Promise<PublicTherapistResponse> {
    const locale = query.locale ?? 'en'
    const profile = await this.therapistProfileRepo.findOne({
      where: { slug, verificationStatus: 'approved' },
      relations: { services: true }
    })

    if (!profile) {
      throw new NotFoundException('Therapist not found')
    }

    return this.mapTherapist(profile, locale)
  }

  async listBlogPosts(query: PublicLocaleQueryDto): Promise<PublicBlogPostResponse[]> {
    const locale = query.locale ?? 'en'
    const posts = await this.blogPostRepo.find({
      where: { locale, status: 'published' },
      order: { publishedAt: 'DESC', createdAt: 'DESC' }
    })

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      content: post.content,
      locale: post.locale,
      publishedAt: post.publishedAt
    }))
  }

  async getBlogPost(slug: string, query: PublicLocaleQueryDto): Promise<PublicBlogPostResponse> {
    const locale = query.locale ?? 'en'
    const post = await this.blogPostRepo.findOne({
      where: { slug, locale, status: 'published' }
    })

    if (!post) {
      throw new NotFoundException('Blog post not found')
    }

    return {
      slug: post.slug,
      title: post.title,
      content: post.content,
      locale: post.locale,
      publishedAt: post.publishedAt
    }
  }

  async listFaqEntries(query: PublicLocaleQueryDto): Promise<PublicFaqResponse[]> {
    const locale = query.locale ?? 'en'
    const entries = await this.faqRepo.find({
      where: { locale, published: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' }
    })

    return entries.map((entry) => ({
      id: entry.id,
      question: entry.question,
      answer: entry.answer,
      locale: entry.locale,
      sortOrder: entry.sortOrder
    }))
  }

  async createContactInquiry(dto: CreateContactInquiryDto): Promise<CreateContactInquiryResponse> {
    let therapistId: string | null = null

    if (dto.therapistSlug) {
      const therapistProfile = await this.therapistProfileRepo.findOne({
        where: {
          slug: dto.therapistSlug,
          verificationStatus: 'approved'
        }
      })

      therapistId = therapistProfile?.userId ?? null
    }

    const inquiry = await this.inquiryRepo.save(
      this.inquiryRepo.create({
        name: dto.name,
        email: dto.email,
        message: dto.message,
        locale: dto.locale,
        therapistId,
        userId: null,
        status: 'new'
      })
    )

    return {
      inquiryId: inquiry.id,
      status: 'new'
    }
  }

  private mapTherapist(profile: TherapistProfile, locale: AppLocale): PublicTherapistResponse {
    return {
      slug: profile.slug,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      countryCodes: profile.countryCodes,
      languageCodes: profile.languageCodes,
      yearsExperience: profile.yearsExperience,
      sessionPriceUsdCents: profile.sessionPriceUsdCents,
      timezone: profile.timezone,
      services: (profile.services ?? []).map((service) => this.mapService(service, locale))
    }
  }

  private mapService(service: Service, locale: AppLocale): PublicServiceResponse {
    return {
      slug: service.slug,
      label: locale === 'sr' ? service.labelSr : service.labelEn
    }
  }
}