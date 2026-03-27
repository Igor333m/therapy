import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1710500000000 implements MigrationInterface {
  name = 'InitSchema1710500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        email varchar(320) NOT NULL UNIQUE,
        password_hash varchar NOT NULL,
        role varchar(20) NOT NULL DEFAULT 'client',
        email_verified boolean NOT NULL DEFAULT false,
        email_verification_token varchar NULL,
        refresh_token_hash varchar NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS therapist_profiles (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid NOT NULL UNIQUE,
        display_name varchar(120) NOT NULL,
        bio text NULL,
        avatar_url varchar(255) NULL,
        verification_status varchar(20) NOT NULL DEFAULT 'pending',
        verified_at timestamptz NULL,
        verified_by_id uuid NULL,
        country_codes text[] NOT NULL DEFAULT '{}',
        language_codes text[] NOT NULL DEFAULT '{}',
        years_experience smallint NULL,
        session_price_usd_cents integer NULL,
        timezone varchar(64) NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_therapist_profiles_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_therapist_profiles_verified_by
          FOREIGN KEY (verified_by_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS services (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        slug varchar(60) NOT NULL UNIQUE,
        label_en varchar(120) NOT NULL,
        label_sr varchar(120) NOT NULL,
        active boolean NOT NULL DEFAULT true
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS therapist_service_offerings (
        service_id uuid NOT NULL,
        therapist_profile_id uuid NOT NULL,
        PRIMARY KEY (service_id, therapist_profile_id),
        CONSTRAINT fk_therapist_service_offerings_service
          FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        CONSTRAINT fk_therapist_service_offerings_profile
          FOREIGN KEY (therapist_profile_id) REFERENCES therapist_profiles(id) ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS availability_rules (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        therapist_id uuid NOT NULL,
        day_of_week smallint NOT NULL,
        start_time varchar(5) NOT NULL,
        end_time varchar(5) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_availability_rules_therapist
          FOREIGN KEY (therapist_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS availability_exceptions (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        therapist_id uuid NOT NULL,
        exception_date date NOT NULL,
        is_available boolean NOT NULL DEFAULT false,
        start_time varchar(5) NULL,
        end_time varchar(5) NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_availability_exceptions_therapist
          FOREIGN KEY (therapist_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS booking_requests (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id uuid NOT NULL,
        therapist_id uuid NOT NULL,
        start_at_utc timestamptz NOT NULL,
        duration_minutes smallint NOT NULL DEFAULT 50,
        status varchar(30) NOT NULL DEFAULT 'pending',
        client_note text NULL,
        therapist_note text NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_booking_requests_client
          FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_booking_requests_therapist
          FOREIGN KEY (therapist_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS session_recordings (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_request_id uuid NOT NULL UNIQUE,
        resource_id varchar(255) NULL,
        sid varchar(255) NULL,
        recording_status varchar(30) NOT NULL DEFAULT 'acquiring',
        s3_key varchar(512) NULL,
        started_at timestamptz NULL,
        stopped_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_session_recordings_booking_request
          FOREIGN KEY (booking_request_id) REFERENCES booking_requests(id) ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS session_transcripts (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_recording_id uuid NOT NULL,
        therapist_id uuid NOT NULL,
        assembly_ai_job_id varchar(100) NULL,
        status varchar(20) NOT NULL DEFAULT 'queued',
        speaker_map text NULL,
        encrypted_transcript text NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_session_transcripts_recording
          FOREIGN KEY (session_recording_id) REFERENCES session_recordings(id) ON DELETE CASCADE,
        CONSTRAINT fk_session_transcripts_therapist
          FOREIGN KEY (therapist_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        author_id uuid NULL,
        title varchar(200) NOT NULL,
        slug varchar(220) NOT NULL UNIQUE,
        content text[] NOT NULL DEFAULT '{}',
        locale varchar(5) NOT NULL DEFAULT 'en',
        status varchar(20) NOT NULL DEFAULT 'draft',
        published_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_blog_posts_author
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS faq_entries (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        question text NOT NULL,
        answer text NOT NULL,
        locale varchar(5) NOT NULL DEFAULT 'en',
        sort_order smallint NOT NULL DEFAULT 0,
        published boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(150) NOT NULL,
        email varchar(320) NOT NULL,
        user_id uuid NULL,
        therapist_id uuid NULL,
        message text NOT NULL,
        locale varchar(5) NOT NULL DEFAULT 'en',
        status varchar(20) NOT NULL DEFAULT 'new',
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS contact_inquiries')
    await queryRunner.query('DROP TABLE IF EXISTS faq_entries')
    await queryRunner.query('DROP TABLE IF EXISTS blog_posts')
    await queryRunner.query('DROP TABLE IF EXISTS session_transcripts')
    await queryRunner.query('DROP TABLE IF EXISTS session_recordings')
    await queryRunner.query('DROP TABLE IF EXISTS booking_requests')
    await queryRunner.query('DROP TABLE IF EXISTS availability_exceptions')
    await queryRunner.query('DROP TABLE IF EXISTS availability_rules')
    await queryRunner.query('DROP TABLE IF EXISTS therapist_service_offerings')
    await queryRunner.query('DROP TABLE IF EXISTS services')
    await queryRunner.query('DROP TABLE IF EXISTS therapist_profiles')
    await queryRunner.query('DROP TABLE IF EXISTS users')
  }
}
