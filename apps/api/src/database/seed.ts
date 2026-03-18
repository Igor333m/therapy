import 'dotenv/config'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { AppDataSource } from './data-source'
import { Service, User } from './entities'

async function seed(): Promise<void> {
  await AppDataSource.initialize()

  const serviceRepo = AppDataSource.getRepository(Service)
  const userRepo = AppDataSource.getRepository(User)

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

  if (!moderatorPassword) {
  throw new Error('SEED_MODERATOR_PASSWORD is required to initialize moderator')
}

  const hasModerator = await userRepo.existsBy({ email: moderatorEmail })
  if (!hasModerator) {
    // REVIEW: Can we use auth service register?
    const passwordHash = await hash(moderatorPassword, 12)

    await userRepo.save(
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
