import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    serviceId: string;

    @Column()
    serviceName: string;

    @Column()
    servicePath: string;

    // 1 for username
    // 2 for email
    // 4 for phone
    @Column({ default: 7 })
    privilegeKeys: number;
}
