import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {Folder} from "./folder.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint'
  })
  id: number;

  @Column({nullable: false, unique: true})
  name: string;

  @Column({nullable: false})
  password: string;

  @CreateDateColumn()
  created: Date

  @OneToOne(() => Folder, {cascade: true})
  @JoinColumn()
  space: Folder;
}