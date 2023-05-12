import {Folder} from "../entity/folder.entity";
import {File} from "../entity/file.entity";

class ReturnFolderDto {
  folders: Folder[];
  files: File[];
}

export default ReturnFolderDto