import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTherapistSlug1710800000000 implements MigrationInterface {
  name = 'AddTherapistSlug1710800000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS slug varchar(160)`)

    await queryRunner.query(`
      UPDATE therapist_profiles
      SET slug = CONCAT(
        LEFT(
          TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(display_name), '[^a-z0-9]+', '-', 'g')),
          120
        ),
        '-',
        LEFT(REPLACE(id::text, '-', ''), 8)
      )
      WHERE slug IS NULL
    `)

    await queryRunner.query(`ALTER TABLE therapist_profiles ALTER COLUMN slug SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE therapist_profiles ADD CONSTRAINT uq_therapist_profiles_slug UNIQUE (slug)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE therapist_profiles DROP CONSTRAINT IF EXISTS uq_therapist_profiles_slug`)
    await queryRunner.query(`ALTER TABLE therapist_profiles DROP COLUMN IF EXISTS slug`)
  }
}