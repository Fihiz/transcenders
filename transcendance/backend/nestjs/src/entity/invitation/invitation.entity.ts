import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ConversationEntity } from "../conversation/conversation.entity";
import { WebAppUserEntity } from "../webAppUser/webAppUser.entity";


@Entity('t_invitation')
export class InvitationEntity {

  @PrimaryGeneratedColumn({
    type: "int"
  })
  id: number

  @ManyToOne(() => WebAppUserEntity)
  @JoinColumn({name: 'emitter'})
  emitter: WebAppUserEntity['login'];

  @ManyToOne(() => WebAppUserEntity)
  @JoinColumn({name: 'receiver'})
	receiver: WebAppUserEntity['login'];

  @Column({
    type: "varchar",
    nullable: false
  })
  invitation_type: string;

  @OneToOne(() => ConversationEntity, {nullable: true})
  @JoinColumn({name: 'conv_id'})
  room: ConversationEntity['conv_id'];

  @Column({
    type: "timestamp",
  })
  sent: Date;
  
}
