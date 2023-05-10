import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {File} from "./file.entity";

@Entity()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  name: string;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => Folder, (folder) => folder.folders)
  parent_folder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parent_folder)
  folders: Folder[];

  @OneToMany(() => File, file => file.parent_folder, {cascade: true})
  @JoinColumn()
  files: File[];
}