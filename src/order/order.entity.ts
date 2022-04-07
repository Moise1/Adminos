import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity('orders')
export class Order{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Exclude()
    firstName: string;

    @Column()
    @Exclude()
    lastName: string;

    @Column()
    email: string;
    
    @CreateDateColumn()
    createdAt: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[]

    @Expose()
    get name(): string{
        return `${this.firstName} ${this.lastName}`
    };

    @Expose()
    get total(): number {
        return this.orderItems.reduce((
            sum,
            i /* stands for order items  */
            ) => sum + (i.price * i.quantity) , 0)
    }
}