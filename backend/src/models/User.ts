import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ nullable: true })
    username: string;

    // Password is hashed
    @Column({ nullable: true })
    password: string;

    @Index({ unique: true })
    @Column({ nullable: true })
    email: string;

    @Index({ unique: true })
    @Column({ nullable: true })
    phone: string;

    // Available
    @Column({ default: true })
    available: boolean;

    // register time
    @CreateDateColumn()
    createDate: Date;

    // last login time
    @Column()
    lastLoginDate: Date;
}
