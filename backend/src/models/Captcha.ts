import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Captcha {
    @PrimaryGeneratedColumn()
    id: number;

    // The captcha string
    @Column()
    captcha: string;

    // type 0 for phone, 1 for email
    @Index()
    @Column()
    type: number;

    // The phone number or email address
    @Index()
    @Column()
    target: string;

    // expired time
    @Column()
    expired: Date;

    // created time
    @CreateDateColumn()
    createDate: Date;

    // comsumed
    @Column({ default: false })
    consumed: boolean;

    // Try times
    @Column({ default: 0 })
    tryTimes: number;

    // ip
    @Column()
    ip: string;

    // ua
    @Column()
    ua: string;
}