import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import * as request from "supertest";
import AuthSignupDto from "../src/auth/dto/authSignupDto";

describe('Users manipulation', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('Get or create root folder', async () => {
    const dto: AuthSignupDto = {
      userName: 'test',
      password: 'testPassword'
    };
    const data = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(dto)
      .expect(200)
    const token: string = JSON.parse(data.text).token

    const result = await request(app.getHttpServer())
      .get(`/user/root?userName=${dto.userName}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    console.log(JSON.parse(result.text), 'Get or create')
  })
});