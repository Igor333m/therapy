import 'dotenv/config'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { AppDataSource } from './data-source'
import { BlogPost, FaqEntry, Service, TherapistProfile, User } from './entities'

const therapistFixtures = [
  {
    email: 'mila.petrovic+seed@therapy.local',
    displayName: 'Mila Petrovic',
    slug: 'mila-petrovic',
    bio:
      'Integrative therapist focused on anxiety support for expats and international students adjusting to new countries.',
    countryCodes: ['RS', 'DE'],
    languageCodes: ['sr', 'en'],
    serviceSlugs: ['individual', 'coping-with-move'] as const,
    yearsExperience: 8,
    sessionPriceUsdCents: 8500,
    timezone: 'Europe/Belgrade'
  },
  {
    email: 'stefan.markovic+seed@therapy.local',
    displayName: 'Stefan Markovic',
    slug: 'stefan-markovic',
    bio:
      'Works with couples navigating relocation pressure, long-distance transitions, and bicultural communication stress.',
    countryCodes: ['RS', 'AT'],
    languageCodes: ['sr', 'en'],
    serviceSlugs: ['couples', 'individual'] as const,
    yearsExperience: 11,
    sessionPriceUsdCents: 9800,
    timezone: 'Europe/Vienna'
  },
  {
    email: 'ana.jovanovic+seed@therapy.local',
    displayName: 'Ana Jovanovic',
    slug: 'ana-jovanovic',
    bio:
      'Adolescent specialist supporting teens and parents through school transitions, identity changes, and migration stress.',
    countryCodes: ['US', 'DE'],
    languageCodes: ['en', 'sr'],
    serviceSlugs: ['teen', 'individual'] as const,
    yearsExperience: 6,
    sessionPriceUsdCents: 7900,
    timezone: 'America/New_York'
  },
  {
    email: 'nikola.ilic+seed@therapy.local',
    displayName: 'Nikola Ilic',
    slug: 'nikola-ilic',
    bio:
      'Helps clients build routines and emotional stability after cross-border moves and high-pressure work changes.',
    countryCodes: ['DE', 'AT', 'US'],
    languageCodes: ['en'],
    serviceSlugs: ['coping-with-move', 'individual'] as const,
    yearsExperience: 9,
    sessionPriceUsdCents: 9200,
    timezone: 'Europe/Berlin'
  }
]

const faqFixtures = {
  en: [
    {
      sortOrder: 1,
      question: 'Do I need an account to browse therapists?',
      answer:
        'No. Public discovery is available without sign-in. You only need an account to send inquiries or booking requests.'
    },
    {
      sortOrder: 2,
      question: 'How are therapists shown in search selected?',
      answer:
        'Only approved therapists are listed publicly. Filters by country, language, and service are applied on top of approval.'
    },
    {
      sortOrder: 3,
      question: 'Can one therapist serve multiple countries?',
      answer:
        'Yes. Therapists can define multiple country service areas and appear in each matching country filter.'
    },
    {
      sortOrder: 4,
      question: 'Which languages are supported at launch?',
      answer: 'The MVP launches with English and Serbian for routing, catalog labels, and core public pages.'
    }
  ],
  sr: [
    {
      sortOrder: 1,
      question: 'Da li mi je nalog potreban za pretragu terapeuta?',
      answer:
        'Ne. Javna pretraga je dostupna bez prijave. Nalog je potreban tek za slanje upita ili zahteva za termin.'
    },
    {
      sortOrder: 2,
      question: 'Kako se biraju terapeuti koji su prikazani u pretrazi?',
      answer:
        'Javno su vidljivi samo odobreni terapeuti. Posle toga se primenjuju filteri za drzavu, jezik i uslugu.'
    },
    {
      sortOrder: 3,
      question: 'Da li jedan terapeut moze raditi u vise drzava?',
      answer:
        'Da. Terapeuti mogu definisati vise drzava i bice prikazani u svakoj drzavi koja odgovara filteru.'
    },
    {
      sortOrder: 4,
      question: 'Koji jezici su podrzani u prvoj verziji?',
      answer: 'MVP je pokrenut sa engleskim i srpskim jezikom za rute, katalog usluga i glavne javne stranice.'
    }
  ]
} as const

const blogFixtures = [
  {
    locale: 'en' as const,
    slug: 'en-building-therapy-routines-after-relocation',
    title: 'Building Therapy Routines After Relocation',
    content: [
      'Relocation often disrupts sleep, social support, and familiar coping habits. Start with one weekly check-in routine and a short reflection ritual after each session.',
      'In cross-border transitions, consistency matters more than intensity. Keep goals small, observable, and revisited every two weeks.'
    ]
  },
  {
    locale: 'en' as const,
    slug: 'en-couples-counseling-during-country-transitions',
    title: 'Couples Counseling During Country Transitions',
    content: [
      'Country transitions can amplify old conflict loops. Good couples work starts by mapping practical stressors: visas, housing, childcare, and career uncertainty.',
      'When logistics are named clearly, emotional patterns are easier to regulate and discuss.'
    ]
  },
  {
    locale: 'en' as const,
    slug: 'en-supporting-teens-in-new-school-systems',
    title: 'Supporting Teens in New School Systems',
    content: [
      'Teens entering a new school system often face identity and belonging pressure. Parents can help by balancing structure with autonomy.',
      'Therapy can provide language for social anxiety, grief, and adaptation while preserving family trust.'
    ]
  },
  {
    locale: 'sr' as const,
    slug: 'sr-rutine-u-terapiji-posle-preseljenja',
    title: 'Rutine u terapiji posle preseljenja',
    content: [
      'Preseljenje cesto narusava san, mrezu podrske i svakodnevne navike. Korisno je da uvedete jedan nedeljni ritual pracenja stanja i kratku refleksiju posle svake seanse.',
      'U periodu adaptacije doslednost je vaznija od intenziteta.'
    ]
  },
  {
    locale: 'sr' as const,
    slug: 'sr-partnerska-terapija-u-vreme-promene-drzave',
    title: 'Partnerska terapija u vreme promene drzave',
    content: [
      'Promena drzave moze pojacati stare obrasce konflikta. Korisno je prvo imenovati prakticne izvore stresa: dokumenta, stanovanje, posao i organizaciju porodice.',
      'Kada je logistika jasna, lakse je razgovarati o emocijama.'
    ]
  },
  {
    locale: 'sr' as const,
    slug: 'sr-podrska-tinejdzerima-u-novom-skolskom-sistemu',
    title: 'Podrska tinejdzerima u novom skolskom sistemu',
    content: [
      'Tinejdzeri u novom skolskom okruzenju cesto prolaze kroz pritisak pripadanja i promene identiteta. Roditeljima pomaze ravnoteza izmedju jasne strukture i autonomije.',
      'Terapija moze pomoci u razumevanju anksioznosti, tuge i procesa adaptacije.'
    ]
  }
] as const

async function seed(): Promise<void> {
  await AppDataSource.initialize()

  const serviceRepo = AppDataSource.getRepository(Service)
  const userRepo = AppDataSource.getRepository(User)
  const therapistProfileRepo = AppDataSource.getRepository(TherapistProfile)
  const faqRepo = AppDataSource.getRepository(FaqEntry)
  const blogRepo = AppDataSource.getRepository(BlogPost)

  const services = [
    {
      slug: 'individual' as const,
      labelEn: 'Individual Therapy',
      labelSr: 'Individualna terapija'
    },
    {
      slug: 'couples' as const,
      labelEn: 'Couples Therapy',
      labelSr: 'Partnerska terapija'
    },
    {
      slug: 'teen' as const,
      labelEn: 'Teen Therapy',
      labelSr: 'Terapija za tinejdzere'
    },
    {
      slug: 'coping-with-move' as const,
      labelEn: 'Coping With Moving Countries',
      labelSr: 'Suočavanje sa preseljenjem u drugu zemlju'
    }
  ]

  for (const item of services) {
    const exists = await serviceRepo.existsBy({ slug: item.slug })
    if (!exists) {
      await serviceRepo.save(serviceRepo.create({ ...item, active: true }))
    }
  }

  const moderatorEmail = process.env.SEED_MODERATOR_EMAIL
  const moderatorPassword = process.env.SEED_MODERATOR_PASSWORD

  if (!moderatorEmail || !moderatorPassword) {
  throw new Error('SEED_MODERATOR_EMAIL and SEED_MODERATOR_PASSWORD are required to initialize moderator')
}

  const hasModerator = await userRepo.existsBy({ email: moderatorEmail })
  let moderator = await userRepo.findOneBy({ email: moderatorEmail })

  if (!hasModerator) {
    const passwordHash = await hash(moderatorPassword, 12)

    moderator = await userRepo.save(
      userRepo.create({
        id: randomUUID(),
        email: moderatorEmail,
        passwordHash,
        role: 'moderator',
        emailVerified: true,
        emailVerificationToken: null,
        refreshTokenHash: null
      })
    )
  }

  const serviceList = await serviceRepo.findBy({ active: true })
  const serviceMap = new Map(serviceList.map((service) => [service.slug, service]))

  const therapistPasswordHash = await hash('TherapySeed!234', 12)

  for (const fixture of therapistFixtures) {
    let therapistUser = await userRepo.findOneBy({ email: fixture.email })

    if (!therapistUser) {
      therapistUser = await userRepo.save(
        userRepo.create({
          id: randomUUID(),
          email: fixture.email,
          passwordHash: therapistPasswordHash,
          role: 'therapist',
          emailVerified: true,
          emailVerificationToken: null,
          refreshTokenHash: null
        })
      )
    }

    const linkedServices = fixture.serviceSlugs
      .map((slug) => serviceMap.get(slug))
      .filter((service): service is Service => Boolean(service))

    const existingProfileByUser = await therapistProfileRepo.findOne({
      where: { userId: therapistUser.id },
      relations: { services: true }
    })

    const existingProfileBySlug = await therapistProfileRepo.findOne({
      where: { slug: fixture.slug },
      relations: { services: true }
    })

    const profile = existingProfileByUser ?? existingProfileBySlug

    if (profile) {
      profile.slug = fixture.slug
      profile.userId = therapistUser.id
      profile.displayName = fixture.displayName
      profile.bio = fixture.bio
      profile.avatarUrl = null
      profile.verificationStatus = 'approved'
      profile.verifiedAt = new Date()
      profile.verifiedById = moderator?.id ?? null
      profile.countryCodes = fixture.countryCodes
      profile.languageCodes = fixture.languageCodes
      profile.yearsExperience = fixture.yearsExperience
      profile.sessionPriceUsdCents = fixture.sessionPriceUsdCents
      profile.timezone = fixture.timezone
      profile.services = linkedServices
      await therapistProfileRepo.save(profile)
    } else {
      await therapistProfileRepo.save(
        therapistProfileRepo.create({
          slug: fixture.slug,
          userId: therapistUser.id,
          displayName: fixture.displayName,
          bio: fixture.bio,
          avatarUrl: null,
          verificationStatus: 'approved',
          verifiedAt: new Date(),
          verifiedById: moderator?.id ?? null,
          countryCodes: fixture.countryCodes,
          languageCodes: fixture.languageCodes,
          yearsExperience: fixture.yearsExperience,
          sessionPriceUsdCents: fixture.sessionPriceUsdCents,
          timezone: fixture.timezone,
          services: linkedServices
        })
      )
    }
  }

  for (const locale of Object.keys(faqFixtures) as Array<keyof typeof faqFixtures>) {
    for (const fixture of faqFixtures[locale]) {
      const existing = await faqRepo.findOneBy({ locale, sortOrder: fixture.sortOrder })

      if (existing) {
        existing.question = fixture.question
        existing.answer = fixture.answer
        existing.published = true
        await faqRepo.save(existing)
      } else {
        await faqRepo.save(
          faqRepo.create({
            question: fixture.question,
            answer: fixture.answer,
            locale,
            sortOrder: fixture.sortOrder,
            published: true
          })
        )
      }
    }
  }

  for (const fixture of blogFixtures) {
    const existing = await blogRepo.findOneBy({ slug: fixture.slug })

    if (existing) {
      existing.title = fixture.title
      existing.content = [...fixture.content]
      existing.locale = fixture.locale
      existing.status = 'published'
      existing.authorId = moderator?.id ?? null
      existing.publishedAt = existing.publishedAt ?? new Date()
      await blogRepo.save(existing)
    } else {
      await blogRepo.save(
        blogRepo.create({
          title: fixture.title,
          slug: fixture.slug,
          content: [...fixture.content],
          locale: fixture.locale,
          status: 'published',
          authorId: moderator?.id ?? null,
          publishedAt: new Date()
        })
      )
    }
  }

  await AppDataSource.destroy()
}

seed()
  .then(() => {
    process.stdout.write('Seed completed successfully\n')
  })
  .catch(async (error) => {
    process.stderr.write(`Seed failed: ${String(error)}\n`)

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }

    process.exitCode = 1
  })
