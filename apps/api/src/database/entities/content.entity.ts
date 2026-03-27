import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { AppLocale } from '@therapy/shared'
import type { User } from './user.entity'

export type PublishStatus = 'draft' | 'pending_review' | 'published' | 'archived'

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'author_id', nullable: true, type: 'uuid' })
  authorId: string | null

  @ManyToOne('User', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User | null

  @Column({ length: 200 })
  title: string

  @Column({ unique: true, length: 220 })
  slug: string

  @Column({ type: 'text', array: true, default: [] })
  content: Array<string>

  @Column({ type: 'varchar', length: 5, default: 'en' })
  locale: AppLocale

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: PublishStatus

  @Column({ name: 'published_at', nullable: true, type: 'timestamptz' })
  publishedAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

@Entity('faq_entries')
export class FaqEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  question: string

  @Column({ type: 'text' })
  answer: string

  @Column({ type: 'varchar', length: 5, default: 'en' })
  locale: AppLocale

  @Column({ name: 'sort_order', type: 'smallint', default: 0 })
  sortOrder: number

  @Column({ default: true })
  published: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
