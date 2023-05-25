import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Folder} from "./folder.entity";
import {User} from "./user.entity";

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  uid: string;

  @Column({nullable: false})
  type: string;

  @Column()
  size: number;

  @CreateDateColumn()
  created: Date;

  @Column()
  path: string

  @ManyToOne(() => Folder, folder => folder.files)
  parent_folder: Folder

  @ManyToOne(() => User, {cascade: true})
  owner: User
}