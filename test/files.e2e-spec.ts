import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import AuthSignupDto from "../src/auth/dto/authSignupDto";
import * as request from "supertest";
import * as path from "path";

describe('Files manipulation', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  let token: string;
  let parentFolderId: string;
  const userName: string = 'test';
  let createdFileId: string;

  it('Get jwt token and parent folder id', async () => {
    const dto: AuthSignupDto = {
      userName,
      password: 'testPassword'
    };
    const userData = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(dto)
      .expect(200)
    token = JSON.parse(userData.text).token

    const folderData = await request(app.getHttpServer())
      .get(`/user/root`)
      .query({userName})
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    parentFolderId = JSON.parse(folderData.text).id
  });

  describe('Upload file', () => {
    it('should upload a file', async () => {
      const fileData = await request(app.getHttpServer())
        .post('/file/upload')
        .query({userName, parentFolderId})
        .attach('file', path.resolve() + '\\test\\test.txt')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
      createdFileId = JSON.parse(fileData.text).id
      console.log(JSON.parse(fileData.text))
      console.log(JSON.parse(fileData.text))
    });

    it('should error when loading a file (file already exists in this folder)', () => {
      return request(app.getHttpServer())
        .post('/file/upload')
        .query({userName, parentFolderId})
        .attach('file', path.resolve() + '\\test\\test.txt')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  it('the file should be deleted by the ID', () => {
    return request(app.getHttpServer())
      .delete(`/file/${createdFileId}`)
      .query({userName})
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  })
});