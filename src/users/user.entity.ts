import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    passwordHash: string;
  
    @Column({ length: 20 })
    nickname: string;
  
    @Column({ length: 4 })
    tag: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }