import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import type { TherapistProfile } from './therapist-profile.entity'

export type ServiceSlug =
  | 'individual'
  | 'couples'
  | 'teen'
  | 'coping-with-move'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 60 })
  slug: ServiceSlug

  @Column({ name: 'label_en', length: 120 })
  labelEn: string

  @Column({ name: 'label_sr', length: 120 })
  labelSr: string

  @Column({ default: true })
  active: boolean

  @ManyToMany('TherapistProfile', 'services')
  @JoinTable({
    name: 'therapist_service_offerings',
    joinColumn: { name: 'service_id' },
    inverseJoinColumn: { name: 'therapist_profile_id' }
  })
  therapistProfiles: TherapistProfile[]
}
