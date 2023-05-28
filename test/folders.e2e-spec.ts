import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import AuthSignupDto from "../src/auth/dto/authSignupDto";
import * as request from "supertest";

describe('Folders manipulation', () => {
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
  let createdFolderId: string;

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

  (describe('Create folder', () => {
    it('should create and return a new folder', async () => {
      const folderData = await request(app.getHttpServer())
        .post(`/folder/create`)
        .query({userName, parentFolderId})
        .set('Authorization', `Bearer ${token}`)
        .send({folderName: 'testName'})
        .expect(201)
      const createdFolder = JSON.parse(folderData.text)
      createdFolderId = createdFolder.id
    });

    it('an error should occur when trying to save the folder' +
      '(folder with this name already exist in this parent folder)', () => {
      return  request(app.getHttpServer())
        .post(`/folder/create`)
        .query({userName, parentFolderId})
        .set('Authorization', `Bearer ${token}`)
        .send({folderName: 'testName'})
        .expect(400)
    });
  }))

  it('should return the folder by its ID', async () => {
    const folderData = await request(app.getHttpServer())
      .get(`/folder/${createdFolderId}`)
      .query({userName})
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    console.log(JSON.parse(folderData.text))
  });

  it('should delete folder by id', () => {
    console.log(parentFolderId, createdFolderId)
    return request(app.getHttpServer())
      .delete(`/folder/${createdFolderId}`)
      .query({userName})
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  });

});