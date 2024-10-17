import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// CAS Ticket
@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ticket: string;

    @Column()
    userid: number;

    @Column({ nullable: true })
    serviceId: string;

    @Column()
    created: Date;

    @Column({ nullable: true })
    consumed: Date;

    @Column()
    expired: Date;

    @Column({ nullable: true })
    ticketGrantingTicket: string;

    // ip
    @Column()
    ip: string;

    // User-Agent
    @Column()
    ua: string;
}
