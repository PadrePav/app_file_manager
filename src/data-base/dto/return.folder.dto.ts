import {Folder} from "../entity/folder.entity";
import {File} from "../entity/file.entity";

class ReturnFolderDto {
  folderId: string
  folders: Folder[];
  files: File[];
}

export class PathParentFolderDto {
  path: string;
  folderName: string;
}

export default ReturnFolderDto