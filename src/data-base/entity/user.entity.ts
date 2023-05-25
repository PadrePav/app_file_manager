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
  userName: string;

  @Column({nullable: false})
  password: string;

  @CreateDateColumn({nullable: false})
  created: Date

  @OneToOne(() => Folder, {cascade: true})
  @JoinColumn()
  rootFolder: Folder;

}